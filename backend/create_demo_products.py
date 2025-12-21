import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
from bson import ObjectId
from datetime import datetime
from core.config import settings

async def create_demo_products():
    client = AsyncIOMotorClient(settings.MONGODB_URL)
    db = client[settings.DATABASE_NAME]
    
    # Delete existing demo products
    await db.products.delete_many({"platform_name": {"$in": ["Netflix", "Amazon Prime Video", "YouTube Premium", "Pornhub", "Combo Plan"]}})
    
    products = [
        {
            "platform_name": "Netflix",
            "plan_name": "Premium 4K",
            "price": 99.0,
            "duration_days": 30,
            "description": "Private Screen • TV/Laptop Supported • 4K + HDR",
            "stock": 100,
            "is_active": True,
            "demo_credentials": {
                "email": "netflix.demo@ottsonly.com",
                "password": "Netflix@123"
            },
            "created_at": datetime.utcnow().isoformat()
        },
        {
            "platform_name": "Amazon Prime Video",
            "plan_name": "Monthly",
            "price": 35.0,
            "duration_days": 30,
            "description": "Private Single Screen • HD 1080p • No ads",
            "stock": 100,
            "is_active": True,
            "demo_credentials": {
                "email": "prime.demo@ottsonly.com",
                "password": "Prime@123"
            },
            "created_at": datetime.utcnow().isoformat()
        },
        {
            "platform_name": "YouTube Premium",
            "plan_name": "Individual",
            "price": 15.0,
            "duration_days": 30,
            "description": "No Ads • Background Play • YouTube Music • On your mail",
            "stock": 100,
            "is_active": True,
            "demo_credentials": {
                "email": "youtube.demo@ottsonly.com",
                "password": "YouTube@123"
            },
            "created_at": datetime.utcnow().isoformat()
        },
        {
            "platform_name": "Pornhub",
            "plan_name": "Premium",
            "price": 69.0,
            "duration_days": 30,
            "description": "Ad-free premium content • HD Quality",
            "stock": 100,
            "is_active": True,
            "demo_credentials": {
                "email": "pornhub.demo@ottsonly.com",
                "password": "Pornhub@123"
            },
            "created_at": datetime.utcnow().isoformat()
        },
        {
            "platform_name": "Combo Plan",
            "plan_name": "All-in-One",
            "price": 149.0,
            "duration_days": 30,
            "description": "Netflix Premium + Prime Video + YouTube Premium + Pornhub Premium",
            "stock": 100,
            "is_active": True,
            "demo_credentials": {
                "netflix_email": "netflix.demo@ottsonly.com",
                "netflix_password": "Netflix@123",
                "prime_email": "prime.demo@ottsonly.com",
                "prime_password": "Prime@123",
                "youtube_email": "youtube.demo@ottsonly.com",
                "youtube_password": "YouTube@123",
                "pornhub_email": "pornhub.demo@ottsonly.com",
                "pornhub_password": "Pornhub@123"
            },
            "created_at": datetime.utcnow().isoformat()
        }
    ]
    
    inserted_ids = []
    for product in products:
        result = await db.products.insert_one(product)
        inserted_ids.append(str(result.inserted_id))
        print(f"✅ Created: {product['platform_name']} - {product['plan_name']} (ID: {result.inserted_id})")
    
    print("\n" + "="*60)
    print("DEMO CREDENTIALS FOR TESTING")
    print("="*60)
    print("\n🎬 NETFLIX PREMIUM 4K")
    print("   Email: netflix.demo@ottsonly.com")
    print("   Password: Netflix@123")
    print("\n📺 PRIME VIDEO")
    print("   Email: prime.demo@ottsonly.com")
    print("   Password: Prime@123")
    print("\n▶️ YOUTUBE PREMIUM")
    print("   Email: youtube.demo@ottsonly.com")
    print("   Password: YouTube@123")
    print("\n🔞 PORNHUB PREMIUM")
    print("   Email: pornhub.demo@ottsonly.com")
    print("   Password: Pornhub@123")
    print("\n📦 COMBO PLAN (All 4 services)")
    print("   Includes all above credentials")
    print("\n" + "="*60)
    print(f"\n✅ All products created successfully!")
    print(f"Product IDs: {inserted_ids}")
    print("="*60)
    
    client.close()

asyncio.run(create_demo_products())
