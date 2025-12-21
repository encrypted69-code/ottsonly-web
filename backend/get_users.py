"""
Get user credentials for testing
"""
import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
from core.security import get_password_hash
from datetime import datetime
from core.config import settings

async def get_test_users():
    """Get or create test users"""
    try:
        client = AsyncIOMotorClient(settings.MONGODB_URL)
        db = client[settings.DATABASE_NAME]
        
        print("🔍 Checking for users with passwords...\n")
        
        # Check for test user 1
        user1 = await db.users.find_one({"email": "test@ottsonly.com"})
        if not user1:
            print("Creating test user 1...")
            user1_data = {
                "name": "Test User 1",
                "email": "test@ottsonly.com",
                "phone": "9876543210",
                "password": get_password_hash("password123"),
                "role": "user",
                "wallet_balance": 1000.0,
                "is_active": True,
                "created_at": datetime.utcnow().isoformat(),
                "updated_at": datetime.utcnow().isoformat()
            }
            await db.users.insert_one(user1_data)
            user1 = await db.users.find_one({"email": "test@ottsonly.com"})
        
        # Check for test user 2
        user2 = await db.users.find_one({"email": "user2@ottsonly.com"})
        if not user2:
            print("Creating test user 2...")
            user2_data = {
                "name": "Test User 2",
                "email": "user2@ottsonly.com",
                "phone": "9876543211",
                "password": get_password_hash("test123"),
                "role": "user",
                "wallet_balance": 5000.0,
                "is_active": True,
                "created_at": datetime.utcnow().isoformat(),
                "updated_at": datetime.utcnow().isoformat()
            }
            await db.users.insert_one(user2_data)
            user2 = await db.users.find_one({"email": "user2@ottsonly.com"})
        
        print("=" * 60)
        print("✅ TEST USER CREDENTIALS")
        print("=" * 60)
        print("\n👤 USER 1:")
        print(f"   Email:    test@ottsonly.com")
        print(f"   Password: password123")
        print(f"   Balance:  ₹{user1.get('wallet_balance', 0)}")
        print(f"   Name:     {user1.get('name')}")
        
        print("\n👤 USER 2:")
        print(f"   Email:    user2@ottsonly.com")
        print(f"   Password: test123")
        print(f"   Balance:  ₹{user2.get('wallet_balance', 0)}")
        print(f"   Name:     {user2.get('name')}")
        
        print("\n" + "=" * 60)
        print("🔗 Login URL: http://localhost:4028/login")
        print("=" * 60 + "\n")
        
        client.close()
        
    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    asyncio.run(get_test_users())
