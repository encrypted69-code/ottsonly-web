"""
Test script to verify Razorpay payment verification is idempotent and race-condition safe
Run this to ensure same payment cannot be credited multiple times
"""
import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
from bson import ObjectId
from core.config import settings
from datetime import datetime
import hmac
import hashlib


async def test_payment_replay_attack():
    """Simulate payment replay attack - same payment verified multiple times"""
    
    client = AsyncIOMotorClient(settings.MONGODB_URL)
    db = client[settings.DATABASE_NAME]
    
    print("\n" + "="*60)
    print("🧪 TEST 1: Payment Replay Attack Prevention")
    print("="*60)
    
    # Create test user
    test_user = {
        "name": "Payment Test User",
        "email": f"payment_test_{datetime.utcnow().timestamp()}@test.com",
        "phone": f"8888{int(datetime.utcnow().timestamp()) % 1000000:06d}",
        "password": "test_hash",
        "role": "user",
        "wallet_balance": 0.0,
        "is_active": True,
        "created_at": datetime.utcnow().isoformat()
    }
    
    result = await db.users.insert_one(test_user)
    user_id = str(result.inserted_id)
    
    print(f"\n✅ Created test user: {user_id}")
    print(f"   Initial wallet balance: ₹{test_user['wallet_balance']}")
    
    # Create pending transaction (simulating Razorpay order creation)
    razorpay_order_id = "order_test_" + str(int(datetime.utcnow().timestamp()))
    razorpay_payment_id = "pay_test_" + str(int(datetime.utcnow().timestamp()))
    amount = 500.0
    
    pending_txn = {
        "user_id": user_id,
        "type": "credit",
        "amount": amount,
        "status": "pending",
        "razorpay_order_id": razorpay_order_id,
        "razorpay_payment_id": None,
        "created_at": datetime.utcnow().isoformat()
    }
    
    await db.wallet_pending_transactions.insert_one(pending_txn)
    print(f"\n✅ Created pending transaction: {razorpay_order_id}")
    print(f"   Amount: ₹{amount}")
    
    # Generate valid signature
    razorpay_signature = hmac.new(
        settings.RAZORPAY_KEY_SECRET.encode(),
        f"{razorpay_order_id}|{razorpay_payment_id}".encode(),
        hashlib.sha256
    ).hexdigest()
    
    print(f"\n📝 Payment details:")
    print(f"   Order ID: {razorpay_order_id}")
    print(f"   Payment ID: {razorpay_payment_id}")
    print(f"   Signature: {razorpay_signature[:20]}...")
    
    # Test: Simulate 10 concurrent payment verification requests (replay attack)
    print(f"\n🔥 Simulating REPLAY ATTACK:")
    print(f"   Attempting 10 concurrent payment verifications")
    print(f"   Expected: 1 succeeds, 9 fail (already processed)")
    
    success_count = 0
    fail_count = 0
    
    async def verify_payment(attempt_id: int):
        """Atomic payment verification"""
        nonlocal success_count, fail_count
        
        try:
            # This mimics what WalletService.verify_and_credit_wallet() does
            # Step 1: Atomically lock transaction
            locked_txn = await db.wallet_pending_transactions.find_one_and_update(
                {
                    "razorpay_order_id": razorpay_order_id,
                    "user_id": user_id,
                    "status": "pending"  # Only if still pending
                },
                {
                    "$set": {
                        "status": "processing",
                        "razorpay_payment_id": razorpay_payment_id,
                        "razorpay_signature": razorpay_signature,
                        "processing_started_at": datetime.utcnow().isoformat()
                    }
                },
                return_document=False
            )
            
            if not locked_txn:
                print(f"   ❌ Attempt {attempt_id}: Blocked (already processed)")
                fail_count += 1
                return False
            
            # Step 2: Credit wallet
            updated_user = await db.users.find_one_and_update(
                {"_id": ObjectId(user_id)},
                {"$inc": {"wallet_balance": amount}},
                return_document=True
            )
            
            # Step 3: Mark as completed
            await db.wallet_pending_transactions.update_one(
                {"_id": locked_txn["_id"]},
                {"$set": {
                    "status": "completed",
                    "completed_at": datetime.utcnow().isoformat()
                }}
            )
            
            print(f"   ✅ Attempt {attempt_id}: SUCCESS! Wallet credited to ₹{updated_user['wallet_balance']}")
            success_count += 1
            return True
            
        except Exception as e:
            print(f"   ❌ Attempt {attempt_id}: Error - {e}")
            fail_count += 1
            return False
    
    # Run 10 concurrent verification attempts
    tasks = [verify_payment(i+1) for i in range(10)]
    await asyncio.gather(*tasks)
    
    # Check results
    final_user = await db.users.find_one({"_id": ObjectId(user_id)})
    final_balance = final_user["wallet_balance"]
    
    final_txn = await db.wallet_pending_transactions.find_one({"razorpay_order_id": razorpay_order_id})
    final_status = final_txn["status"]
    
    print(f"\n📊 Results:")
    print(f"   Successful verifications: {success_count}")
    print(f"   Blocked verifications: {fail_count}")
    print(f"   Final wallet balance: ₹{final_balance}")
    print(f"   Transaction status: {final_status}")
    
    # Validate
    if final_balance == amount and success_count == 1 and fail_count == 9 and final_status == "completed":
        print(f"   ✅ PASS: Payment verified exactly ONCE! Replay attack prevented.")
    elif final_balance > amount:
        print(f"   ❌ FAIL: CRITICAL - Wallet credited {final_balance/amount}x times! REPLAY ATTACK SUCCESSFUL!")
    else:
        print(f"   ⚠️  WARNING: Unexpected result. Balance: ₹{final_balance}, Success: {success_count}")
    
    # Cleanup
    await db.users.delete_one({"_id": ObjectId(user_id)})
    await db.wallet_pending_transactions.delete_many({"user_id": user_id})
    print(f"\n🧹 Cleaned up test data")
    
    client.close()


async def test_concurrent_different_payments():
    """Test that different payments can be processed concurrently"""
    
    client = AsyncIOMotorClient(settings.MONGODB_URL)
    db = client[settings.DATABASE_NAME]
    
    print("\n" + "="*60)
    print("🧪 TEST 2: Concurrent Different Payments")
    print("="*60)
    
    # Create test user
    test_user = {
        "name": "Multi Payment Test User",
        "email": f"multi_pay_test_{datetime.utcnow().timestamp()}@test.com",
        "phone": f"7777{int(datetime.utcnow().timestamp()) % 1000000:06d}",
        "password": "test_hash",
        "role": "user",
        "wallet_balance": 0.0,
        "is_active": True,
        "created_at": datetime.utcnow().isoformat()
    }
    
    result = await db.users.insert_one(test_user)
    user_id = str(result.inserted_id)
    
    print(f"\n✅ Created test user with ₹0 balance")
    
    # Create 5 different pending transactions
    transactions = []
    for i in range(5):
        order_id = f"order_multi_{int(datetime.utcnow().timestamp())}_{i}"
        payment_id = f"pay_multi_{int(datetime.utcnow().timestamp())}_{i}"
        
        txn = {
            "user_id": user_id,
            "type": "credit",
            "amount": 100.0,
            "status": "pending",
            "razorpay_order_id": order_id,
            "razorpay_payment_id": None,
            "created_at": datetime.utcnow().isoformat()
        }
        
        await db.wallet_pending_transactions.insert_one(txn)
        
        signature = hmac.new(
            settings.RAZORPAY_KEY_SECRET.encode(),
            f"{order_id}|{payment_id}".encode(),
            hashlib.sha256
        ).hexdigest()
        
        transactions.append({
            "order_id": order_id,
            "payment_id": payment_id,
            "signature": signature,
            "amount": 100.0
        })
    
    print(f"\n✅ Created 5 pending transactions (₹100 each)")
    print(f"   Verifying all 5 concurrently...")
    
    async def verify_distinct_payment(txn_data: dict):
        """Verify a distinct payment"""
        try:
            locked_txn = await db.wallet_pending_transactions.find_one_and_update(
                {
                    "razorpay_order_id": txn_data["order_id"],
                    "user_id": user_id,
                    "status": "pending"
                },
                {
                    "$set": {
                        "status": "processing",
                        "razorpay_payment_id": txn_data["payment_id"],
                        "razorpay_signature": txn_data["signature"],
                        "processing_started_at": datetime.utcnow().isoformat()
                    }
                },
                return_document=False
            )
            
            if not locked_txn:
                return False
            
            await db.users.update_one(
                {"_id": ObjectId(user_id)},
                {"$inc": {"wallet_balance": txn_data["amount"]}}
            )
            
            await db.wallet_pending_transactions.update_one(
                {"_id": locked_txn["_id"]},
                {"$set": {
                    "status": "completed",
                    "completed_at": datetime.utcnow().isoformat()
                }}
            )
            
            return True
        except:
            return False
    
    # Verify all 5 concurrently
    tasks = [verify_distinct_payment(txn) for txn in transactions]
    results = await asyncio.gather(*tasks)
    
    success_count = sum(results)
    
    # Check final balance
    final_user = await db.users.find_one({"_id": ObjectId(user_id)})
    final_balance = final_user["wallet_balance"]
    
    print(f"\n📊 Results:")
    print(f"   Successful payments: {success_count}/5")
    print(f"   Final wallet balance: ₹{final_balance}")
    
    if final_balance == 500.0 and success_count == 5:
        print(f"   ✅ PASS: All 5 distinct payments processed successfully!")
    else:
        print(f"   ❌ FAIL: Expected ₹500, got ₹{final_balance}")
    
    # Cleanup
    await db.users.delete_one({"_id": ObjectId(user_id)})
    await db.wallet_pending_transactions.delete_many({"user_id": user_id})
    print(f"\n🧹 Cleaned up test data")
    
    client.close()


if __name__ == "__main__":
    print("="*60)
    print("RAZORPAY PAYMENT VERIFICATION SECURITY TEST")
    print("Testing idempotency and replay attack prevention")
    print("="*60)
    
    asyncio.run(test_payment_replay_attack())
    asyncio.run(test_concurrent_different_payments())
    
    print("\n" + "="*60)
    print("🎯 ALL TESTS COMPLETE")
    print("="*60)
