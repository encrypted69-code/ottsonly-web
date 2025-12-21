"""
Notification schemas
"""
from pydantic import BaseModel, Field
from typing import Optional


class NotificationCreate(BaseModel):
    """Create notification"""
    title: str = Field(..., max_length=200)
    message: str = Field(..., max_length=1000)
    type: Optional[str] = Field("info", max_length=50)
    
    class Config:
        json_schema_extra = {
            "example": {
                "title": "Welcome to OTTSONLY",
                "message": "Thank you for joining us!",
                "type": "info"
            }
        }


class BulkNotificationRequest(BaseModel):
    """Send bulk notification to all users"""
    title: str = Field(..., max_length=200)
    message: str = Field(..., max_length=500)
    type: Optional[str] = Field("info", max_length=50)
    target_audience: Optional[str] = Field("all", max_length=50)
    action_url: Optional[str] = Field(None, max_length=500)
    priority: Optional[str] = Field("normal", max_length=50)


class NotificationOut(BaseModel):
    """Notification output"""
    id: str
    user_id: str
    title: str
    message: str
    type: str
    is_read: bool
    created_at: str
