"""
YouTube request service
"""
from datetime import datetime
from motor.motor_asyncio import AsyncIOMotorDatabase
from bson import ObjectId
from fastapi import HTTPException


class YouTubeRequestService:
    """YouTube request management service"""
    
    def __init__(self, db: AsyncIOMotorDatabase):
        self.db = db
    
    async def create_request(self, user_id: str, subscription_id: str, youtube_email: str) -> dict:
        """Create YouTube email request"""
        # Get user details
        user = await self.db.users.find_one({"_id": ObjectId(user_id)})
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        
        # Get subscription details
        try:
            subscription = await self.db.subscriptions.find_one({"_id": ObjectId(subscription_id)})
        except:
            raise HTTPException(status_code=400, detail="Invalid subscription ID")
        
        if not subscription:
            raise HTTPException(status_code=404, detail="Subscription not found")
        
        # Create request
        request = {
            "user_id": user_id,
            "username": user.get("name", "Unknown"),
            "registered_email": user.get("email", ""),
            "subscription_id": subscription_id,
            "youtube_email": youtube_email,
            "platform_name": subscription.get("platform_name", ""),
            "plan_name": subscription.get("plan_name", ""),
            "status": "pending",
            "admin_notes": None,
            "created_at": datetime.utcnow().isoformat(),
            "updated_at": datetime.utcnow().isoformat()
        }
        
        result = await self.db.youtube_requests.insert_one(request)
        request["_id"] = str(result.inserted_id)
        
        return request
    
    async def get_request_by_id(self, request_id: str) -> dict:
        """Get YouTube request by ID"""
        try:
            request = await self.db.youtube_requests.find_one({"_id": ObjectId(request_id)})
        except:
            raise HTTPException(status_code=400, detail="Invalid request ID")
        
        if not request:
            raise HTTPException(status_code=404, detail="Request not found")
        
        request["_id"] = str(request["_id"])
        return request
    
    async def list_requests(self, skip: int = 0, limit: int = 100, status: str = None) -> list:
        """List all YouTube requests (admin)"""
        query = {}
        if status:
            query["status"] = status
        
        cursor = self.db.youtube_requests.find(query).sort("created_at", -1).skip(skip).limit(limit)
        requests = await cursor.to_list(length=limit)
        
        for req in requests:
            req["_id"] = str(req["_id"])
        
        return requests
    
    async def update_request_status(self, request_id: str, status: str, notes: str = None) -> dict:
        """Update request status (admin only)"""
        if status not in ["pending", "done"]:
            raise HTTPException(status_code=400, detail="Invalid status")
        
        update_data = {
            "status": status,
            "updated_at": datetime.utcnow().isoformat()
        }
        
        if notes:
            update_data["admin_notes"] = notes
        
        try:
            result = await self.db.youtube_requests.update_one(
                {"_id": ObjectId(request_id)},
                {"$set": update_data}
            )
        except:
            raise HTTPException(status_code=400, detail="Invalid request ID")
        
        if result.matched_count == 0:
            raise HTTPException(status_code=404, detail="Request not found")
        
        return await self.get_request_by_id(request_id)
    
    async def get_user_requests(self, user_id: str) -> list:
        """Get user's YouTube requests"""
        cursor = self.db.youtube_requests.find({"user_id": user_id}).sort("created_at", -1)
        requests = await cursor.to_list(length=100)
        
        for req in requests:
            req["_id"] = str(req["_id"])
        
        return requests
    
    async def get_request_by_subscription(self, subscription_id: str, user_id: str) -> dict:
        """Get YouTube request by subscription ID (user must own subscription)"""
        try:
            request = await self.db.youtube_requests.find_one({
                "subscription_id": subscription_id,
                "user_id": user_id
            })
        except:
            return None
        
        if not request:
            return None
        
        request["_id"] = str(request["_id"])
        return request

