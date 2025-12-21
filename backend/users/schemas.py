"""
User schemas
"""
from pydantic import BaseModel, Field
from typing import Optional


class UserUpdate(BaseModel):
    """User profile update request"""
    name: Optional[str] = Field(None, max_length=100)
    email: Optional[str] = Field(None, max_length=100)


class UserOut(BaseModel):
    """User output schema"""
    id: str
    phone: str
    name: Optional[str] = None
    email: Optional[str] = None
    role: str
    wallet_balance: float
    created_at: str
