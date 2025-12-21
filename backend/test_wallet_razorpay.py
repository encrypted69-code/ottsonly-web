"""Test wallet service Razorpay integration"""
import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
from core.config import settings
from wallet.service import WalletService


async def test_wallet_service():
    """Test WalletService order creation"""
    print("=== Testing WalletService ===")
    print(f"Key ID: {settings.RAZORPAY_KEY_ID}")
    print(f"Secret: {settings.RAZORPAY_KEY_SECRET[:10]}...")
    
    # Initialize DB and service
    client = AsyncIOMotorClient(settings.MONGODB_URL)
    db = client[settings.DATABASE_NAME]
    wallet_service = WalletService(db)
    
    print("\n✅ WalletService initialized")
    print(f"Razorpay client: {wallet_service.razorpay_client}")
    
    # Try to create an order
    try:
        result = await wallet_service.create_razorpay_order(
            user_id="test_user_123",
            amount=10.0
        )
        print(f"\n✅ SUCCESS! Order created:")
        print(f"Order ID: {result['order_id']}")
        print(f"Amount: {result['amount']}")
        print(f"Full result: {result}")
    except Exception as e:
        print(f"\n❌ FAILED: {e}")
    finally:
        client.close()


if __name__ == "__main__":
    asyncio.run(test_wallet_service())
