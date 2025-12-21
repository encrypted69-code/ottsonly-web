import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
from core.config import Settings

async def check_users():
    settings = Settings()
    client = AsyncIOMotorClient(settings.MONGODB_URL)
    db = client[settings.DATABASE_NAME]
    
    users = await db.users.find({}, {'name': 1, 'email': 1, 'referral_code': 1}).to_list(length=20)
    
    print("=" * 60)
    print("USERS IN DATABASE:")
    print("=" * 60)
    
    for user in users:
        code = user.get('referral_code', 'NO CODE')
        print(f"Name: {user.get('name', 'N/A')}")
        print(f"Email: {user.get('email', 'N/A')}")
        print(f"Referral Code: {code}")
        print("-" * 60)
    
    print(f"\nTotal users: {len(users)}")
    print(f"Users with codes: {sum(1 for u in users if u.get('referral_code'))}")
    
    client.close()

if __name__ == "__main__":
    asyncio.run(check_users())
