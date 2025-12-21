"""
User API routes
"""
from fastapi import APIRouter, Depends, Query
from core.database import get_database
from core.security import get_current_user, require_role
from .schemas import UserUpdate, UserOut
from .service import UserService


router = APIRouter(prefix="/users", tags=["Users"])


@router.get("/me", response_model=UserOut, summary="Get my profile")
async def get_my_profile(current_user: dict = Depends(get_current_user)):
    """Get authenticated user's profile"""
    return {
        "id": current_user["_id"],
        "phone": current_user["phone"],
        "name": current_user.get("name"),
        "email": current_user.get("email"),
        "role": current_user["role"],
        "wallet_balance": current_user.get("wallet_balance", 0.0),
        "created_at": current_user.get("created_at")
    }


@router.patch("/me", response_model=UserOut, summary="Update my profile")
async def update_my_profile(
    update_data: UserUpdate,
    current_user: dict = Depends(get_current_user),
    db=Depends(get_database)
):
    """Update authenticated user's profile"""
    service = UserService(db)
    user = await service.update_user_profile(current_user["_id"], update_data.model_dump())
    return {
        "id": user["_id"],
        "phone": user["phone"],
        "name": user.get("name"),
        "email": user.get("email"),
        "role": user["role"],
        "wallet_balance": user.get("wallet_balance", 0.0),
        "created_at": user.get("created_at")
    }


@router.get("/", summary="List all users (Admin only)")
async def list_users(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    current_user: dict = Depends(require_role(["admin"])),
    db=Depends(get_database)
):
    """List all users with pagination (admin only)"""
    service = UserService(db)
    users = await service.list_users(skip, limit)
    return {"users": users, "count": len(users)}


@router.get("/{user_id}", response_model=UserOut, summary="Get user by ID (Admin only)")
async def get_user(
    user_id: str,
    current_user: dict = Depends(require_role(["admin", "support"])),
    db=Depends(get_database)
):
    """Get specific user by ID (admin/support only)"""
    service = UserService(db)
    user = await service.get_user_by_id(user_id)
    return {
        "id": user["_id"],
        "phone": user["phone"],
        "name": user.get("name"),
        "email": user.get("email"),
        "role": user["role"],
        "wallet_balance": user.get("wallet_balance", 0.0),
        "created_at": user.get("created_at")
    }
