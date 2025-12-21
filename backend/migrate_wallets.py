import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
from core.config import Settings

async def migrate_wallets():
    """
    Migrate from dual wallet system to unified wallet system.
    - Merges referral_wallet_balance into main wallet_balance
    - Creates withdrawable_balance field from referral earnings
    """
    settings = Settings()
    client = AsyncIOMotorClient(settings.MONGODB_URL)
    db = client[settings.DATABASE_NAME]
    
    print("=" * 80)
    print("WALLET MIGRATION: Dual to Unified System")
    print("=" * 80)
    
    users = await db.users.find({}).to_list(length=1000)
    
    updated_count = 0
    for user in users:
        user_id = user['_id']
        main_wallet = user.get('wallet_balance', 0.0)
        referral_wallet = user.get('referral_wallet_balance', 0.0)
        
        # New unified wallet = main + referral earnings
        new_wallet_balance = main_wallet + referral_wallet
        # Withdrawable = only referral earnings
        withdrawable_balance = referral_wallet
        
        if referral_wallet > 0 or 'withdrawable_balance' not in user:
            result = await db.users.update_one(
                {"_id": user_id},
                {
                    "$set": {
                        "wallet_balance": new_wallet_balance,
                        "withdrawable_balance": withdrawable_balance
                    },
                    "$unset": {
                        "referral_wallet_balance": ""
                    }
                }
            )
            
            if result.modified_count > 0:
                updated_count += 1
                print(f"✓ Updated {user.get('name')} ({user.get('email')})")
                print(f"  Main: ₹{main_wallet} + Referral: ₹{referral_wallet}")
                print(f"  → Unified: ₹{new_wallet_balance} (Withdrawable: ₹{withdrawable_balance})")
                print("-" * 80)
    
    print(f"\n✅ Migration complete! Updated {updated_count} users")
    print("\nNew system:")
    print("- wallet_balance: Combined balance (can buy OTT plans)")
    print("- withdrawable_balance: Commission earnings (can be withdrawn)")
    
    client.close()

if __name__ == "__main__":
    asyncio.run(migrate_wallets())
