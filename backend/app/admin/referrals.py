"""
Admin referral routes
"""
from fastapi import APIRouter, Depends, Query
from core.database import get_database
from core.security import require_role
from app.referrals.service import ReferralService
from app.referrals.schemas import WithdrawalApproval


router = APIRouter(prefix="/admin/referrals", tags=["Admin - Referrals"])


@router.get("/stats", summary="Get referral system stats")
async def get_referral_stats(
    current_user: dict = Depends(require_role(["admin"])),
    db = Depends(get_database)
):
    """Get overall referral system statistics"""
    service = ReferralService(db)
    stats = await service.get_admin_referral_stats()
    return stats


@router.get("/withdrawals/pending", summary="Get pending withdrawals")
async def get_pending_withdrawals(
    current_user: dict = Depends(require_role(["admin"])),
    db = Depends(get_database)
):
    """Get all pending withdrawal requests"""
    withdrawals_cursor = db.withdrawal_requests.find({"status": "pending"})
    withdrawals = await withdrawals_cursor.to_list(length=100)
    
    for withdrawal in withdrawals:
        withdrawal["_id"] = str(withdrawal["_id"])
    
    return {"withdrawals": withdrawals}


@router.get("/withdrawals/all", summary="Get all withdrawals")
async def get_all_withdrawals(
    status: str = Query(None, regex="^(pending|approved|rejected)$"),
    current_user: dict = Depends(require_role(["admin"])),
    db = Depends(get_database)
):
    """Get all withdrawal requests with optional status filter"""
    query = {}
    if status:
        query["status"] = status
    
    withdrawals_cursor = db.withdrawal_requests.find(query).sort("created_at", -1)
    withdrawals = await withdrawals_cursor.to_list(length=500)
    
    for withdrawal in withdrawals:
        withdrawal["_id"] = str(withdrawal["_id"])
    
    return {"withdrawals": withdrawals}


@router.put("/withdrawals/{withdrawal_id}/process", summary="Process withdrawal request")
async def process_withdrawal(
    withdrawal_id: str,
    request: WithdrawalApproval,
    current_user: dict = Depends(require_role(["admin"])),
    db = Depends(get_database)
):
    """Approve or reject a withdrawal request"""
    service = ReferralService(db)
    result = await service.process_withdrawal(
        withdrawal_id,
        current_user["_id"],
        request.status,
        request.admin_notes
    )
    return result


@router.get("/commissions", summary="Get all commissions")
async def get_all_commissions(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=500),
    current_user: dict = Depends(require_role(["admin"])),
    db = Depends(get_database)
):
    """Get all referral commissions with pagination"""
    commissions_cursor = db.referral_commissions.find({}).sort("created_at", -1).skip(skip).limit(limit)
    commissions = await commissions_cursor.to_list(length=limit)
    
    for commission in commissions:
        commission["_id"] = str(commission["_id"])
    
    total_count = await db.referral_commissions.count_documents({})
    
    return {
        "commissions": commissions,
        "total": total_count,
        "skip": skip,
        "limit": limit
    }


@router.get("/users/{user_id}/referrals", summary="Get user's referral details")
async def get_user_referrals(
    user_id: str,
    current_user: dict = Depends(require_role(["admin"])),
    db = Depends(get_database)
):
    """Get detailed referral information for a specific user"""
    service = ReferralService(db)
    data = await service.get_referral_dashboard(user_id)
    return data


@router.put("/users/{user_id}/freeze-wallet", summary="Freeze user's referral wallet")
async def freeze_referral_wallet(
    user_id: str,
    freeze: bool = Query(...),
    current_user: dict = Depends(require_role(["admin"])),
    db = Depends(get_database)
):
    """Freeze or unfreeze a user's referral wallet (fraud prevention)"""
    from bson import ObjectId
    from datetime import datetime
    
    result = await db.users.update_one(
        {"_id": ObjectId(user_id)},
        {
            "$set": {
                "referral_wallet_frozen": freeze,
                "updated_at": datetime.utcnow().isoformat()
            }
        }
    )
    
    if result.modified_count == 0:
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail="User not found")
    
    return {
        "message": f"Referral wallet {'frozen' if freeze else 'unfrozen'} successfully",
        "user_id": user_id,
        "frozen": freeze
    }


@router.put("/commission-rate", summary="Update global commission rate")
async def update_commission_rate(
    rate: float = Query(..., gt=0, le=1),
    current_user: dict = Depends(require_role(["admin"])),
    db = Depends(get_database)
):
    """Update the global referral commission rate (default 10%)"""
    # Store in settings collection
    from datetime import datetime
    
    await db.system_settings.update_one(
        {"key": "referral_commission_rate"},
        {
            "$set": {
                "key": "referral_commission_rate",
                "value": rate,
                "updated_by": current_user["_id"],
                "updated_at": datetime.utcnow().isoformat()
            }
        },
        upsert=True
    )
    
    return {
        "message": "Commission rate updated successfully",
        "rate": rate,
        "rate_percentage": rate * 100
    }
