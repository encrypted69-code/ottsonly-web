"""
Subscription API routes
"""
from fastapi import APIRouter, Depends, Query, HTTPException
from core.database import get_database
from core.security import get_current_user, require_role
from .schemas import SubscriptionOut, AssignCredentials, UpdateYouTubeEmail
from .service import SubscriptionService


router = APIRouter(prefix="/subscriptions", tags=["Subscriptions"])


@router.get("/my-subscriptions", summary="Get my subscriptions")
async def get_my_subscriptions(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    current_user: dict = Depends(get_current_user),
    db=Depends(get_database)
):
    """Get authenticated user's subscriptions"""
    service = SubscriptionService(db)
    subscriptions = await service.list_user_subscriptions(current_user["_id"], skip, limit)
    
    return {
        "subscriptions": [
            {
                "id": s["_id"],
                "user_id": s["user_id"],
                "product_id": s["product_id"],
                "order_id": s["order_id"],
                "platform_name": s["platform_name"],
                "plan_name": s["plan_name"],
                "status": s["status"],
                "start_date": s["start_date"],
                "end_date": s["end_date"],
                "credentials": s.get("credentials"),
                "youtube_email": s.get("youtube_email"),
                "youtube_email_edit_count": s.get("youtube_email_edit_count", 0),
                "youtube_email_max_edits": s.get("youtube_email_max_edits", 1),
                "created_at": s["created_at"]
            }
            for s in subscriptions
        ],
        "count": len(subscriptions)
    }


@router.get("/", summary="List all subscriptions (Admin only)")
async def list_subscriptions(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    status: str = Query(None, description="Filter by status: active, expired, cancelled"),
    current_user: dict = Depends(require_role(["admin", "support"])),
    db=Depends(get_database)
):
    """List all subscriptions (admin/support only)"""
    service = SubscriptionService(db)
    subscriptions = await service.list_all_subscriptions(skip, limit, status)
    
    return {
        "subscriptions": [
            {
                "id": s["_id"],
                "user_id": s["user_id"],
                "product_id": s["product_id"],
                "order_id": s["order_id"],
                "platform_name": s["platform_name"],
                "plan_name": s["plan_name"],
                "status": s["status"],
                "start_date": s["start_date"],
                "end_date": s["end_date"],
                "credentials": s.get("credentials"),
                "created_at": s["created_at"]
            }
            for s in subscriptions
        ],
        "count": len(subscriptions)
    }


@router.get("/{subscription_id}", response_model=SubscriptionOut, summary="Get subscription by ID")
async def get_subscription(
    subscription_id: str,
    current_user: dict = Depends(get_current_user),
    db=Depends(get_database)
):
    """Get subscription details"""
    service = SubscriptionService(db)
    subscription = await service.get_subscription_by_id(subscription_id)
    
    # Check if user owns this subscription or is admin
    if subscription["user_id"] != current_user["_id"] and current_user.get("role") not in ["admin", "support"]:
        raise HTTPException(status_code=403, detail="Access denied")
    
    return {
        "id": subscription["_id"],
        "user_id": subscription["user_id"],
        "product_id": subscription["product_id"],
        "order_id": subscription["order_id"],
        "platform_name": subscription["platform_name"],
        "plan_name": subscription["plan_name"],
        "status": subscription["status"],
        "start_date": subscription["start_date"],
        "end_date": subscription["end_date"],
        "credentials": subscription.get("credentials"),
        "created_at": subscription["created_at"]
    }


@router.post("/{subscription_id}/assign-credentials", summary="Assign credentials (Admin only)")
async def assign_credentials(
    subscription_id: str,
    request: AssignCredentials,
    current_user: dict = Depends(require_role(["admin"])),
    db=Depends(get_database)
):
    """
    Assign OTT credentials to subscription (admin only)
    
    Admin manually assigns login credentials after purchasing
    """
    service = SubscriptionService(db)
    subscription = await service.assign_credentials(subscription_id, request.model_dump())
    
    return {
        "message": "Credentials assigned successfully",
        "subscription": {
            "id": subscription["_id"],
            "platform_name": subscription["platform_name"],
            "credentials": subscription.get("credentials")
        }
    }


@router.post("/{subscription_id}/cancel", summary="Cancel subscription (Admin only)")
async def cancel_subscription(
    subscription_id: str,
    current_user: dict = Depends(require_role(["admin"])),
    db=Depends(get_database)
):
    """Cancel subscription (admin only)"""
    service = SubscriptionService(db)
    subscription = await service.cancel_subscription(subscription_id)
    
    return {
        "message": "Subscription cancelled successfully",
        "subscription": {
            "id": subscription["_id"],
            "status": subscription["status"]
        }
    }


@router.put("/{subscription_id}/update-youtube-email", summary="Update YouTube email")
async def update_youtube_email(
    subscription_id: str,
    request: UpdateYouTubeEmail,
    current_user: dict = Depends(get_current_user),
    db=Depends(get_database)
):
    """Update YouTube email for subscription (user can edit once)"""
    service = SubscriptionService(db)
    
    # Get subscription and verify ownership
    subscription = await service.get_subscription_by_id(subscription_id)
    if subscription["user_id"] != current_user["_id"]:
        raise HTTPException(status_code=403, detail="Access denied")
    
    # Update email
    updated_subscription = await service.update_youtube_email(subscription_id, request.email)
    
    return {
        "message": "YouTube email updated successfully",
        "subscription": {
            "id": updated_subscription["_id"],
            "youtube_email": updated_subscription.get("youtube_email"),
            "youtube_email_edit_count": updated_subscription.get("youtube_email_edit_count"),
            "youtube_email_max_edits": updated_subscription.get("youtube_email_max_edits")
        }
    }
