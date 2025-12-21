"""
Product service
"""
from datetime import datetime
from motor.motor_asyncio import AsyncIOMotorDatabase
from bson import ObjectId
from fastapi import HTTPException, status


class ProductService:
    """Product management service"""
    
    def __init__(self, db: AsyncIOMotorDatabase):
        self.db = db
    
    async def create_product(self, product_data: dict) -> dict:
        """Create new product"""
        product = {
            **product_data,
            "created_at": datetime.utcnow().isoformat(),
            "updated_at": datetime.utcnow().isoformat()
        }
        
        result = await self.db.products.insert_one(product)
        product["_id"] = str(result.inserted_id)
        return product
    
    async def get_product_by_id(self, product_id: str) -> dict:
        """Get product by ID"""
        try:
            product = await self.db.products.find_one({"_id": ObjectId(product_id)})
        except:
            raise HTTPException(status_code=400, detail="Invalid product ID")
        
        if not product:
            raise HTTPException(status_code=404, detail="Product not found")
        
        product["_id"] = str(product["_id"])
        return product
    
    async def list_products(self, skip: int = 0, limit: int = 100, active_only: bool = False) -> list:
        """List products with optional filtering"""
        query = {}
        if active_only:
            query["is_active"] = True
        
        cursor = self.db.products.find(query).skip(skip).limit(limit)
        products = await cursor.to_list(length=limit)
        
        for product in products:
            product["_id"] = str(product["_id"])
        
        return products
    
    async def update_product(self, product_id: str, update_data: dict) -> dict:
        """Update product"""
        # Remove None values
        update_data = {k: v for k, v in update_data.items() if v is not None}
        
        if not update_data:
            raise HTTPException(status_code=400, detail="No data to update")
        
        update_data["updated_at"] = datetime.utcnow().isoformat()
        
        try:
            result = await self.db.products.update_one(
                {"_id": ObjectId(product_id)},
                {"$set": update_data}
            )
        except:
            raise HTTPException(status_code=400, detail="Invalid product ID")
        
        if result.matched_count == 0:
            raise HTTPException(status_code=404, detail="Product not found")
        
        return await self.get_product_by_id(product_id)
    
    async def delete_product(self, product_id: str) -> bool:
        """Delete product"""
        try:
            result = await self.db.products.delete_one({"_id": ObjectId(product_id)})
        except:
            raise HTTPException(status_code=400, detail="Invalid product ID")
        
        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Product not found")
        
        return True
    
    async def decrease_stock(self, product_id: str, quantity: int = 1) -> bool:
        """Decrease product stock (for order processing)"""
        try:
            result = await self.db.products.update_one(
                {"_id": ObjectId(product_id), "stock": {"$gte": quantity}},
                {"$inc": {"stock": -quantity}}
            )
        except:
            raise HTTPException(status_code=400, detail="Invalid product ID")
        
        if result.modified_count == 0:
            raise HTTPException(status_code=400, detail="Insufficient stock")
        
        return True
