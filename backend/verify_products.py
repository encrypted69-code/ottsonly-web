"""Verify products in database"""
from motor.motor_asyncio import AsyncIOMotorClient
import asyncio

async def main():
    client = AsyncIOMotorClient('mongodb://localhost:27017')
    db = client.ottsonly
    
    products = await db.products.find({}).to_list(length=10)
    
    print("\n=== Products in Database ===")
    for p in products:
        print(f"\nPlatform: {p['platform_name']}")
        print(f"ID: {p['_id']}")
        print(f"Price: ₹{p['price']}")
        if 'demo_credentials' in p:
            print(f"Demo: {p['demo_credentials']['email']} / {p['demo_credentials']['password']}")
    
    client.close()

if __name__ == "__main__":
    asyncio.run(main())
