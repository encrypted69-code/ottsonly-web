import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
from core.config import Settings
from bson import ObjectId

async def find_referrer():
    settings = Settings()
    client = AsyncIOMotorClient(settings.MONGODB_URL)
    db = client[settings.DATABASE_NAME]
    
    # Find the referrer
    referrer_id = "6946702001144a04285d02c4"
    user = await db.users.find_one({"_id": ObjectId(referrer_id)})
    
    if user:
        print(f"Referrer: {user.get('name')} ({user.get('email')})")
        print(f"Code: {user.get('referral_code')}")
        print(f"Wallet Balance: ₹{user.get('wallet_balance', 0.0)}")
        print(f"Withdrawable Balance: ₹{user.get('withdrawable_balance', 0.0)}")
        print(f"Old Referral Wallet: ₹{user.get('referral_wallet_balance', 'N/A')}")
    else:
        print("Referrer not found")
    
    client.close()

if __name__ == "__main__":
    asyncio.run(find_referrer())
