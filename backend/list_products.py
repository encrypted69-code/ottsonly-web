import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
from core.config import settings

async def get_products():
    client = AsyncIOMotorClient(settings.MONGODB_URL)
    db = client[settings.DATABASE_NAME]
    
    products = await db.products.find({}).to_list(length=100)
    
    print("=" * 60)
    print("AVAILABLE PRODUCTS IN DATABASE")
    print("=" * 60)
    print()
    
    if not products:
        print("No products found in database!")
    else:
        for product in products:
            print(f"Platform: {product.get('platform_name')}")
            print(f"Plan: {product.get('plan_name')}")
            print(f"Price: Rs.{product.get('price')}")
            print(f"Duration: {product.get('duration_days')} days")
            print(f"Stock: {product.get('stock')}")
            print(f"Active: {product.get('is_active')}")
            print()
    
    print("=" * 60)
    
    client.close()

asyncio.run(get_products())
