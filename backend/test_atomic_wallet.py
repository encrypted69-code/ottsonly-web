"""
Test script to verify atomic wallet operations prevent race conditions
Run this to ensure concurrent requests don't cause negative balances or lost money
"""
import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
from bson import ObjectId
from core.config import settings
from datetime import datetime


async def test_concurrent_wallet_operations():
    """Simulate concurrent wallet deductions to test atomicity"""
    
    client = AsyncIOMotorClient(settings.MONGODB_URL)
    db = client[settings.DATABASE_NAME]
    
    # Create test user with ₹100 balance
    test_user = {
        "name": "Atomic Test User",
        "email": f"atomic_test_{datetime.utcnow().timestamp()}@test.com",
        "phone": f"9999{int(datetime.utcnow().timestamp()) % 1000000:06d}",
        "password": "test_hash",
        "role": "user",
        "wallet_balance": 100.0,
        "withdrawable_balance": 0.0,
        "is_active": True,
        "created_at": datetime.utcnow().isoformat()
    }
    
    result = await db.users.insert_one(test_user)
    user_id = str(result.inserted_id)
    
    print(f"\n✅ Created test user: {user_id}")
    print(f"   Initial balance: ₹{test_user['wallet_balance']}")
    
    # Test 1: Concurrent deductions using atomic operations
    print("\n🧪 TEST 1: Concurrent Atomic Deductions")
    print("   Attempting 5 concurrent ₹25 deductions (total ₹125)")
    print("   Expected: 4 succeed (₹100), 1 fails (insufficient balance)")
    
    async def atomic_deduct(amount: float, test_id: int):
        """Atomic wallet deduction"""
        updated_user = await db.users.find_one_and_update(
            {
                "_id": ObjectId(user_id),
                "wallet_balance": {"$gte": amount}
            },
            {
                "$inc": {"wallet_balance": -amount}
            },
            return_document=True
        )
        if updated_user:
            print(f"   ✅ Test {test_id}: Deducted ₹{amount}, new balance: ₹{updated_user['wallet_balance']}")
            return True
        else:
            print(f"   ❌ Test {test_id}: Failed (insufficient balance)")
            return False
    
    # Run 5 concurrent deductions
    tasks = [atomic_deduct(25.0, i+1) for i in range(5)]
    results = await asyncio.gather(*tasks)
    
    success_count = sum(results)
    fail_count = len(results) - success_count
    
    # Check final balance
    final_user = await db.users.find_one({"_id": ObjectId(user_id)})
    final_balance = final_user["wallet_balance"]
    
    print(f"\n📊 Results:")
    print(f"   Successful deductions: {success_count}")
    print(f"   Failed deductions: {fail_count}")
    print(f"   Final balance: ₹{final_balance}")
    
    # Validate
    expected_balance = 100.0 - (success_count * 25.0)
    if final_balance == expected_balance and final_balance >= 0:
        print(f"   ✅ PASS: Balance is correct and non-negative!")
    else:
        print(f"   ❌ FAIL: Expected ₹{expected_balance}, got ₹{final_balance}")
    
    # Test 2: Reset and test concurrent credits
    print(f"\n🧪 TEST 2: Concurrent Atomic Credits")
    await db.users.update_one(
        {"_id": ObjectId(user_id)},
        {"$set": {"wallet_balance": 0.0}}
    )
    print(f"   Reset balance to ₹0")
    print(f"   Attempting 10 concurrent ₹50 credits (total ₹500)")
    
    async def atomic_credit(amount: float, test_id: int):
        """Atomic wallet credit"""
        updated_user = await db.users.find_one_and_update(
            {"_id": ObjectId(user_id)},
            {"$inc": {"wallet_balance": amount}},
            return_document=True
        )
        if updated_user:
            print(f"   ✅ Test {test_id}: Credited ₹{amount}, new balance: ₹{updated_user['wallet_balance']}")
            return amount
        return 0
    
    # Run 10 concurrent credits
    tasks = [atomic_credit(50.0, i+1) for i in range(10)]
    credit_results = await asyncio.gather(*tasks)
    
    total_credited = sum(credit_results)
    final_user = await db.users.find_one({"_id": ObjectId(user_id)})
    final_balance = final_user["wallet_balance"]
    
    print(f"\n📊 Results:")
    print(f"   Total credited: ₹{total_credited}")
    print(f"   Final balance: ₹{final_balance}")
    
    if final_balance == total_credited == 500.0:
        print(f"   ✅ PASS: All credits accounted for, no money lost!")
    else:
        print(f"   ❌ FAIL: Expected ₹500, got ₹{final_balance}")
    
    # Cleanup
    await db.users.delete_one({"_id": ObjectId(user_id)})
    print(f"\n🧹 Cleaned up test user")
    
    client.close()
    
    print("\n" + "="*60)
    print("✅ ATOMIC WALLET OPERATIONS TEST COMPLETE")
    print("="*60)


if __name__ == "__main__":
    print("="*60)
    print("ATOMIC WALLET OPERATIONS TEST")
    print("Testing concurrent wallet operations for race conditions")
    print("="*60)
    
    asyncio.run(test_concurrent_wallet_operations())
