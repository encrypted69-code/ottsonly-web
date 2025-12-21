"""
Test script to verify atomic stock operations prevent overselling
Run this to ensure concurrent purchases don't cause negative stock
"""
import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
from bson import ObjectId
from core.config import settings
from datetime import datetime


async def test_concurrent_stock_decrement():
    """Simulate concurrent product purchases to test stock atomicity"""
    
    client = AsyncIOMotorClient(settings.MONGODB_URL)
    db = client[settings.DATABASE_NAME]
    
    # Create test product with stock = 5
    test_product = {
        "platform_name": "Atomic Test Product",
        "plan_name": "Stock Test Plan",
        "price": 10.0,
        "duration_days": 30,
        "stock": 5,
        "is_active": True,
        "created_at": datetime.utcnow().isoformat(),
        "updated_at": datetime.utcnow().isoformat()
    }
    
    result = await db.products.insert_one(test_product)
    product_id = str(result.inserted_id)
    
    print(f"\n✅ Created test product: {product_id}")
    print(f"   Initial stock: {test_product['stock']}")
    
    # Test: Concurrent stock decrements
    print("\n🧪 TEST: Concurrent Stock Decrements")
    print("   Attempting 10 concurrent purchases on stock of 5")
    print("   Expected: 5 succeed, 5 fail (out of stock)")
    
    success_count = 0
    fail_count = 0
    
    async def atomic_purchase(test_id: int):
        """Atomic stock decrement using find_one_and_update"""
        nonlocal success_count, fail_count
        
        try:
            # This mimics what ProductService.decrease_stock() does
            result = await db.products.find_one_and_update(
                {
                    "_id": ObjectId(product_id),
                    "stock": {"$gte": 1}  # Atomic check: stock >= 1
                },
                {
                    "$inc": {"stock": -1}  # Atomic decrement
                },
                return_document=True  # Return updated document
            )
            
            if result:
                new_stock = result["stock"]
                print(f"   ✅ Purchase {test_id}: Success! New stock: {new_stock}")
                success_count += 1
                return True
            else:
                print(f"   ❌ Purchase {test_id}: Failed (out of stock)")
                fail_count += 1
                return False
                
        except Exception as e:
            print(f"   ❌ Purchase {test_id}: Error - {e}")
            fail_count += 1
            return False
    
    # Run 10 concurrent purchases
    tasks = [atomic_purchase(i+1) for i in range(10)]
    await asyncio.gather(*tasks)
    
    # Check final stock
    final_product = await db.products.find_one({"_id": ObjectId(product_id)})
    final_stock = final_product["stock"]
    
    print(f"\n📊 Results:")
    print(f"   Successful purchases: {success_count}")
    print(f"   Failed purchases: {fail_count}")
    print(f"   Final stock: {final_stock}")
    
    # Validate
    if final_stock == 0 and success_count == 5 and fail_count == 5:
        print(f"   ✅ PASS: Stock is correct! No overselling occurred.")
    elif final_stock < 0:
        print(f"   ❌ FAIL: CRITICAL - Negative stock detected! Overselling occurred!")
    else:
        print(f"   ⚠️  WARNING: Unexpected result. Stock: {final_stock}, Success: {success_count}")
    
    # Test 2: High concurrency stress test
    print(f"\n🧪 TEST 2: High Concurrency Stress Test")
    
    # Reset stock to 50
    await db.products.update_one(
        {"_id": ObjectId(product_id)},
        {"$set": {"stock": 50}}
    )
    print(f"   Reset stock to 50")
    print(f"   Attempting 100 concurrent purchases")
    
    success_count = 0
    fail_count = 0
    
    # Run 100 concurrent purchases
    tasks = [atomic_purchase(i+1) for i in range(100)]
    await asyncio.gather(*tasks)
    
    final_product = await db.products.find_one({"_id": ObjectId(product_id)})
    final_stock = final_product["stock"]
    
    print(f"\n📊 Results:")
    print(f"   Successful purchases: {success_count}")
    print(f"   Failed purchases: {fail_count}")
    print(f"   Final stock: {final_stock}")
    
    if final_stock == 0 and success_count == 50 and fail_count == 50:
        print(f"   ✅ PASS: Perfect! Stock handled correctly under high load.")
    elif final_stock < 0:
        print(f"   ❌ FAIL: CRITICAL - Negative stock! System vulnerable to overselling!")
    elif final_stock > 0:
        print(f"   ⚠️  WARNING: Stock remaining: {final_stock}. Some purchases may have failed incorrectly.")
    
    # Cleanup
    await db.products.delete_one({"_id": ObjectId(product_id)})
    print(f"\n🧹 Cleaned up test product")
    
    client.close()
    
    print("\n" + "="*60)
    print("✅ ATOMIC STOCK OPERATIONS TEST COMPLETE")
    print("="*60)


async def test_rollback_on_failure():
    """Test that stock is restored when order fails after stock decrement"""
    
    client = AsyncIOMotorClient(settings.MONGODB_URL)
    db = client[settings.DATABASE_NAME]
    
    print("\n" + "="*60)
    print("🧪 TEST 3: Stock Rollback on Order Failure")
    print("="*60)
    
    # Create test product
    test_product = {
        "platform_name": "Rollback Test Product",
        "plan_name": "Test Plan",
        "price": 100.0,
        "duration_days": 30,
        "stock": 10,
        "is_active": True,
        "created_at": datetime.utcnow().isoformat()
    }
    
    result = await db.products.insert_one(test_product)
    product_id = str(result.inserted_id)
    
    print(f"\n✅ Created test product with stock: 10")
    
    # Simulate: Decrement stock, then fail, then rollback
    print(f"\n📝 Simulating order flow:")
    print(f"   1. Decrement stock atomically")
    
    # Step 1: Atomic stock decrement
    result = await db.products.find_one_and_update(
        {"_id": ObjectId(product_id), "stock": {"$gte": 1}},
        {"$inc": {"stock": -1}},
        return_document=True
    )
    
    if result:
        print(f"   ✅ Stock decremented to: {result['stock']}")
    else:
        print(f"   ❌ Stock decrement failed")
        return
    
    print(f"   2. Simulating payment failure...")
    print(f"   3. Rolling back stock")
    
    # Step 2: Rollback stock
    await db.products.update_one(
        {"_id": ObjectId(product_id)},
        {"$inc": {"stock": 1}}
    )
    
    # Verify final stock
    final_product = await db.products.find_one({"_id": ObjectId(product_id)})
    final_stock = final_product["stock"]
    
    print(f"\n📊 Results:")
    print(f"   Final stock after rollback: {final_stock}")
    
    if final_stock == 10:
        print(f"   ✅ PASS: Stock correctly restored to original value!")
    else:
        print(f"   ❌ FAIL: Expected stock=10, got stock={final_stock}")
    
    # Cleanup
    await db.products.delete_one({"_id": ObjectId(product_id)})
    print(f"\n🧹 Cleaned up test product")
    
    client.close()


if __name__ == "__main__":
    print("="*60)
    print("ATOMIC STOCK OPERATIONS TEST SUITE")
    print("Testing concurrent product purchases for race conditions")
    print("="*60)
    
    asyncio.run(test_concurrent_stock_decrement())
    asyncio.run(test_rollback_on_failure())
    
    print("\n" + "="*60)
    print("🎯 ALL TESTS COMPLETE")
    print("="*60)
