import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
from core.config import Settings

async def check_wallets():
    settings = Settings()
    client = AsyncIOMotorClient(settings.MONGODB_URL)
    db = client[settings.DATABASE_NAME]
    
    users = await db.users.find({}).to_list(length=100)
    
    print("=" * 80)
    print("USERS WALLET BALANCES:")
    print("=" * 80)
    
    for user in users:
        main_balance = user.get('wallet_balance', 0.0)
        withdrawable = user.get('withdrawable_balance', 0.0)
        referred_by = user.get('referred_by', None)
        
        if main_balance > 0 or withdrawable > 0 or referred_by:
            print(f"Name: {user.get('name', 'N/A')}")
            print(f"Email: {user.get('email', 'N/A')}")
            print(f"Code: {user.get('referral_code', 'NO CODE')}")
            print(f"Main Wallet: ₹{main_balance}")
            print(f"Withdrawable: ₹{withdrawable}")
            print(f"Referred By: {referred_by or 'None'}")
            print("-" * 80)
    
    # Check commissions
    print("\n" + "=" * 80)
    print("REFERRAL COMMISSIONS:")
    print("=" * 80)
    
    commissions = await db.referral_commissions.find({}).to_list(length=100)
    for comm in commissions:
        print(f"Referrer ID: {comm.get('referrer_id')}")
        print(f"Referred User: {comm.get('referred_user_name')} ({comm.get('referred_user_email')})")
        print(f"Commission: ₹{comm.get('commission_amount')}")
        print(f"Topup: ₹{comm.get('topup_amount')}")
        print(f"Date: {comm.get('created_at')}")
        print("-" * 80)
    
    print(f"\nTotal commissions: {len(commissions)}")
    
    client.close()

if __name__ == "__main__":
    asyncio.run(check_wallets())
