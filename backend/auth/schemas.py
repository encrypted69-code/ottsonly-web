"""
Authentication schemas using Pydantic
"""
from pydantic import BaseModel, Field, EmailStr
from typing import Optional


class RegisterRequest(BaseModel):
    """User registration request"""
    name: str = Field(..., min_length=2, max_length=100)
    email: EmailStr
    phone: str = Field(..., min_length=10, max_length=15, description="Phone number")
    password: str = Field(..., min_length=6, max_length=72, description="Password (max 72 characters for bcrypt)")
    referral_code: Optional[str] = Field(None, max_length=15, description="Optional referral code")
    
    class Config:
        json_schema_extra = {
            "example": {
                "name": "John Doe",
                "email": "john@example.com",
                "phone": "+919876543210",
                "password": "SecurePassword123",
                "referral_code": "ABC123"
            }
        }


class LoginRequest(BaseModel):
    """Phone number login request"""
    phone: str = Field(..., min_length=10, max_length=15, description="Phone number")
    
    class Config:
        json_schema_extra = {
            "example": {
                "phone": "+919876543210"
            }
        }


class AdminLoginRequest(BaseModel):
    """Admin email/password login request"""
    email: EmailStr
    password: str = Field(..., min_length=6, max_length=72)
    
    class Config:
        json_schema_extra = {
            "example": {
                "email": "admin@ottsonly.in",
                "password": "Admin@12345"
            }
        }


class UserLoginRequest(BaseModel):
    """User email/password login request"""
    email: EmailStr
    password: str = Field(..., min_length=6, max_length=72)
    
    class Config:
        json_schema_extra = {
            "example": {
                "email": "user@example.com",
                "password": "password123"
            }
        }


class VerifyOTPRequest(BaseModel):
    """OTP verification request"""
    phone: str = Field(..., min_length=10, max_length=15)
    otp: str = Field(..., min_length=6, max_length=6)
    
    class Config:
        json_schema_extra = {
            "example": {
                "phone": "+919876543210",
                "otp": "123456"
            }
        }


class TokenResponse(BaseModel):
    """JWT token response"""
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    user: dict


class UserResponse(BaseModel):
    """User profile response"""
    id: str = Field(..., alias="_id")
    phone: str
    role: str
    wallet_balance: float
    created_at: str
    
    class Config:
        populate_by_name = True
