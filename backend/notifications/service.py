"""
Notification service
"""
from datetime import datetime
from motor.motor_asyncio import AsyncIOMotorDatabase
from bson import ObjectId
from fastapi import HTTPException, status


class NotificationService:
    """Notification management service"""
    
    def __init__(self, db: AsyncIOMotorDatabase):
        self.db = db
    
    async def create_notification(self, user_id: str, title: str, message: str, type: str = "info") -> dict:
        """Create notification for a user"""
        notification = {
            "user_id": user_id,
            "title": title,
            "message": message,
            "type": type,
            "is_read": False,
            "created_at": datetime.utcnow().isoformat()
        }
        
        result = await self.db.notifications.insert_one(notification)
        notification["_id"] = str(result.inserted_id)
        
        return notification
    
    async def get_user_notifications(
        self, 
        user_id: str, 
        skip: int = 0, 
        limit: int = 100, 
        unread_only: bool = False
    ) -> list:
        """Get user's notifications"""
        query = {"user_id": user_id}
        if unread_only:
            query["is_read"] = False
        
        cursor = self.db.notifications.find(query).sort("created_at", -1).skip(skip).limit(limit)
        notifications = await cursor.to_list(length=limit)
        
        for notif in notifications:
            notif["_id"] = str(notif["_id"])
        
        return notifications
    
    async def mark_as_read(self, notification_id: str, user_id: str) -> dict:
        """Mark notification as read"""
        try:
            result = await self.db.notifications.update_one(
                {"_id": ObjectId(notification_id), "user_id": user_id},
                {"$set": {"is_read": True}}
            )
        except:
            raise HTTPException(status_code=400, detail="Invalid notification ID")
        
        if result.matched_count == 0:
            raise HTTPException(status_code=404, detail="Notification not found")
        
        notification = await self.db.notifications.find_one({"_id": ObjectId(notification_id)})
        notification["_id"] = str(notification["_id"])
        
        return notification
    
    async def mark_all_as_read(self, user_id: str) -> int:
        """Mark all notifications as read for a user"""
        result = await self.db.notifications.update_many(
            {"user_id": user_id, "is_read": False},
            {"$set": {"is_read": True}}
        )
        
        return result.modified_count
    
    async def get_unread_count(self, user_id: str) -> int:
        """Get count of unread notifications"""
        count = await self.db.notifications.count_documents({
            "user_id": user_id,
            "is_read": False
        })
        
        return count
    
    async def send_bulk_notification(
        self, 
        title: str, 
        message: str, 
        type: str = "info",
        target_audience: str = "all",
        action_url: str = None,
        priority: str = "normal"
    ) -> int:
        """Send notification to users based on target audience"""
        # Build user query based on target audience
        user_query = {}
        
        if target_audience == "active":
            # Users with active subscriptions
            user_query = {"subscription_status": "active"}
        elif target_audience == "inactive":
            # Users without active subscriptions
            user_query = {"$or": [
                {"subscription_status": {"$ne": "active"}},
                {"subscription_status": {"$exists": False}}
            ]}
        elif target_audience == "premium":
            # Premium tier users
            user_query = {"tier": "premium"}
        elif target_audience == "new":
            # Users created in last 7 days
            from datetime import timedelta
            seven_days_ago = (datetime.utcnow() - timedelta(days=7)).isoformat()
            user_query = {"created_at": {"$gte": seven_days_ago}}
        # else "all" or "custom" - no filter
        
        # Get target users
        cursor = self.db.users.find(user_query, {"_id": 1})
        users = await cursor.to_list(length=None)
        
        if not users:
            return 0
        
        # Create notifications for all target users
        notifications = [
            {
                "user_id": str(user["_id"]),
                "title": title,
                "message": message,
                "type": type,
                "action_url": action_url,
                "priority": priority,
                "is_read": False,
                "created_at": datetime.utcnow().isoformat()
            }
            for user in users
        ]
        
        result = await self.db.notifications.insert_many(notifications)
        
        # Store notification send history
        history_entry = {
            "title": title,
            "message": message,
            "type": type,
            "target_audience": target_audience,
            "action_url": action_url,
            "priority": priority,
            "recipients_count": len(result.inserted_ids),
            "sent_at": datetime.utcnow().isoformat()
        }
        await self.db.notification_history.insert_one(history_entry)
        
        return len(result.inserted_ids)
    
    async def get_notification_history(self, skip: int = 0, limit: int = 50) -> list:
        """Get notification send history"""
        cursor = self.db.notification_history.find({}).sort("sent_at", -1).skip(skip).limit(limit)
        history = await cursor.to_list(length=limit)
        
        for entry in history:
            entry["_id"] = str(entry["_id"])
            
            # Calculate open and click rates
            notifications = await self.db.notifications.find({
                "title": entry["title"],
                "created_at": entry["sent_at"]
            }).to_list(length=None)
            
            opened_count = sum(1 for n in notifications if n.get("is_read", False))
            clicked_count = sum(1 for n in notifications if n.get("clicked", False))
            
            entry["opened_count"] = opened_count
            entry["clicked_count"] = clicked_count
        
        return history
    
    async def get_notification_stats(self) -> dict:
        """Get notification statistics"""
        total_sent = await self.db.notifications.count_documents({})
        total_opened = await self.db.notifications.count_documents({"is_read": True})
        total_clicked = await self.db.notifications.count_documents({"clicked": True})
        
        open_rate = (total_opened / total_sent * 100) if total_sent > 0 else 0
        click_rate = (total_clicked / total_sent * 100) if total_sent > 0 else 0
        
        return {
            "total_sent": total_sent,
            "total_opened": total_opened,
            "total_clicked": total_clicked,
            "open_rate": round(open_rate, 1),
            "click_rate": round(click_rate, 1)
        }
    
    async def delete_notification(self, notification_id: str, user_id: str) -> bool:
        """Delete a notification"""
        try:
            result = await self.db.notifications.delete_one({
                "_id": ObjectId(notification_id),
                "user_id": user_id
            })
        except:
            raise HTTPException(status_code=400, detail="Invalid notification ID")
        
        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Notification not found")
        
        return True
