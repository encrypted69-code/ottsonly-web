"""Update existing subscriptions with demo credentials from products"""
from motor.motor_asyncio import AsyncIOMotorClient
from bson import ObjectId
import asyncio

async def main():
    client = AsyncIOMotorClient('mongodb://localhost:27017')
    db = client.ottsonly
    
    print("\n=== Updating Subscriptions with Credentials ===\n")
    
    # Get all subscriptions
    subscriptions = await db.subscriptions.find({}).to_list(length=100)
    
    for sub in subscriptions:
        # Get the product
        product = await db.products.find_one({"_id": ObjectId(sub['product_id'])})
        
        if product and 'demo_credentials' in product:
            # Update subscription with credentials
            result = await db.subscriptions.update_one(
                {"_id": sub['_id']},
                {"$set": {"credentials": product['demo_credentials']}}
            )
            
            if result.modified_count > 0:
                print(f"✓ Updated {sub['platform_name']} subscription")
                print(f"  Email: {product['demo_credentials']['email']}")
                print(f"  Password: {product['demo_credentials']['password']}\n")
            else:
                print(f"- {sub['platform_name']} already has credentials\n")
        else:
            print(f"✗ No demo credentials found for {sub['platform_name']}\n")
    
    client.close()
    print("Done!")

if __name__ == "__main__":
    asyncio.run(main())
