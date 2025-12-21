import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
from core.security import get_password_hash
from datetime import datetime
from core.config import settings

async def main():
    client = AsyncIOMotorClient(settings.MONGODB_URL)
    db = client[settings.DATABASE_NAME]
    
    # Create or get user 1
    u1 = await db.users.find_one({'email': 'test@ottsonly.com'})
    if not u1:
        await db.users.insert_one({
            'name': 'Test User 1',
            'email': 'test@ottsonly.com',
            'phone': '9876543210',
            'password': get_password_hash('password123'),
            'role': 'user',
            'wallet_balance': 1000.0,
            'is_active': True,
            'created_at': datetime.utcnow().isoformat()
        })
        u1 = await db.users.find_one({'email': 'test@ottsonly.com'})
    
    # Create or get user 2
    u2 = await db.users.find_one({'email': 'user2@ottsonly.com'})
    if not u2:
        await db.users.insert_one({
            'name': 'Test User 2',
            'email': 'user2@ottsonly.com',
            'phone': '9876543211',
            'password': get_password_hash('test123'),
            'role': 'user',
            'wallet_balance': 5000.0,
            'is_active': True,
            'created_at': datetime.utcnow().isoformat()
        })
        u2 = await db.users.find_one({'email': 'user2@ottsonly.com'})
    
    print('='*60)
    print('TEST USER CREDENTIALS')
    print('='*60)
    print()
    print('USER 1:')
    print('  Email:    test@ottsonly.com')
    print('  Password: password123')
    print(f'  Balance:  Rs.{u1.get("wallet_balance", 0)}')
    print()
    print('USER 2:')
    print('  Email:    user2@ottsonly.com')
    print('  Password: test123')
    print(f'  Balance:  Rs.{u2.get("wallet_balance", 0)}')
    print()
    print('='*60)
    print('Login URL: http://localhost:4028/login')
    print('='*60)
    
    client.close()

asyncio.run(main())
