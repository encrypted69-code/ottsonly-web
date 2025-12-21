"""
YouTube request schemas
"""
from pydantic import BaseModel, Field
from typing import Optional
from enum import Enum


class YouTubeRequestStatus(str, Enum):
    """YouTube request status enum"""
    PENDING = "pending"
    DONE = "done"


class YouTubeRequestCreate(BaseModel):
    """Create YouTube request"""
    subscription_id: str = Field(..., description="Subscription ID")
    youtube_email: str = Field(..., max_length=200, description="Gmail address")
    
    class Config:
        json_schema_extra = {
            "example": {
                "subscription_id": "507f1f77bcf86cd799439011",
                "youtube_email": "user@gmail.com"
            }
        }


class YouTubeRequestOut(BaseModel):
    """YouTube request output schema"""
    id: str
    user_id: str
    username: str
    registered_email: str
    subscription_id: str
    youtube_email: str
    request_date: str
    status: str
    admin_notes: Optional[str] = None
    created_at: str
    updated_at: str


class YouTubeRequestUpdate(BaseModel):
    """Update YouTube request status"""
    notes: Optional[str] = Field(None, max_length=500, description="Admin notes")
