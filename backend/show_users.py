"""
Show user credentials
"""
import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
from core.config import settings


async def show_users():
    """Display all users with their credentials"""
    client = AsyncIOMotorClient(settings.MONGODB_URL)
    db = client[settings.MONGODB_DB_NAME]
    
    print("\n" + "="*60)
    print("👥 USER ACCOUNTS")
    print("="*60 + "\n")
    
    users = await db.users.find().to_list(length=100)
    
    if not users:
        print("❌ No users found in database\n")
        print("Run 'python seed_data.py' to create demo users")
    else:
        for user in users:
            print(f"📧 Email: {user.get('email', 'N/A')}")
            print(f"👤 Name: {user.get('name', 'N/A')}")
            print(f"🔑 Role: {user.get('role', 'user')}")
            print(f"💰 Wallet Balance: ₹{user.get('wallet_balance', 0)}")
            print(f"📱 Phone: {user.get('phone', 'N/A')}")
            print(f"✅ Status: {'Active' if not user.get('is_blocked', False) else 'Blocked'}")
            print("-" * 60)
    
    print(f"\nTotal Users: {len(users)}\n")
    
    client.close()


if __name__ == "__main__":
    asyncio.run(show_users())
