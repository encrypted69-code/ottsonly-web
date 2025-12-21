"""
Bulk import credentials from CSV/text format
Usage: python bulk_import_credentials.py credentials.txt

Format (one per line):
Platform|Username|Password|Notes
Netflix|user1@example.com|pass123|Premium account
Prime|user2@example.com|pass456|Family plan
"""
import asyncio
import sys
from motor.motor_asyncio import AsyncIOMotorClient
from core.config import settings
from datetime import datetime


async def bulk_import_credentials(file_path: str):
    """Import credentials from file"""
    client = AsyncIOMotorClient(settings.MONGODB_URL)
    db = client[settings.MONGODB_DB_NAME]
    
    print(f"📁 Reading credentials from {file_path}...")
    
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            lines = f.readlines()
    except FileNotFoundError:
        print(f"❌ File not found: {file_path}")
        return
    
    credentials_to_insert = []
    skipped = 0
    
    for i, line in enumerate(lines, 1):
        line = line.strip()
        
        # Skip empty lines and comments
        if not line or line.startswith('#'):
            continue
        
        # Parse line
        parts = line.split('|')
        if len(parts) < 3:
            print(f"⚠️  Line {i}: Invalid format (need at least Platform|Username|Password)")
            skipped += 1
            continue
        
        platform = parts[0].strip()
        username = parts[1].strip()
        password = parts[2].strip()
        notes = parts[3].strip() if len(parts) > 3 else None
        
        credential = {
            "platform": platform,
            "username": username,
            "password": password,
            "notes": notes,
            "is_active": True,
            "created_at": datetime.utcnow().isoformat(),
            "updated_at": datetime.utcnow().isoformat()
        }
        
        credentials_to_insert.append(credential)
    
    if credentials_to_insert:
        print(f"\n📤 Importing {len(credentials_to_insert)} credentials...")
        result = await db.credentials.insert_many(credentials_to_insert)
        print(f"✅ Successfully imported {len(result.inserted_ids)} credentials")
    
    if skipped:
        print(f"⚠️  Skipped {skipped} invalid lines")
    
    client.close()


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python bulk_import_credentials.py <file_path>")
        print("\nFile format (one per line):")
        print("Platform|Username|Password|Notes")
        print("\nExample:")
        print("Netflix|user1@example.com|pass123|Premium account")
        print("Prime|user2@example.com|pass456|Family plan")
        print("Pornhub|user3@example.com|pass789|Premium")
        sys.exit(1)
    
    file_path = sys.argv[1]
    asyncio.run(bulk_import_credentials(file_path))
