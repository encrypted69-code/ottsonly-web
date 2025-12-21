"""
Notification API routes
"""
from fastapi import APIRouter, Depends, Query
from core.database import get_database
from core.security import get_current_user, require_role
from .schemas import NotificationOut, BulkNotificationRequest
from .service import NotificationService


router = APIRouter(prefix="/notifications", tags=["Notifications"])


@router.get("/", summary="Get my notifications")
async def get_notifications(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    unread_only: bool = Query(False, description="Show only unread notifications"),
    current_user: dict = Depends(get_current_user),
    db=Depends(get_database)
):
    """Get authenticated user's notifications"""
    service = NotificationService(db)
    notifications = await service.get_user_notifications(
        current_user["_id"], 
        skip, 
        limit, 
        unread_only
    )
    
    return {
        "notifications": [
            {
                "id": n["_id"],
                "user_id": n["user_id"],
                "title": n["title"],
                "message": n["message"],
                "type": n["type"],
                "is_read": n["is_read"],
                "created_at": n["created_at"]
            }
            for n in notifications
        ],
        "count": len(notifications)
    }


@router.get("/unread-count", summary="Get unread notification count")
async def get_unread_count(
    current_user: dict = Depends(get_current_user),
    db=Depends(get_database)
):
    """Get count of unread notifications"""
    service = NotificationService(db)
    count = await service.get_unread_count(current_user["_id"])
    return {"unread_count": count}


@router.post("/{notification_id}/read", summary="Mark notification as read")
async def mark_as_read(
    notification_id: str,
    current_user: dict = Depends(get_current_user),
    db=Depends(get_database)
):
    """Mark specific notification as read"""
    service = NotificationService(db)
    notification = await service.mark_as_read(notification_id, current_user["_id"])
    
    return {
        "message": "Notification marked as read",
        "notification": {
            "id": notification["_id"],
            "is_read": notification["is_read"]
        }
    }


@router.post("/mark-all-read", summary="Mark all notifications as read")
async def mark_all_as_read(
    current_user: dict = Depends(get_current_user),
    db=Depends(get_database)
):
    """Mark all notifications as read"""
    service = NotificationService(db)
    count = await service.mark_all_as_read(current_user["_id"])
    
    return {
        "message": f"{count} notifications marked as read",
        "count": count
    }


@router.delete("/{notification_id}", summary="Delete notification")
async def delete_notification(
    notification_id: str,
    current_user: dict = Depends(get_current_user),
    db=Depends(get_database)
):
    """Delete a notification"""
    service = NotificationService(db)
    await service.delete_notification(notification_id, current_user["_id"])
    
    return {"message": "Notification deleted successfully"}


@router.post("/bulk", summary="Send bulk notification (Admin only)")
async def send_bulk_notification(
    request: BulkNotificationRequest,
    current_user: dict = Depends(require_role(["admin"])),
    db=Depends(get_database)
):
    """
    Send notification to all users (admin only)
    
    Useful for announcements, maintenance alerts, etc.
    """
    service = NotificationService(db)
    count = await service.send_bulk_notification(
        request.title,
        request.message,
        request.type,
        request.target_audience,
        request.action_url,
        request.priority
    )
    
    return {
        "message": "Bulk notification sent successfully",
        "users_notified": count
    }


@router.get("/admin/history", summary="Get notification history (Admin only)")
async def get_notification_history(
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    current_user: dict = Depends(require_role(["admin"])),
    db=Depends(get_database)
):
    """Get notification send history for admin"""
    service = NotificationService(db)
    history = await service.get_notification_history(skip, limit)
    
    return {
        "history": history,
        "count": len(history)
    }


@router.get("/admin/stats", summary="Get notification stats (Admin only)")
async def get_notification_stats(
    current_user: dict = Depends(require_role(["admin"])),
    db=Depends(get_database)
):
    """Get notification statistics"""
    service = NotificationService(db)
    stats = await service.get_notification_stats()
    
    return stats
