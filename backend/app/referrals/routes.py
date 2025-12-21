"""
Referral API routes - User endpoints
"""
from fastapi import APIRouter, Depends, HTTPException
from core.database import get_database
from core.security import get_current_user
from .service import ReferralService
from .schemas import ReferralCodeApply, WithdrawalRequest


router = APIRouter(prefix="/referrals", tags=["Referrals"])


@router.get("/my-code", summary="Get my referral code")
async def get_my_referral_code(
    current_user: dict = Depends(get_current_user),
    db = Depends(get_database)
):
    """Get or generate user's referral code"""
    service = ReferralService(db)
    code = await service.create_referral_code(current_user["_id"])
    return {"referral_code": code}


@router.post("/apply", summary="Apply referral code")
async def apply_referral_code(
    request: ReferralCodeApply,
    current_user: dict = Depends(get_current_user),
    db = Depends(get_database)
):
    """Apply a referral code (can only be done once)"""
    service = ReferralService(db)
    result = await service.apply_referral_code(current_user["_id"], request.referral_code)
    return result


@router.get("/dashboard", summary="Get referral dashboard")
async def get_referral_dashboard(
    current_user: dict = Depends(get_current_user),
    db = Depends(get_database)
):
    """Get user's referral statistics and earnings"""
    service = ReferralService(db)
    data = await service.get_referral_dashboard(current_user["_id"])
    return data


@router.post("/withdraw", summary="Request referral withdrawal")
async def request_referral_withdrawal(
    request: WithdrawalRequest,
    current_user: dict = Depends(get_current_user),
    db = Depends(get_database)
):
    """Request to withdraw referral earnings"""
    service = ReferralService(db)
    result = await service.request_withdrawal(
        current_user["_id"],
        request.amount,
        request.upi_id
    )
    return result


@router.get("/withdrawal-history", summary="Get withdrawal history")
async def get_withdrawal_history(
    current_user: dict = Depends(get_current_user),
    db = Depends(get_database)
):
    """Get user's withdrawal request history"""
    withdrawals_cursor = db.withdrawal_requests.find({"user_id": current_user["_id"]})
    withdrawals = await withdrawals_cursor.to_list(length=100)
    
    for withdrawal in withdrawals:
        withdrawal["_id"] = str(withdrawal["_id"])
    
    return {"withdrawals": withdrawals}
