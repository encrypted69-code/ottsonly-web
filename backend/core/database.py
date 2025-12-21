"""
MongoDB database configuration and connection management
"""
from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase
from .config import settings
from typing import Optional


class Database:
    """MongoDB database manager"""
    
    client: Optional[AsyncIOMotorClient] = None
    db: Optional[AsyncIOMotorDatabase] = None


db = Database()


async def connect_to_mongo():
    """Connect to MongoDB on startup"""
    print("Connecting to MongoDB...")
    db.client = AsyncIOMotorClient(settings.MONGODB_URL)
    db.db = db.client[settings.DATABASE_NAME]
    print("Successfully connected to MongoDB")


async def close_mongo_connection():
    """Close MongoDB connection on shutdown"""
    print("Closing MongoDB connection...")
    if db.client:
        db.client.close()
    print("MongoDB connection closed")


def get_database() -> AsyncIOMotorDatabase:
    """Get database instance for dependency injection"""
    return db.db
