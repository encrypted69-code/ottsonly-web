"""
Test MongoDB connection and create a test user
"""
import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
from core.security import get_password_hash
from datetime import datetime
from core.config import settings

async def test_mongodb():
    """Test MongoDB connection and create test user"""
    try:
        # Connect to MongoDB
        print("Connecting to MongoDB...")
        client = AsyncIOMotorClient(settings.MONGODB_URL)
        db = client[settings.DATABASE_NAME]
        
        # Test connection
        await client.admin.command('ping')
        print("✅ MongoDB connection successful!")
        
        # Check if test user exists
        existing_user = await db.users.find_one({"email": "test@ottsonly.com"})
        
        if existing_user:
            print(f"✅ Test user already exists: {existing_user['email']}")
            print(f"   Wallet Balance: ₹{existing_user.get('wallet_balance', 0)}")
        else:
            # Create test user
            print("Creating test user...")
            test_user = {
                "name": "Test User",
                "email": "test@ottsonly.com",
                "phone": "9876543210",
                "password": get_password_hash("password123"),
                "role": "user",
                "wallet_balance": 1000.0,
                "is_active": True,
                "email_verified": True,
                "phone_verified": True,
                "created_at": datetime.utcnow().isoformat(),
                "updated_at": datetime.utcnow().isoformat()
            }
            
            result = await db.users.insert_one(test_user)
            print(f"✅ Test user created with ID: {result.inserted_id}")
            print(f"   Email: test@ottsonly.com")
            print(f"   Password: password123")
            print(f"   Wallet Balance: ₹1000")
        
        # List all users
        print("\n📋 All users in database:")
        cursor = db.users.find({})
        users = await cursor.to_list(length=100)
        for user in users:
            print(f"  - {user.get('name', 'N/A')} ({user.get('email', user.get('phone', 'N/A'))}) - Role: {user.get('role')} - Balance: ₹{user.get('wallet_balance', 0)}")
        
        client.close()
        print("\n✅ Database test completed!")
        
    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    asyncio.run(test_mongodb())
