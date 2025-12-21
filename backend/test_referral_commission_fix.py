"""
Test referral commission balance tracking fix
Verifies:  - No NameError with undefined variables
- Correct balance_before and balance_after in commission record
- Proper credit to withdrawable_balance
"""
import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
from bson import ObjectId
from datetime import datetime
from core.config import Settings
from app.referrals.service import ReferralService


async def test_commission_tracking():
    print("=" * 80)
    print("🧪 TESTING REFERRAL COMMISSION BALANCE TRACKING")
    print("=" * 80)
    
    settings = Settings()
    client = AsyncIOMotorClient(settings.MONGODB_URL)
    db = client[settings.DATABASE_NAME]
    service = ReferralService(db)
    
    try:
        # Create test users
        print("\n📝 Creating test users...")
        
        # Referrer
        referrer_data = {
            "name": "Test Referrer",
            "email": f"referrer_test_{int(datetime.utcnow().timestamp())}@test.com",
            "phone": f"9999{int(datetime.utcnow().timestamp()) % 1000000:06d}",
            "password_hash": "dummy",
            "wallet_balance": 100.0,
            "withdrawable_balance": 50.0,  # Already has ₹50 from previous commissions
            "referral_code": f"TEST{int(datetime.utcnow().timestamp())}",
            "created_at": datetime.utcnow().isoformat()
        }
        referrer_result = await db.users.insert_one(referrer_data)
        referrer_id = str(referrer_result.inserted_id)
        print(f"✅ Created referrer: {referrer_id}")
        print(f"   Initial wallet: ₹{referrer_data['wallet_balance']}")
        print(f"   Initial withdrawable: ₹{referrer_data['withdrawable_balance']}")
        
        # Referred user
        referred_data = {
            "name": "Test Referred User",
            "email": f"referred_test_{int(datetime.utcnow().timestamp())}@test.com",
            "phone": f"8888{int(datetime.utcnow().timestamp()) % 1000000:06d}",
            "password_hash": "dummy",
            "wallet_balance": 0.0,
            "withdrawable_balance": 0.0,
            "referred_by": referrer_id,  # Linked to referrer
            "referral_applied_at": datetime.utcnow().isoformat(),
            "created_at": datetime.utcnow().isoformat()
        }
        referred_result = await db.users.insert_one(referred_data)
        referred_user_id = str(referred_result.inserted_id)
        print(f"✅ Created referred user: {referred_user_id}")
        
        # Simulate referred user adding ₹1000 to wallet
        topup_amount = 1000.0
        expected_commission = topup_amount * 0.10  # 10% = ₹100
        
        print(f"\n💰 Simulating wallet topup...")
        print(f"   Topup amount: ₹{topup_amount}")
        print(f"   Expected commission: ₹{expected_commission}")
        
        # Credit commission (this should NOT crash with NameError)
        try:
            result = await service.credit_referral_commission(
                referred_user_id=referred_user_id,
                topup_amount=topup_amount,
                transaction_id="test_txn_123"
            )
            
            print(f"\n✅ Commission credited successfully!")
            print(f"   Commission amount: ₹{result['commission_amount']}")
            
        except NameError as e:
            print(f"\n❌ FAILED: NameError detected!")
            print(f"   Error: {e}")
            print(f"   This means undefined variables are still being used.")
            return False
        except Exception as e:
            print(f"\n❌ FAILED: Unexpected error!")
            print(f"   Error: {e}")
            return False
        
        # Verify updated balances
        print(f"\n🔍 Verifying referrer balances...")
        referrer_updated = await db.users.find_one({"_id": ObjectId(referrer_id)})
        
        expected_wallet = 100.0 + expected_commission  # ₹200
        expected_withdrawable = 50.0 + expected_commission  # ₹150
        
        actual_wallet = referrer_updated["wallet_balance"]
        actual_withdrawable = referrer_updated["withdrawable_balance"]
        
        print(f"   Wallet balance: ₹{actual_wallet} (expected: ₹{expected_wallet})")
        print(f"   Withdrawable balance: ₹{actual_withdrawable} (expected: ₹{expected_withdrawable})")
        
        if actual_wallet == expected_wallet and actual_withdrawable == expected_withdrawable:
            print(f"   ✅ Balances correct!")
        else:
            print(f"   ❌ Balance mismatch!")
            return False
        
        # Verify commission record
        print(f"\n🔍 Verifying commission record...")
        commission = await db.referral_commissions.find_one({"transaction_id": "test_txn_123"})
        
        if not commission:
            print(f"   ❌ Commission record not found!")
            return False
        
        print(f"   Referrer ID: {commission['referrer_id']}")
        print(f"   Commission amount: ₹{commission['commission_amount']}")
        print(f"   Balance before: ₹{commission['balance_before']} (expected: ₹50)")
        print(f"   Balance after: ₹{commission['balance_after']} (expected: ₹150)")
        
        if (commission['balance_before'] == 50.0 and 
            commission['balance_after'] == 150.0 and
            commission['commission_amount'] == expected_commission):
            print(f"   ✅ Commission record accurate!")
        else:
            print(f"   ❌ Commission record has incorrect values!")
            return False
        
        # Cleanup
        print(f"\n🧹 Cleaning up test data...")
        await db.users.delete_one({"_id": ObjectId(referrer_id)})
        await db.users.delete_one({"_id": ObjectId(referred_user_id)})
        await db.referral_commissions.delete_one({"transaction_id": "test_txn_123"})
        print(f"   ✅ Cleanup complete")
        
        print(f"\n" + "=" * 80)
        print(f"🎯 ALL TESTS PASSED!")
        print(f"=" * 80)
        print(f"✅ No NameError - all variables properly defined")
        print(f"✅ balance_before and balance_after correctly calculated")
        print(f"✅ Commission credited to withdrawable_balance")
        print(f"=" * 80)
        
        return True
        
    except Exception as e:
        print(f"\n❌ TEST FAILED: {e}")
        import traceback
        traceback.print_exc()
        return False
    finally:
        client.close()


if __name__ == "__main__":
    asyncio.run(test_commission_tracking())
