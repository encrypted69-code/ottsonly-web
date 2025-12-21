"""
OTTSONLY Backend - Sample Data Seeder
Populates database with sample data for development and testing
"""
import asyncio
from datetime import datetime
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
import os

# Load environment variables
load_dotenv()

MONGODB_URL = os.getenv("MONGODB_URL", "mongodb://localhost:27017")
DATABASE_NAME = os.getenv("DATABASE_NAME", "ottsonly_db")


async def seed_data():
    """Seed the database with sample data"""
    
    print("🌱 Seeding OTTSONLY database with sample data...")
    
    # Connect to MongoDB
    client = AsyncIOMotorClient(MONGODB_URL)
    db = client[DATABASE_NAME]
    
    try:
        # 1. Create sample users
        print("\n👥 Creating sample users...")
        
        # Check if users already exist
        existing_users = await db.users.count_documents({})
        if existing_users > 0:
            print(f"   ⚠️  Found {existing_users} existing users. Skipping user creation.")
        else:
            users = [
                {
                    "phone": "+919876543210",
                    "name": "Admin User",
                    "email": "admin@ottsonly.com",
                    "role": "admin",
                    "wallet_balance": 5000.0,
                    "created_at": datetime.utcnow().isoformat(),
                    "updated_at": datetime.utcnow().isoformat()
                },
                {
                    "phone": "+919876543211",
                    "name": "John Doe",
                    "email": "john@example.com",
                    "role": "user",
                    "wallet_balance": 1000.0,
                    "created_at": datetime.utcnow().isoformat(),
                    "updated_at": datetime.utcnow().isoformat()
                },
                {
                    "phone": "+919876543212",
                    "name": "Support Agent",
                    "email": "support@ottsonly.com",
                    "role": "support",
                    "wallet_balance": 0.0,
                    "created_at": datetime.utcnow().isoformat(),
                    "updated_at": datetime.utcnow().isoformat()
                }
            ]
            
            result = await db.users.insert_many(users)
            print(f"   ✅ Created {len(result.inserted_ids)} users")
        
        # 2. Create sample products
        print("\n📦 Creating sample products...")
        
        existing_products = await db.products.count_documents({})
        if existing_products > 0:
            print(f"   ⚠️  Found {existing_products} existing products. Skipping product creation.")
        else:
            products = [
                {
                    "platform_name": "Netflix",
                    "plan_name": "Premium 4K",
                    "price": 649.0,
                    "duration_days": 30,
                    "stock": 50,
                    "is_active": True,
                    "description": "Ultra HD streaming on 4 devices simultaneously",
                    "created_at": datetime.utcnow().isoformat(),
                    "updated_at": datetime.utcnow().isoformat()
                },
                {
                    "platform_name": "Netflix",
                    "plan_name": "Basic",
                    "price": 199.0,
                    "duration_days": 30,
                    "stock": 100,
                    "is_active": True,
                    "description": "SD quality on 1 device",
                    "created_at": datetime.utcnow().isoformat(),
                    "updated_at": datetime.utcnow().isoformat()
                },
                {
                    "platform_name": "Amazon Prime Video",
                    "plan_name": "Monthly",
                    "price": 299.0,
                    "duration_days": 30,
                    "stock": 75,
                    "is_active": True,
                    "description": "Prime Video + Music + Fast delivery",
                    "created_at": datetime.utcnow().isoformat(),
                    "updated_at": datetime.utcnow().isoformat()
                },
                {
                    "platform_name": "Disney+ Hotstar",
                    "plan_name": "Super",
                    "price": 299.0,
                    "duration_days": 30,
                    "stock": 60,
                    "is_active": True,
                    "description": "Watch on 2 devices, Full HD quality",
                    "created_at": datetime.utcnow().isoformat(),
                    "updated_at": datetime.utcnow().isoformat()
                },
                {
                    "platform_name": "YouTube Premium",
                    "plan_name": "Individual",
                    "price": 129.0,
                    "duration_days": 30,
                    "stock": 40,
                    "is_active": True,
                    "description": "Ad-free videos, background play, downloads",
                    "created_at": datetime.utcnow().isoformat(),
                    "updated_at": datetime.utcnow().isoformat()
                },
                {
                    "platform_name": "Spotify",
                    "plan_name": "Premium",
                    "price": 119.0,
                    "duration_days": 30,
                    "stock": 80,
                    "is_active": True,
                    "description": "Ad-free music streaming, offline downloads",
                    "created_at": datetime.utcnow().isoformat(),
                    "updated_at": datetime.utcnow().isoformat()
                },
                {
                    "platform_name": "SonyLIV",
                    "plan_name": "Premium",
                    "price": 299.0,
                    "duration_days": 30,
                    "stock": 30,
                    "is_active": True,
                    "description": "Sports, Movies, TV Shows",
                    "created_at": datetime.utcnow().isoformat(),
                    "updated_at": datetime.utcnow().isoformat()
                },
                {
                    "platform_name": "ZEE5",
                    "plan_name": "All Access",
                    "price": 99.0,
                    "duration_days": 30,
                    "stock": 50,
                    "is_active": True,
                    "description": "Premium shows and movies",
                    "created_at": datetime.utcnow().isoformat(),
                    "updated_at": datetime.utcnow().isoformat()
                }
            ]
            
            result = await db.products.insert_many(products)
            print(f"   ✅ Created {len(result.inserted_ids)} products")
        
        # 3. Create sample notification for admin
        print("\n🔔 Creating sample notifications...")
        
        admin_user = await db.users.find_one({"role": "admin"})
        if admin_user:
            notification = {
                "user_id": str(admin_user["_id"]),
                "title": "Welcome to OTTSONLY Admin Panel",
                "message": "Your admin account is ready. You can now manage products, orders, and subscriptions.",
                "type": "info",
                "is_read": False,
                "created_at": datetime.utcnow().isoformat()
            }
            await db.notifications.insert_one(notification)
            print("   ✅ Created welcome notification for admin")
        
        print("\n✅ Database seeding completed successfully!")
        print("\n" + "="*60)
        print("SAMPLE LOGIN CREDENTIALS:")
        print("="*60)
        print("\nAdmin User:")
        print("  Phone: +919876543210")
        print("  OTP: 123456 (dev mode)")
        print("  Role: admin")
        print("  Wallet: ₹5,000")
        print("\nRegular User:")
        print("  Phone: +919876543211")
        print("  OTP: 123456 (dev mode)")
        print("  Role: user")
        print("  Wallet: ₹1,000")
        print("\nSupport User:")
        print("  Phone: +919876543212")
        print("  OTP: 123456 (dev mode)")
        print("  Role: support")
        print("  Wallet: ₹0")
        print("="*60)
        print("\n📝 Next steps:")
        print("1. Run: python main.py")
        print("2. Visit: http://localhost:8000/docs")
        print("3. Login with one of the sample users")
        print("4. Browse products at: http://localhost:8000/products/")
        print("\n")
        
    except Exception as e:
        print(f"\n❌ Error seeding database: {e}")
        raise
    finally:
        client.close()


async def clear_data():
    """Clear all data from database"""
    print("🗑️  Clearing all data from database...")
    
    client = AsyncIOMotorClient(MONGODB_URL)
    db = client[DATABASE_NAME]
    
    try:
        collections = await db.list_collection_names()
        for collection in collections:
            await db[collection].delete_many({})
            print(f"   ✅ Cleared {collection}")
        
        print("\n✅ All data cleared successfully!")
    except Exception as e:
        print(f"\n❌ Error clearing database: {e}")
        raise
    finally:
        client.close()


if __name__ == "__main__":
    import sys
    
    if len(sys.argv) > 1 and sys.argv[1] == "clear":
        # Clear database
        print("⚠️  WARNING: This will delete all data!")
        confirm = input("Type 'yes' to confirm: ")
        if confirm.lower() == "yes":
            asyncio.run(clear_data())
        else:
            print("Cancelled.")
    else:
        # Seed database
        asyncio.run(seed_data())
