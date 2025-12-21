"""
Update existing subscriptions with credentials from IDP
"""
import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
from core.config import settings
from datetime import datetime


async def update_subscriptions_with_idp_credentials():
    """Assign IDP credentials to existing subscriptions that don't have them"""
    client = AsyncIOMotorClient(settings.MONGODB_URL)
    db = client[settings.MONGODB_DB_NAME]
    
    print("\n" + "="*60)
    print("🔄 UPDATING SUBSCRIPTIONS WITH IDP CREDENTIALS")
    print("="*60 + "\n")
    
    # Get all active subscriptions
    subscriptions = await db.subscriptions.find({"status": "active"}).to_list(length=1000)
    
    if not subscriptions:
        print("❌ No active subscriptions found")
        client.close()
        return
    
    print(f"📋 Found {len(subscriptions)} active subscriptions\n")
    
    updated_count = 0
    skipped_count = 0
    
    for sub in subscriptions:
        platform_name = sub.get("platform_name", "")
        
        # Skip YouTube subscriptions (they work differently)
        if "youtube" in platform_name.lower():
            print(f"⏭️  Skipping YouTube subscription: {sub['_id']}")
            skipped_count += 1
            continue
        
        # Check if already has credentials
        if sub.get("credentials"):
            print(f"✓ Already has credentials: {platform_name} - {sub['_id']}")
            skipped_count += 1
            continue
        
        # Find matching credential from IDP
        credential = await db.credentials.find_one({
            "platform": {"$regex": platform_name, "$options": "i"},
            "is_active": True
        })
        
        if credential:
            # Update subscription with credentials
            new_credentials = {
                "email": credential["username"],
                "password": credential["password"]
            }
            
            await db.subscriptions.update_one(
                {"_id": sub["_id"]},
                {
                    "$set": {
                        "credentials": new_credentials,
                        "updated_at": datetime.utcnow().isoformat()
                    }
                }
            )
            
            print(f"✅ Updated: {platform_name} - {sub['_id']}")
            print(f"   Email: {credential['username']}")
            print(f"   Password: {credential['password']}\n")
            updated_count += 1
        else:
            print(f"⚠️  No IDP credential found for: {platform_name} - {sub['_id']}\n")
            skipped_count += 1
    
    print("="*60)
    print(f"✅ Updated: {updated_count} subscriptions")
    print(f"⏭️  Skipped: {skipped_count} subscriptions")
    print("="*60 + "\n")
    
    client.close()


if __name__ == "__main__":
    asyncio.run(update_subscriptions_with_idp_credentials())
