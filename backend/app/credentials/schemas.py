"""
Credentials schemas
"""
from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime


class CredentialCreate(BaseModel):
    platform: str = Field(..., description="Platform name (Netflix, Prime, Pornhub, etc.)")
    username: str = Field(..., description="Username or email")
    password: str = Field(..., description="Password")
    notes: Optional[str] = Field(None, description="Additional notes")


class CredentialUpdate(BaseModel):
    platform: Optional[str] = None
    username: Optional[str] = None
    password: Optional[str] = None
    notes: Optional[str] = None
    is_active: Optional[bool] = None


class CredentialOut(BaseModel):
    id: str
    platform: str
    username: str
    password: str
    notes: Optional[str] = None
    is_active: bool
    created_at: str
    updated_at: str
