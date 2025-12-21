"""
Subscription schemas
"""
from pydantic import BaseModel, Field
from typing import Optional
from enum import Enum


class SubscriptionStatus(str, Enum):
    """Subscription status enum"""
    ACTIVE = "active"
    EXPIRED = "expired"
    CANCELLED = "cancelled"


class SubscriptionOut(BaseModel):
    """Subscription output schema"""
    id: str
    user_id: str
    product_id: str
    order_id: str
    platform_name: str
    plan_name: str
    status: str
    start_date: str
    end_date: str
    credentials: Optional[dict] = None
    created_at: str


class AssignCredentials(BaseModel):
    """Assign OTT credentials to subscription"""
    username: Optional[str] = Field(None, max_length=200)
    password: Optional[str] = Field(None, max_length=200)
    profile_name: Optional[str] = Field(None, max_length=100)
    notes: Optional[str] = Field(None, max_length=500)
    
    class Config:
        json_schema_extra = {
            "example": {
                "username": "user@example.com",
                "password": "password123",
                "profile_name": "Profile 1",
                "notes": "Use profile 1 only"
            }
        }


class UpdateYouTubeEmail(BaseModel):
    """Update YouTube email for subscription"""
    email: str = Field(..., max_length=200, description="New Gmail address")
    
    class Config:
        json_schema_extra = {
            "example": {
                "email": "newemail@gmail.com"
            }
        }
