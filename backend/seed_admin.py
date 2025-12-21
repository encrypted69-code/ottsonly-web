"""
Seed admin user for the database
"""
import asyncio
import os
from motor.motor_asyncio import AsyncIOMotorClient
from datetime import datetime
import bcrypt
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# MongoDB connection from environment
MONGODB_URL = os.getenv("MONGODB_URL")
DATABASE_NAME = os.getenv("DATABASE_NAME", "ottsonly_db")
SUPER_ADMIN_EMAIL = os.getenv("SUPER_ADMIN_EMAIL", "admin@ottsonly.in")
SUPER_ADMIN_PASSWORD = os.getenv("SUPER_ADMIN_PASSWORD")

if not MONGODB_URL or not SUPER_ADMIN_PASSWORD:
    raise ValueError("MONGODB_URL and SUPER_ADMIN_PASSWORD must be set in .env file")

async def seed_admin():
    """Create admin user if doesn't exist"""
    client = AsyncIOMotorClient(MONGODB_URL)
    db = client[DATABASE_NAME]
    
    # Check if admin exists
    existing_admin = await db.users.find_one({"email": SUPER_ADMIN_EMAIL})
    
    if existing_admin:
        print("✅ Admin user already exists")
        return
    
    # Hash password
    password = SUPER_ADMIN_PASSWORD
    password_bytes = password.encode('utf-8')
    if len(password_bytes) > 72:
        password_bytes = password_bytes[:72]
    salt = bcrypt.gensalt(rounds=12)
    hashed_password = bcrypt.hashpw(password_bytes, salt).decode('utf-8')
    
    # Create admin user
    admin_user = {
        "name": "Admin",
        "email": SUPER_ADMIN_EMAIL,
        "phone": "0000000000",
        "password": hashed_password,
        "role": "admin",
        "wallet_balance": 0.0,
        "is_active": True,
        "email_verified": True,
        "phone_verified": True,
        "created_at": datetime.utcnow().isoformat(),
        "updated_at": datetime.utcnow().isoformat()
    }
    
    result = await db.users.insert_one(admin_user)
    print(f"✅ Admin user created with ID: {result.inserted_id}")
    print(f"📧 Email: {SUPER_ADMIN_EMAIL}")
    print(f"🔑 Password: Admin@12345")
    
    await client.close()

if __name__ == "__main__":
    print("🌱 Seeding admin user...")
    asyncio.run(seed_admin())
    print("✨ Done!")
