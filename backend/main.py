"""
OTTSONLY - OTT Subscription Platform Backend
FastAPI application with MongoDB, JWT Auth, Razorpay, and Telegram integration
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

# Core imports
from core.database import connect_to_mongo, close_mongo_connection
from core.config import settings

# Router imports
from auth.routes import router as auth_router
from users.routes import router as users_router
from products.routes import router as products_router
from orders.routes import router as orders_router
from subscriptions.routes import router as subscriptions_router
from wallet.routes import router as wallet_router
from notifications.routes import router as notifications_router
from admin.routes import router as admin_router
from app.youtube.routes import router as youtube_router
from app.admin.youtube import router as admin_youtube_router
from app.credentials.routes import router as credentials_router
from app.referrals.routes import router as referrals_router
from app.admin.referrals import router as admin_referrals_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Lifespan context manager for startup and shutdown events
    """
    # Startup
    print("🚀 Starting OTTSONLY backend...")
    await connect_to_mongo()
    print("✅ All systems ready!")
    
    yield
    
    # Shutdown
    print("🛑 Shutting down OTTSONLY backend...")
    await close_mongo_connection()
    print("👋 Goodbye!")


# Initialize FastAPI app
app = FastAPI(
    title="OTTSONLY API",
    description="Production-ready backend for OTT subscription platform",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan
)

# CORS middleware - Must be added before routes
# Security: Only allow requests from trusted frontend domains
allowed_origins = [
    settings.FRONTEND_URL,      # Main user-facing frontend
    settings.ADMIN_URL,         # Admin panel
    "http://127.0.0.1:4028",    # Local development - main (alternative)
    "http://127.0.0.1:3001",    # Local development - admin (alternative)
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allow_headers=["*"],
    expose_headers=["*"],
    max_age=3600,
)


# Include routers
app.include_router(auth_router)
app.include_router(users_router)
app.include_router(products_router)
app.include_router(orders_router)
app.include_router(subscriptions_router)
app.include_router(wallet_router)
app.include_router(notifications_router)
app.include_router(admin_router)
app.include_router(youtube_router)
app.include_router(admin_youtube_router)
app.include_router(credentials_router)
app.include_router(referrals_router)
app.include_router(admin_referrals_router)


@app.get("/", tags=["Health"])
async def root():
    """
    Root endpoint - Health check
    """
    return {
        "app": settings.APP_NAME,
        "version": "1.0.0",
        "status": "running",
        "docs": "/docs"
    }


@app.get("/health", tags=["Health"])
async def health_check():
    """
    Health check endpoint
    """
    return {
        "status": "healthy",
        "app": settings.APP_NAME
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=settings.DEBUG
    )
