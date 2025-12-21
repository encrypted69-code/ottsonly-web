"""
Core configuration module using Pydantic Settings
"""
from pydantic_settings import BaseSettings
from typing import Optional


class Settings(BaseSettings):
    """Application settings loaded from environment variables"""
    
    # Application
    APP_NAME: str = "OTTSONLY"
    DEBUG: bool = True
    ENVIRONMENT: str = "development"
    BACKEND_PORT: int = 8000
    FRONTEND_URL: str = "http://localhost:4028"
    ADMIN_URL: str = "http://localhost:3001"
    
    # MongoDB
    MONGODB_URL: str
    DATABASE_NAME: str
    
    # JWT
    SECRET_KEY: str
    REFRESH_SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 10080  # 7 days
    REFRESH_TOKEN_EXPIRE_DAYS: int = 30
    
    # Security
    BCRYPT_ROUNDS: int = 12
    RATE_LIMIT_PER_MINUTE: int = 60
    
    # Admin
    SUPER_ADMIN_EMAIL: str
    SUPER_ADMIN_PASSWORD: str
    
    # Razorpay
    RAZORPAY_KEY_ID: str
    RAZORPAY_KEY_SECRET: str
    
    # Telegram Bot
    TELEGRAM_BOT_TOKEN: str
    TELEGRAM_ADMIN_CHAT_ID: str
    
    # OTP
    MOCK_OTP: str = "123456"
    
    # File Uploads
    UPLOAD_DIR: str = "uploads"
    MAX_FILE_SIZE: int = 5242880  # 5MB
    
    # Business Logic
    YOUTUBE_MAX_EDITS: int = 1
    DEFAULT_WALLET_BALANCE: float = 0.0
    
    class Config:
        env_file = ".env"
        case_sensitive = True


# Global settings instance
settings = Settings()
