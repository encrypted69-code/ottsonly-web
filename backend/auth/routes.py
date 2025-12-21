"""
Authentication API routes
"""
from fastapi import APIRouter, Depends, HTTPException
from core.database import get_database
from core.security import get_current_user
from auth.schemas import RegisterRequest, LoginRequest, AdminLoginRequest, UserLoginRequest, VerifyOTPRequest, TokenResponse, UserResponse
from auth.service import AuthService


router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post("/register", response_model=TokenResponse, summary="Register new user")
async def register(request: RegisterRequest, db=Depends(get_database)):
    """
    Register a new user with name, email, phone, and password
    
    - **name**: Full name
    - **email**: Email address (must be unique)
    - **phone**: Phone number (must be unique)
    - **password**: Password (minimum 6 characters)
    - **referral_code**: Optional referral code
    - Returns JWT token and user profile
    """
    service = AuthService(db)
    result = await service.register_user(
        name=request.name,
        email=request.email,
        phone=request.phone,
        password=request.password,
        referral_code=request.referral_code
    )
    return result


@router.post("/admin/login", response_model=TokenResponse, summary="Admin login with email/password")
async def admin_login(request: AdminLoginRequest, db=Depends(get_database)):
    """
    Admin login with email and password
    
    - **email**: Admin email address
    - **password**: Admin password
    - Returns JWT token and admin profile
    """
    service = AuthService(db)
    result = await service.admin_login(request.email, request.password)
    return result


@router.post("/user/login", response_model=TokenResponse, summary="User login with email/password")
async def user_login(request: UserLoginRequest, db=Depends(get_database)):
    """
    User login with email and password
    
    - **email**: User email address
    - **password**: User password
    - Returns JWT token and user profile
    """
    service = AuthService(db)
    result = await service.user_login(request.email, request.password)
    return result


@router.post("/login", summary="Initiate login with phone number")
async def login(request: LoginRequest, db=Depends(get_database)):
    """
    Send OTP to phone number for authentication
    
    - **phone**: Phone number with country code
    - Returns OTP in development mode (mock OTP: 123456)
    """
    service = AuthService(db)
    result = await service.initiate_login(request.phone)
    return result


@router.post("/verify", response_model=TokenResponse, summary="Verify OTP and get token")
async def verify_otp(request: VerifyOTPRequest, db=Depends(get_database)):
    """
    Verify OTP and receive JWT access token
    
    - **phone**: Phone number
    - **otp**: 6-digit OTP (use 123456 for development)
    - Returns JWT token and user profile
    """
    service = AuthService(db)
    result = await service.verify_otp(request.phone, request.otp)
    return result


@router.get("/me", summary="Get current user profile")
async def get_me(current_user: dict = Depends(get_current_user)):
    """
    Get authenticated user's profile
    
    Requires: Bearer token in Authorization header
    """
    return {
        "id": current_user["_id"],
        "phone": current_user["phone"],
        "role": current_user["role"],
        "wallet_balance": current_user.get("wallet_balance", 0.0),
        "created_at": current_user.get("created_at")
    }
