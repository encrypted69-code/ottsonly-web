"""
Credentials service
"""
from datetime import datetime
from motor.motor_asyncio import AsyncIOMotorDatabase
from bson import ObjectId
from fastapi import HTTPException


class CredentialService:
    """Credential management service"""
    
    def __init__(self, db: AsyncIOMotorDatabase):
        self.db = db
    
    async def create_credential(self, platform: str, username: str, password: str, notes: str = None) -> dict:
        """Create new credential"""
        credential = {
            "platform": platform,
            "username": username,
            "password": password,
            "notes": notes,
            "is_active": True,
            "created_at": datetime.utcnow().isoformat(),
            "updated_at": datetime.utcnow().isoformat()
        }
        
        result = await self.db.credentials.insert_one(credential)
        credential["_id"] = str(result.inserted_id)
        
        return credential
    
    async def get_credential_by_id(self, credential_id: str) -> dict:
        """Get credential by ID"""
        try:
            credential = await self.db.credentials.find_one({"_id": ObjectId(credential_id)})
        except:
            raise HTTPException(status_code=400, detail="Invalid credential ID")
        
        if not credential:
            raise HTTPException(status_code=404, detail="Credential not found")
        
        credential["_id"] = str(credential["_id"])
        return credential
    
    async def list_credentials(self, skip: int = 0, limit: int = 100, platform: str = None, is_active: bool = None) -> list:
        """List all credentials with optional filters"""
        query = {}
        if platform:
            query["platform"] = {"$regex": platform, "$options": "i"}
        if is_active is not None:
            query["is_active"] = is_active
        
        cursor = self.db.credentials.find(query).sort("created_at", -1).skip(skip).limit(limit)
        credentials = await cursor.to_list(length=limit)
        
        for cred in credentials:
            cred["_id"] = str(cred["_id"])
        
        return credentials
    
    async def update_credential(self, credential_id: str, update_data: dict) -> dict:
        """Update credential"""
        if not update_data:
            raise HTTPException(status_code=400, detail="No update data provided")
        
        update_data["updated_at"] = datetime.utcnow().isoformat()
        
        try:
            result = await self.db.credentials.update_one(
                {"_id": ObjectId(credential_id)},
                {"$set": update_data}
            )
        except:
            raise HTTPException(status_code=400, detail="Invalid credential ID")
        
        if result.matched_count == 0:
            raise HTTPException(status_code=404, detail="Credential not found")
        
        return await self.get_credential_by_id(credential_id)
    
    async def delete_credential(self, credential_id: str) -> dict:
        """Delete credential"""
        try:
            result = await self.db.credentials.delete_one({"_id": ObjectId(credential_id)})
        except:
            raise HTTPException(status_code=400, detail="Invalid credential ID")
        
        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Credential not found")
        
        return {"message": "Credential deleted successfully"}
