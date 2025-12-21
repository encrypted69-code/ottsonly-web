"""
Wallet schemas
"""
from pydantic import BaseModel, Field
from typing import Optional


class AddMoneyRequest(BaseModel):
    """Add money to wallet via Razorpay"""
    amount: float = Field(..., gt=0, description="Amount to add in INR")
    
    class Config:
        json_schema_extra = {
            "example": {
                "amount": 1000.0
            }
        }


class VerifyPaymentRequest(BaseModel):
    """Verify Razorpay payment"""
    razorpay_order_id: str
    razorpay_payment_id: str
    razorpay_signature: str


class AdminWalletOperation(BaseModel):
    """Admin wallet credit/debit"""
    user_id: str
    amount: float = Field(..., gt=0)
    operation: str = Field(..., description="credit or debit")
    description: Optional[str] = Field(None, max_length=500)
    
    class Config:
        json_schema_extra = {
            "example": {
                "user_id": "507f1f77bcf86cd799439011",
                "amount": 500.0,
                "operation": "credit",
                "description": "Promotional bonus"
            }
        }


class WalletTransactionOut(BaseModel):
    """Wallet transaction output"""
    id: str
    user_id: str
    type: str
    amount: float
    balance_after: float
    reference_type: Optional[str] = None
    reference_id: Optional[str] = None
    description: str
    created_at: str
