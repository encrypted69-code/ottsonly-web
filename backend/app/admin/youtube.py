"""
Admin YouTube request management routes
"""
from fastapi import APIRouter, Depends, Query
from core.database import get_database
from core.security import require_role
from app.youtube.service import YouTubeRequestService
from app.youtube.schemas import YouTubeRequestUpdate


router = APIRouter(prefix="/admin/youtube", tags=["Admin - YouTube"])


@router.get("/requests", summary="List all YouTube requests (Admin)")
async def list_youtube_requests(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    status: str = Query(None, description="Filter by status: pending, done"),
    current_user: dict = Depends(require_role(["admin"])),
    db=Depends(get_database)
):
    """List all YouTube email requests (admin only)"""
    service = YouTubeRequestService(db)
    requests = await service.list_requests(skip, limit, status)
    
    return {
        "requests": [
            {
                "id": r["_id"],
                "user_id": r["user_id"],
                "username": r["username"],
                "registered_email": r["registered_email"],
                "subscription_id": r["subscription_id"],
                "youtube_email": r["youtube_email"],
                "platform_name": r.get("platform_name"),
                "plan_name": r.get("plan_name"),
                "status": r["status"],
                "admin_notes": r.get("admin_notes"),
                "created_at": r["created_at"],
                "updated_at": r["updated_at"]
            }
            for r in requests
        ],
        "count": len(requests)
    }


@router.post("/{request_id}/done", summary="Mark request as done (Admin)")
async def mark_request_done(
    request_id: str,
    request: YouTubeRequestUpdate,
    current_user: dict = Depends(require_role(["admin"])),
    db=Depends(get_database)
):
    """Mark YouTube request as done (admin only)"""
    service = YouTubeRequestService(db)
    updated_request = await service.update_request_status(
        request_id,
        "done",
        request.notes
    )
    
    return {
        "message": "Request marked as done",
        "request": {
            "id": updated_request["_id"],
            "status": updated_request["status"],
            "admin_notes": updated_request.get("admin_notes")
        }
    }


@router.post("/{request_id}/undo", summary="Undo request (Admin)")
async def undo_request(
    request_id: str,
    request: YouTubeRequestUpdate,
    current_user: dict = Depends(require_role(["admin"])),
    db=Depends(get_database)
):
    """Undo YouTube request back to pending (admin only)"""
    service = YouTubeRequestService(db)
    updated_request = await service.update_request_status(
        request_id,
        "pending",
        request.notes
    )
    
    return {
        "message": "Request status updated to pending",
        "request": {
            "id": updated_request["_id"],
            "status": updated_request["status"],
            "admin_notes": updated_request.get("admin_notes")
        }
    }
