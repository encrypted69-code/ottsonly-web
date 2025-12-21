"""
Admin routes for user management
"""
from fastapi import APIRouter, Depends, Query
from core.database import get_database
from core.security import get_current_user, require_role
from typing import Optional

router = APIRouter(prefix="/admin", tags=["Admin"])


@router.get("/users", summary="Get all users (Admin only)")
async def get_all_users(
    search: Optional[str] = Query(None, description="Search by name, email, or phone"),
    status: Optional[str] = Query(None, description="Filter by status: active, blocked"),
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    current_user: dict = Depends(require_role(["admin"])),
    db = Depends(get_database)
):
    """Get all users with optional search and filters"""
    query = {}
    
    # Search filter
    if search:
        query["$or"] = [
            {"name": {"$regex": search, "$options": "i"}},
            {"email": {"$regex": search, "$options": "i"}},
            {"phone": {"$regex": search, "$options": "i"}}
        ]
    
    # Status filter
    if status:
        if status == "active":
            query["is_active"] = True
        elif status == "blocked":
            query["is_active"] = False
    
    # Fetch users
    users_cursor = db.users.find(query).skip(skip).limit(limit)
    users = await users_cursor.to_list(length=limit)
    
    # Transform users
    result_users = []
    for user in users:
        result_users.append({
            "id": str(user["_id"]),
            "name": user.get("name", ""),
            "email": user.get("email", ""),
            "phone": user.get("phone", ""),
            "role": user.get("role", "user"),
            "wallet_balance": user.get("wallet_balance", 0.0),
            "is_active": user.get("is_active", True),
            "created_at": user.get("created_at", ""),
            "last_login": user.get("last_login"),
            "email_verified": user.get("email_verified", False),
            "phone_verified": user.get("phone_verified", False)
        })
    
    return {
        "users": result_users,
        "total": len(result_users),
        "skip": skip,
        "limit": limit
    }


@router.get("/users/{user_id}", summary="Get user by ID (Admin only)")
async def get_user_by_id(
    user_id: str,
    current_user: dict = Depends(require_role(["admin"])),
    db = Depends(get_database)
):
    """Get specific user details by ID"""
    from bson import ObjectId
    
    user = await db.users.find_one({"_id": ObjectId(user_id)})
    if not user:
        from fastapi import HTTPException, status
        raise HTTPException(status_code=404, detail="User not found")
    
    return {
        "id": str(user["_id"]),
        "name": user.get("name", ""),
        "email": user.get("email", ""),
        "phone": user.get("phone", ""),
        "role": user.get("role", "user"),
        "wallet_balance": user.get("wallet_balance", 0.0),
        "is_active": user.get("is_active", True),
        "created_at": user.get("created_at", ""),
        "last_login": user.get("last_login"),
        "email_verified": user.get("email_verified", False),
        "phone_verified": user.get("phone_verified", False)
    }


@router.post("/users/{user_id}/block", summary="Block user (Admin only)")
async def block_user(
    user_id: str,
    current_user: dict = Depends(require_role(["admin"])),
    db = Depends(get_database)
):
    """Block a user account"""
    from bson import ObjectId
    from datetime import datetime
    
    result = await db.users.update_one(
        {"_id": ObjectId(user_id)},
        {"$set": {"is_active": False, "updated_at": datetime.utcnow().isoformat()}}
    )
    
    if result.matched_count == 0:
        from fastapi import HTTPException, status
        raise HTTPException(status_code=404, detail="User not found")
    
    return {"message": "User blocked successfully"}


@router.post("/users/{user_id}/unblock", summary="Unblock user (Admin only)")
async def unblock_user(
    user_id: str,
    current_user: dict = Depends(require_role(["admin"])),
    db = Depends(get_database)
):
    """Unblock a user account"""
    from bson import ObjectId
    from datetime import datetime
    
    result = await db.users.update_one(
        {"_id": ObjectId(user_id)},
        {"$set": {"is_active": True, "updated_at": datetime.utcnow().isoformat()}}
    )
    
    if result.matched_count == 0:
        from fastapi import HTTPException, status
        raise HTTPException(status_code=404, detail="User not found")
    
    return {"message": "User unblocked successfully"}


@router.post("/users/{user_id}/wallet-credit", summary="Credit user wallet (Admin only)")
async def credit_user_wallet(
    user_id: str,
    amount: float = Query(..., gt=0),
    reason: str = Query(..., min_length=1),
    current_user: dict = Depends(require_role(["admin"])),
    db = Depends(get_database)
):
    """Credit amount to user wallet"""
    from bson import ObjectId
    from datetime import datetime
    from fastapi import HTTPException, status
    
    # Update wallet balance atomically to prevent race conditions
    updated_user = await db.users.find_one_and_update(
        {"_id": ObjectId(user_id)},
        {
            "$inc": {"wallet_balance": amount},
            "$set": {"updated_at": datetime.utcnow().isoformat()}
        },
        return_document=True
    )
    
    if not updated_user:
        raise HTTPException(status_code=404, detail="User not found")
    
    new_balance = updated_user["wallet_balance"]
    
    # Log transaction
    txn_result = await db.wallet_transactions.insert_one({
        "user_id": user_id,
        "type": "credit",
        "amount": amount,
        "description": f"Added by admin - {reason}",
        "reference_type": "admin",
        "reference_id": current_user["_id"],
        "balance_after": new_balance,
        "created_at": datetime.utcnow().isoformat()
    })
    
    # ✅ REFERRAL COMMISSION: Credit referrer even for admin credits (testing/promo)
    try:
        from app.referrals.service import ReferralService
        referral_service = ReferralService(db)
        await referral_service.credit_referral_commission(
            referred_user_id=user_id,
            topup_amount=amount,
            transaction_id=str(txn_result.inserted_id)
        )
    except Exception as e:
        # Log error but don't fail the wallet credit
        print(f"Referral commission error: {e}")
    
    return {
        "message": "Wallet credited successfully",
        "new_balance": new_balance
    }


@router.post("/users/{user_id}/wallet-debit", summary="Debit user wallet (Admin only)")
async def debit_user_wallet(
    user_id: str,
    amount: float = Query(..., gt=0),
    reason: str = Query(..., min_length=1),
    current_user: dict = Depends(require_role(["admin"])),
    db = Depends(get_database)
):
    """Debit amount from user wallet"""
    from bson import ObjectId
    from datetime import datetime
    from fastapi import HTTPException, status
    
    # Atomically check balance and debit in single operation to prevent race conditions
    updated_user = await db.users.find_one_and_update(
        {
            "_id": ObjectId(user_id),
            "wallet_balance": {"$gte": amount}  # Atomic balance check
        },
        {
            "$inc": {"wallet_balance": -amount},
            "$set": {"updated_at": datetime.utcnow().isoformat()}
        },
        return_document=True
    )
    
    if not updated_user:
        # Either user not found or insufficient balance
        user_exists = await db.users.find_one({"_id": ObjectId(user_id)}, {"wallet_balance": 1})
        if not user_exists:
            raise HTTPException(status_code=404, detail="User not found")
        raise HTTPException(status_code=400, detail="Insufficient wallet balance")
    
    new_balance = updated_user["wallet_balance"]
    
    # Log transaction
    await db.wallet_transactions.insert_one({
        "user_id": user_id,
        "type": "debit",
        "amount": amount,
        "description": f"Deducted by admin - {reason}",
        "reference_type": "admin",
        "reference_id": current_user["_id"],
        "balance_after": new_balance,
        "created_at": datetime.utcnow().isoformat()
    })
    
    return {
        "message": "Wallet debited successfully",
        "new_balance": new_balance
    }


@router.post("/users/{user_id}/force-logout", summary="Force logout user (Admin only)")
async def force_logout_user(
    user_id: str,
    current_user: dict = Depends(require_role(["admin"])),
    db = Depends(get_database)
):
    """Force logout user from all devices"""
    from bson import ObjectId
    from datetime import datetime
    
    result = await db.users.update_one(
        {"_id": ObjectId(user_id)},
        {
            "$unset": {"refresh_token": ""},
            "$set": {"updated_at": datetime.utcnow().isoformat()}
        }
    )
    
    if result.matched_count == 0:
        from fastapi import HTTPException, status
        raise HTTPException(status_code=404, detail="User not found")
    
    return {"message": "User logged out from all devices"}
