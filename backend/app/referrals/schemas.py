"""
Referral schemas
"""
from pydantic import BaseModel, Field, validator
from typing import Optional
from datetime import datetime


class ReferralCodeApply(BaseModel):
    """Apply referral code during signup"""
    referral_code: str = Field(..., min_length=6, max_length=20)


class ReferralDashboardOut(BaseModel):
    """Referral dashboard data"""
    referral_code: str
    total_referrals: int
    active_referrals: int
    total_earnings: float
    withdrawable_balance: float
    referrals: list


class ReferralCommissionOut(BaseModel):
    """Referral commission transaction"""
    id: str
    referred_user_id: str
    referred_user_name: str
    amount_added: float
    commission_amount: float
    created_at: str


class WithdrawalRequest(BaseModel):
    """Withdrawal request"""
    amount: float = Field(..., gt=0)
    upi_id: str = Field(..., min_length=3, max_length=100, description="UPI ID for payment")
    
    class Config:
        json_schema_extra = {
            "example": {
                "amount": 500.0,
                "upi_id": "user@paytm"
            }
        }


class WithdrawalRequestOut(BaseModel):
    """Withdrawal request output"""
    id: str
    user_id: str
    user_name: str
    user_email: str
    amount: float
    upi_id: str
    status: str  # pending, approved, rejected
    created_at: str
    processed_at: Optional[str] = None
    admin_notes: Optional[str] = None
    admin_notes: Optional[str] = None


class WithdrawalApproval(BaseModel):
    """Admin withdrawal approval"""
    status: str = Field(..., pattern="^(approved|rejected)$")
    admin_notes: Optional[str] = None
