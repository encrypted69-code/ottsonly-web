"""
Order schemas
"""
from pydantic import BaseModel, Field
from typing import Optional
from enum import Enum


class OrderStatus(str, Enum):
    """Order status enum"""
    PENDING = "pending"
    PAID = "paid"
    COMPLETED = "completed"
    REFUNDED = "refunded"


class OrderCreate(BaseModel):
    """Create order request"""
    product_id: str = Field(..., description="Product/Plan ID to purchase")
    
    class Config:
        json_schema_extra = {
            "example": {
                "product_id": "507f1f77bcf86cd799439011"
            }
        }


class OrderOut(BaseModel):
    """Order output schema"""
    id: str
    user_id: str
    product_id: str
    product_name: str
    amount: float
    status: str
    subscription_id: Optional[str] = None
    created_at: str
    paid_at: Optional[str] = None


class RefundRequest(BaseModel):
    """Refund request"""
    reason: Optional[str] = Field(None, max_length=500)
