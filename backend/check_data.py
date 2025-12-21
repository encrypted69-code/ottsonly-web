import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
from core.config import settings

async def check_user_data():
    client = AsyncIOMotorClient(settings.MONGODB_URL)
    db = client[settings.DATABASE_NAME]
    
    # Check users
    print("=" * 60)
    print("CHECKING DATABASE")
    print("=" * 60)
    
    users = await db.users.find({}).to_list(length=100)
    print(f"\nTotal Users: {len(users)}")
    
    # Check orders
    orders = await db.orders.find({}).to_list(length=100)
    print(f"Total Orders: {len(orders)}")
    
    if orders:
        print("\nRecent Orders:")
        for order in orders[:5]:
            user = await db.users.find_one({"_id": order.get("user_id")})
            print(f"  - User: {user.get('email') if user else 'Unknown'}")
            print(f"    Product: {order.get('product_name')}")
            print(f"    Amount: Rs.{order.get('amount')}")
            print(f"    Status: {order.get('status')}")
            print(f"    Date: {order.get('created_at')}")
            print()
    
    # Check subscriptions
    subscriptions = await db.subscriptions.find({}).to_list(length=100)
    print(f"Total Subscriptions: {len(subscriptions)}")
    
    if subscriptions:
        print("\nActive Subscriptions:")
        for sub in subscriptions:
            user = await db.users.find_one({"_id": sub.get("user_id")})
            print(f"  - User: {user.get('email') if user else 'Unknown'}")
            print(f"    Platform: {sub.get('platform_name')}")
            print(f"    Plan: {sub.get('plan_name')}")
            print(f"    Status: {sub.get('status')}")
            print(f"    End Date: {sub.get('end_date')}")
            print()
    
    print("=" * 60)
    
    client.close()

asyncio.run(check_user_data())
