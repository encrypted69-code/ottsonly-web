"""
User service
"""
from datetime import datetime
from motor.motor_asyncio import AsyncIOMotorDatabase
from bson import ObjectId
from fastapi import HTTPException, status


class UserService:
    """User management service"""
    
    def __init__(self, db: AsyncIOMotorDatabase):
        self.db = db
    
    async def get_user_by_id(self, user_id: str) -> dict:
        """Get user by ID"""
        try:
            user = await self.db.users.find_one({"_id": ObjectId(user_id)})
        except:
            raise HTTPException(status_code=400, detail="Invalid user ID")
        
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        
        user["_id"] = str(user["_id"])
        return user
    
    async def update_user_profile(self, user_id: str, update_data: dict) -> dict:
        """Update user profile"""
        # Remove None values
        update_data = {k: v for k, v in update_data.items() if v is not None}
        
        if not update_data:
            raise HTTPException(status_code=400, detail="No data to update")
        
        update_data["updated_at"] = datetime.utcnow().isoformat()
        
        try:
            result = await self.db.users.update_one(
                {"_id": ObjectId(user_id)},
                {"$set": update_data}
            )
        except:
            raise HTTPException(status_code=400, detail="Invalid user ID")
        
        if result.matched_count == 0:
            raise HTTPException(status_code=404, detail="User not found")
        
        return await self.get_user_by_id(user_id)
    
    async def list_users(self, skip: int = 0, limit: int = 100) -> list:
        """List all users (admin only)"""
        cursor = self.db.users.find().skip(skip).limit(limit)
        users = await cursor.to_list(length=limit)
        
        for user in users:
            user["_id"] = str(user["_id"])
        
        return users
