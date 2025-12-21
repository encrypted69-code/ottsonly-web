"""
YouTube request API routes
"""
from fastapi import APIRouter, Depends, Query
from core.database import get_database
from core.security import get_current_user, require_role
from .schemas import YouTubeRequestCreate, YouTubeRequestOut, YouTubeRequestUpdate
from .service import YouTubeRequestService


router = APIRouter(prefix="/youtube", tags=["YouTube"])


@router.post("/request", summary="Submit YouTube email request")
async def create_request(
    request: YouTubeRequestCreate,
    current_user: dict = Depends(get_current_user),
    db=Depends(get_database)
):
    """
    Submit YouTube email request
    User submits their Gmail to be added to YouTube Family
    """
    service = YouTubeRequestService(db)
    youtube_request = await service.create_request(
        current_user["_id"],
        request.subscription_id,
        request.youtube_email
    )
    
    return {
        "message": "YouTube email request submitted successfully",
        "request": {
            "id": youtube_request["_id"],
            "subscription_id": youtube_request["subscription_id"],
            "youtube_email": youtube_request["youtube_email"],
            "status": youtube_request["status"]
        }
    }


@router.get("/my-requests", summary="Get my YouTube requests")
async def get_my_requests(
    current_user: dict = Depends(get_current_user),
    db=Depends(get_database)
):
    """Get authenticated user's YouTube requests"""
    service = YouTubeRequestService(db)
    requests = await service.get_user_requests(current_user["_id"])
    
    return {
        "requests": [
            {
                "id": r["_id"],
                "subscription_id": r["subscription_id"],
                "youtube_email": r["youtube_email"],
                "platform_name": r.get("platform_name"),
                "plan_name": r.get("plan_name"),
                "status": r["status"],
                "admin_notes": r.get("admin_notes"),
                "created_at": r["created_at"]
            }
            for r in requests
        ],
        "count": len(requests)
    }


@router.get("/request/subscription/{subscription_id}", summary="Get YouTube request by subscription")
async def get_request_by_subscription(
    subscription_id: str,
    current_user: dict = Depends(get_current_user),
    db=Depends(get_database)
):
    """Get YouTube request status for a specific subscription"""
    service = YouTubeRequestService(db)
    request = await service.get_request_by_subscription(subscription_id, current_user["_id"])
    
    if not request:
        return {
            "request": None,
            "status": "not_submitted"
        }
    
    return {
        "request": {
            "id": request["_id"],
            "subscription_id": request["subscription_id"],
            "youtube_email": request["youtube_email"],
            "status": request["status"],
            "admin_notes": request.get("admin_notes"),
            "created_at": request["created_at"],
            "updated_at": request["updated_at"]
        },
        "status": request["status"]
    }
