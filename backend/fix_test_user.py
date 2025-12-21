import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
from core.config import Settings

async def fix_test_user():
    settings = Settings()
    client = AsyncIOMotorClient(settings.MONGODB_URL)
    db = client[settings.DATABASE_NAME]
    
    # Find Test User with code REFD32NNB5C
    user = await db.users.find_one({"referral_code": "REFD32NNB5C"})
    
    if user:
        print(f"Found: {user.get('name')} ({user.get('email')})")
        print(f"Current wallet: ₹{user.get('wallet_balance', 0.0)}")
        print(f"Current withdrawable: ₹{user.get('withdrawable_balance', 0.0)}")
        
        # Set withdrawable to ₹100 (the commission they earned)
        result = await db.users.update_one(
            {"_id": user["_id"]},
            {
                "$set": {
                    "withdrawable_balance": 100.0,
                    "wallet_balance": user.get("wallet_balance", 0.0) + 100.0
                }
            }
        )
        
        print(f"\n✅ Updated! New wallet: ₹{user.get('wallet_balance', 0.0) + 100.0}, Withdrawable: ₹100.0")
    else:
        print("User not found")
    
    client.close()

if __name__ == "__main__":
    asyncio.run(fix_test_user())
