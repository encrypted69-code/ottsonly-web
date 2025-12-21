"""
Clear all credentials from database
"""
import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
from core.config import settings


async def clear_credentials():
    """Delete all credentials from database"""
    client = AsyncIOMotorClient(settings.MONGODB_URL)
    db = client[settings.MONGODB_DB_NAME]
    
    print("🗑️  Clearing all credentials...")
    
    result = await db.credentials.delete_many({})
    
    print(f"✅ Deleted {result.deleted_count} credentials")
    
    client.close()


if __name__ == "__main__":
    asyncio.run(clear_credentials())
