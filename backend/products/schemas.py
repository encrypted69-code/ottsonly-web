"""
Product (OTT Plans) schemas
"""
from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime


class ProductCreate(BaseModel):
    """Create new OTT plan"""
    platform_name: str = Field(..., max_length=100, description="e.g., Netflix, Prime Video")
    plan_name: str = Field(..., max_length=100, description="e.g., Premium, Basic")
    price: float = Field(..., gt=0)
    duration_days: int = Field(..., gt=0, description="Plan duration in days")
    stock: int = Field(..., ge=0)
    is_active: bool = True
    description: Optional[str] = Field(None, max_length=500)
    
    class Config:
        json_schema_extra = {
            "example": {
                "platform_name": "Netflix",
                "plan_name": "Premium 4K",
                "price": 649.0,
                "duration_days": 30,
                "stock": 50,
                "is_active": True,
                "description": "Ultra HD streaming on 4 devices"
            }
        }


class ProductUpdate(BaseModel):
    """Update OTT plan"""
    platform_name: Optional[str] = Field(None, max_length=100)
    plan_name: Optional[str] = Field(None, max_length=100)
    price: Optional[float] = Field(None, gt=0)
    duration_days: Optional[int] = Field(None, gt=0)
    stock: Optional[int] = Field(None, ge=0)
    is_active: Optional[bool] = None
    description: Optional[str] = Field(None, max_length=500)


class ProductOut(BaseModel):
    """Product output schema"""
    id: str
    platform_name: str
    plan_name: str
    price: float
    duration_days: int
    stock: int
    is_active: bool
    description: Optional[str]
    created_at: str
