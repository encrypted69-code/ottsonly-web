import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
from bson import ObjectId
from core.config import settings

async def fix_user_ids():
    client = AsyncIOMotorClient(settings.MONGODB_URL)
    db = client[settings.DATABASE_NAME]
    
    # Get all orders
    orders = await db.orders.find({}).to_list(length=100)
    subscriptions = await db.subscriptions.find({}).to_list(length=100)
    
    print("Orders with User IDs:")
    for order in orders:
        user_id = order.get("user_id")
        print(f"Order ID: {order.get('_id')}")
        print(f"User ID: {user_id} (Type: {type(user_id).__name__})")
        
        if isinstance(user_id, str):
            try:
                user = await db.users.find_one({"_id": ObjectId(user_id)})
            except:
                user = None
        else:
            user = await db.users.find_one({"_id": user_id})
        
        if user:
            print(f"User Found: {user.get('email')}")
        else:
            print("User NOT Found")
        print()
    
    print("\nSubscriptions with User IDs:")
    for sub in subscriptions:
        user_id = sub.get("user_id")
        print(f"Subscription ID: {sub.get('_id')}")
        print(f"User ID: {user_id} (Type: {type(user_id).__name__})")
        
        if isinstance(user_id, str):
            try:
                user = await db.users.find_one({"_id": ObjectId(user_id)})
            except:
                user = None
        else:
            user = await db.users.find_one({"_id": user_id})
        
        if user:
            print(f"User Found: {user.get('email')}")
        else:
            print("User NOT Found")
        print()
    
    client.close()

asyncio.run(fix_user_ids())
