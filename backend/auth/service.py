"""
Authentication service with business logic
"""
from datetime import datetime
from motor.motor_asyncio import AsyncIOMotorDatabase
from bson import ObjectId
from core.config import settings
from core.security import create_access_token, get_password_hash, verify_password
from fastapi import HTTPException, status
import secrets


class AuthService:
    """Authentication service"""
    
    def __init__(self, db: AsyncIOMotorDatabase):
        self.db = db
    
    async def register_user(self, name: str, email: str, phone: str, password: str, referral_code: str = None) -> dict:
        """
        Register a new user with email and password
        """
        # Check if user with email or phone already exists
        existing_user = await self.db.users.find_one({
            "$or": [
                {"email": email},
                {"phone": phone}
            ]
        })
        
        if existing_user:
            if existing_user.get("email") == email:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Email already registered"
                )
            else:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Phone number already registered"
                )
        
        # Hash password
        hashed_password = get_password_hash(password)
        
        # Validate referral code if provided
        referrer_id = None
        if referral_code and referral_code.strip():
            referrer = await self.db.users.find_one({"referral_code": referral_code.strip().upper()})
            if not referrer:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"Referral code '{referral_code.strip().upper()}' does not exist. Please check the code or leave empty to register without referral."
                )
            referrer_id = str(referrer["_id"])
        
        # Create new user
        new_user = {
            "name": name,
            "email": email,
            "phone": phone,
            "password": hashed_password,
            "role": "user",
            "wallet_balance": 0.0,
            "is_active": True,
            "email_verified": False,
            "phone_verified": False,
            "created_at": datetime.utcnow().isoformat(),
            "updated_at": datetime.utcnow().isoformat()
        }
        
        # Add referrer info if referral code was valid
        if referrer_id:
            new_user["referred_by"] = referrer_id
            new_user["referral_applied_at"] = datetime.utcnow().isoformat()
        
        result = await self.db.users.insert_one(new_user)
        user_id = str(result.inserted_id)
        
        # Generate referral code for the new user
        from app.referrals.service import ReferralService
        referral_service = ReferralService(self.db)
        try:
            await referral_service.create_referral_code(user_id)
        except Exception as e:
            # Log error but don't fail registration
            print(f"Failed to create referral code for user {user_id}: {e}")
        
        # Generate tokens
        access_token = create_access_token(data={"sub": user_id})
        refresh_token = secrets.token_urlsafe(32)
        
        # Store refresh token in database
        await self.db.users.update_one(
            {"_id": ObjectId(user_id)},
            {"$set": {"refresh_token": refresh_token}}
        )
        
        return {
            "access_token": access_token,
            "refresh_token": refresh_token,
            "token_type": "bearer",
            "user": {
                "id": user_id,
                "name": name,
                "email": email,
                "phone": phone,
                "role": "user",
                "wallet_balance": 0.0
            }
        }

    async def admin_login(self, email: str, password: str) -> dict:
        """
        Admin login with email and password
        """
        # Find user by email
        user = await self.db.users.find_one({"email": email})
        
        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid email or password"
            )
        
        # Verify password
        if not verify_password(password, user.get("password", "")):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid email or password"
            )
        
        # Check if user is admin
        if user.get("role") != "admin":
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Access denied. Admin privileges required."
            )
        
        # Check if account is active
        if not user.get("is_active", True):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Account is deactivated"
            )
        
        # Generate tokens
        user_id = str(user["_id"])
        access_token = create_access_token(data={"sub": user_id})
        refresh_token = secrets.token_urlsafe(32)
        
        # Store refresh token in database
        await self.db.users.update_one(
            {"_id": ObjectId(user_id)},
            {"$set": {"refresh_token": refresh_token, "last_login": datetime.utcnow().isoformat()}}
        )
        
        return {
            "access_token": access_token,
            "refresh_token": refresh_token,
            "token_type": "bearer",
            "user": {
                "id": user_id,
                "name": user.get("name"),
                "email": user.get("email"),
                "role": user.get("role"),
                "wallet_balance": user.get("wallet_balance", 0.0)
            }
        }

    async def user_login(self, email: str, password: str) -> dict:
        """
        User login with email and password
        """
        # Find user by email
        user = await self.db.users.find_one({"email": email})
        
        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid email or password"
            )
        
        # Verify password
        if not verify_password(password, user.get("password", "")):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid email or password"
            )
        
        # Check if account is active
        if not user.get("is_active", True):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Account is deactivated"
            )
        
        # Generate tokens
        user_id = str(user["_id"])
        access_token = create_access_token(data={"sub": user_id})
        refresh_token = secrets.token_urlsafe(32)
        
        # Store refresh token in database
        await self.db.users.update_one(
            {"_id": ObjectId(user_id)},
            {"$set": {"refresh_token": refresh_token, "last_login": datetime.utcnow().isoformat()}}
        )
        
        return {
            "access_token": access_token,
            "refresh_token": refresh_token,
            "token_type": "bearer",
            "user": {
                "id": user_id,
                "name": user.get("name"),
                "email": user.get("email"),
                "phone": user.get("phone"),
                "role": user.get("role"),
                "wallet_balance": user.get("wallet_balance", 0.0)
            }
        }
    
    async def initiate_login(self, phone: str) -> dict:
        """
        Initiate login by sending OTP
        In production, integrate with SMS gateway
        For development, returns mock OTP
        """
        # Check if user exists, create if not
        user = await self.db.users.find_one({"phone": phone})
        
        if not user:
            # Auto-create user on first login
            new_user = {
                "phone": phone,
                "role": "user",
                "wallet_balance": 0.0,
                "created_at": datetime.utcnow().isoformat(),
                "updated_at": datetime.utcnow().isoformat()
            }
            result = await self.db.users.insert_one(new_user)
            user_id = str(result.inserted_id)
        else:
            user_id = str(user["_id"])
        
        # In production: Send OTP via SMS gateway
        # For now, return mock OTP for development
        return {
            "message": "OTP sent successfully",
            "phone": phone,
            "otp": settings.MOCK_OTP if settings.DEBUG else "******"
        }
    
    async def verify_otp(self, phone: str, otp: str) -> dict:
        """
        Verify OTP and return JWT token
        """
        # Verify OTP (mock verification for development)
        if otp != settings.MOCK_OTP:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid OTP"
            )
        
        # Fetch user
        user = await self.db.users.find_one({"phone": phone})
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )
        
        # Generate JWT token
        user_id = str(user["_id"])
        access_token = create_access_token(data={"sub": user_id})
        
        # Prepare user response
        user["_id"] = user_id
        
        return {
            "access_token": access_token,
            "token_type": "bearer",
            "user": {
                "_id": user_id,
                "phone": user["phone"],
                "role": user["role"],
                "wallet_balance": user["wallet_balance"]
            }
        }
