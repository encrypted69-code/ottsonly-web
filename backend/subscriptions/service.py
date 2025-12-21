"""
Subscription service
"""
from datetime import datetime, timedelta
from motor.motor_asyncio import AsyncIOMotorDatabase
from bson import ObjectId
from fastapi import HTTPException, status


class SubscriptionService:
    """Subscription management service"""
    
    def __init__(self, db: AsyncIOMotorDatabase):
        self.db = db
    
    async def create_subscription(self, user_id: str, product_id: str, order_id: str, youtube_email: str = None) -> dict:
        """Create subscription after successful payment"""
        # Get product details
        product = await self.db.products.find_one({"_id": ObjectId(product_id)})
        if not product:
            raise HTTPException(status_code=404, detail="Product not found")
        
        # Calculate dates
        start_date = datetime.utcnow()
        end_date = start_date + timedelta(days=product["duration_days"])
        
        # Check if it's a YouTube subscription or Combo plan
        is_youtube = "youtube" in product["platform_name"].lower()
        is_combo = "combo" in product["platform_name"].lower()
        
        # Get credentials from IDP database (credentials collection)
        # Find an active credential matching the platform
        credentials = None
        platform_credential = None
        
        # Handle combo plan credentials
        if is_combo:
            # Fetch credentials for Netflix, Prime, and Pornhub
            platforms_needed = ["Netflix", "Prime", "Pornhub"]
            combo_credentials = {}
            combo_credential_ids = []
            
            for platform in platforms_needed:
                platform_variations = [platform]
                if platform == "Prime":
                    platform_variations.extend(["Amazon Prime", "Prime Video", "Amazon Prime Video"])
                
                cred = None
                for variation in platform_variations:
                    cred = await self.db.credentials.find_one({
                        "platform": {"$regex": f"^{variation}", "$options": "i"},
                        "is_active": True,
                        "used_by": {"$exists": False}
                    })
                    if cred:
                        break
                
                if not cred:
                    raise HTTPException(
                        status_code=400,
                        detail=f"{platform} is currently out of stock. Please try again later or contact support."
                    )
                
                # Store credentials
                combo_credentials[platform.lower()] = {
                    "email": cred["username"],
                    "password": cred["password"]
                }
                combo_credential_ids.append({"id": cred["_id"], "platform": platform})
                
                # Get user details for tracking
                user = await self.db.users.find_one({"_id": ObjectId(user_id)})
                
                # Mark credential as used
                await self.db.credentials.update_one(
                    {"_id": cred["_id"]},
                    {
                        "$set": {
                            "used_by": user_id,
                            "used_at": datetime.utcnow().isoformat(),
                            "subscription_id": None,  # Will update after subscription creation
                            "user_info": {
                                "name": user.get("name", "N/A"),
                                "email": user.get("email", "N/A"),
                                "phone": user.get("phone", "N/A")
                            } if user else None,
                            "updated_at": datetime.utcnow().isoformat()
                        }
                    }
                )
            
            credentials = combo_credentials
            
        # Only fetch credentials for non-YouTube and non-Combo platforms
        elif not is_youtube:
            # Try multiple platform name variations for better matching
            platform_variations = [
                product["platform_name"],  # Full name (e.g., "Amazon Prime Video")
                product["platform_name"].split()[0],  # First word (e.g., "Amazon")
            ]
            
            # Add common variations
            platform_lower = product["platform_name"].lower()
            if "prime" in platform_lower:
                platform_variations.extend(["Prime", "Amazon Prime", "Prime Video"])
            elif "netflix" in platform_lower:
                platform_variations.append("Netflix")
            elif "pornhub" in platform_lower:
                platform_variations.append("Pornhub")
            elif "hotstar" in platform_lower:
                platform_variations.extend(["Hotstar", "Disney+ Hotstar"])
            elif "zee" in platform_lower:
                platform_variations.append("ZEE5")
            
            # Try to find credentials with any variation
            for variation in platform_variations:
                platform_credential = await self.db.credentials.find_one({
                    "platform": {"$regex": f"^{variation}", "$options": "i"},
                    "is_active": True,
                    "used_by": {"$exists": False}  # Get unused credentials
                })
                if platform_credential:
                    credentials = {
                        "email": platform_credential["username"],
                        "password": platform_credential["password"]
                    }
                    
                    # Get user details for tracking
                    user = await self.db.users.find_one({"_id": ObjectId(user_id)})
                    
                    # Mark credential as used
                    await self.db.credentials.update_one(
                        {"_id": platform_credential["_id"]},
                        {
                            "$set": {
                                "used_by": user_id,
                                "used_at": datetime.utcnow().isoformat(),
                                "subscription_id": None,  # Will update after subscription creation
                                "user_info": {
                                    "name": user.get("name", "N/A"),
                                    "email": user.get("email", "N/A"),
                                    "phone": user.get("phone", "N/A")
                                } if user else None,
                                "updated_at": datetime.utcnow().isoformat()
                            }
                        }
                    )
                    break
            
            # Check if credentials were found (only for non-YouTube platforms)
            if not credentials:
                raise HTTPException(
                    status_code=400, 
                    detail=f"{product['platform_name']} is currently out of stock. Please try again later or contact support."
                )
        
        subscription = {
            "user_id": user_id,
            "product_id": product_id,
            "order_id": order_id,
            "platform_name": product["platform_name"],
            "plan_name": product["plan_name"],
            "status": "active",
            "start_date": start_date.isoformat(),
            "end_date": end_date.isoformat(),
            "credentials": credentials,
            "is_combo": is_combo,
            "created_at": datetime.utcnow().isoformat(),
            "updated_at": datetime.utcnow().isoformat()
        }
        
        # Add YouTube-specific fields for YouTube subscription or Combo plan
        if is_youtube or is_combo:
            subscription["youtube_email"] = youtube_email
            subscription["youtube_email_edit_count"] = 0
            subscription["youtube_email_max_edits"] = 1
        
        result = await self.db.subscriptions.insert_one(subscription)
        subscription["_id"] = str(result.inserted_id)
        
        # Update credential with subscription_id if credentials were assigned
        if is_combo and combo_credential_ids:
            # Update all combo credentials with subscription_id
            for cred_info in combo_credential_ids:
                await self.db.credentials.update_one(
                    {"_id": cred_info["id"]},
                    {
                        "$set": {
                            "subscription_id": str(result.inserted_id)
                        }
                    }
                )
        elif credentials and platform_credential:
            await self.db.credentials.update_one(
                {"_id": platform_credential["_id"]},
                {
                    "$set": {
                        "subscription_id": str(result.inserted_id)
                    }
                }
            )
        
        return subscription
    
    async def get_subscription_by_id(self, subscription_id: str) -> dict:
        """Get subscription by ID"""
        try:
            subscription = await self.db.subscriptions.find_one({"_id": ObjectId(subscription_id)})
        except:
            raise HTTPException(status_code=400, detail="Invalid subscription ID")
        
        if not subscription:
            raise HTTPException(status_code=404, detail="Subscription not found")
        
        subscription["_id"] = str(subscription["_id"])
        return subscription
    
    async def list_user_subscriptions(self, user_id: str, skip: int = 0, limit: int = 100) -> list:
        """List user's subscriptions"""
        cursor = self.db.subscriptions.find({"user_id": user_id}).sort("created_at", -1).skip(skip).limit(limit)
        subscriptions = await cursor.to_list(length=limit)
        
        for sub in subscriptions:
            sub["_id"] = str(sub["_id"])
        
        return subscriptions
    
    async def list_all_subscriptions(self, skip: int = 0, limit: int = 100, status: str = None) -> list:
        """List all subscriptions (admin)"""
        query = {}
        if status:
            query["status"] = status
        
        cursor = self.db.subscriptions.find(query).sort("created_at", -1).skip(skip).limit(limit)
        subscriptions = await cursor.to_list(length=limit)
        
        for sub in subscriptions:
            sub["_id"] = str(sub["_id"])
        
        return subscriptions
    
    async def assign_credentials(self, subscription_id: str, credentials: dict) -> dict:
        """Assign OTT credentials to subscription (admin only)"""
        # Remove None values
        credentials = {k: v for k, v in credentials.items() if v is not None}
        
        if not credentials:
            raise HTTPException(status_code=400, detail="No credentials to assign")
        
        try:
            result = await self.db.subscriptions.update_one(
                {"_id": ObjectId(subscription_id)},
                {
                    "$set": {
                        "credentials": credentials,
                        "updated_at": datetime.utcnow().isoformat()
                    }
                }
            )
        except:
            raise HTTPException(status_code=400, detail="Invalid subscription ID")
        
        if result.matched_count == 0:
            raise HTTPException(status_code=404, detail="Subscription not found")
        
        return await self.get_subscription_by_id(subscription_id)
    
    async def update_youtube_email(self, subscription_id: str, new_email: str, create_request: bool = True) -> dict:
        """Update YouTube email for subscription (limited edits)"""
        # Get current subscription
        subscription = await self.get_subscription_by_id(subscription_id)
        
        # Check if it's a YouTube subscription or Combo plan
        platform_lower = subscription["platform_name"].lower()
        if "youtube" not in platform_lower and "combo" not in platform_lower:
            raise HTTPException(status_code=400, detail="This is not a YouTube or Combo subscription")
        
        # Check edit count
        current_edit_count = subscription.get("youtube_email_edit_count", 0)
        max_edits = subscription.get("youtube_email_max_edits", 1)
        
        if current_edit_count >= max_edits:
            raise HTTPException(status_code=400, detail=f"Maximum edit limit ({max_edits}) reached")
        
        # Validate email
        if not new_email or not new_email.endswith("@gmail.com"):
            raise HTTPException(status_code=400, detail="Please provide a valid Gmail address")
        
        # Update email and increment edit count
        try:
            result = await self.db.subscriptions.update_one(
                {"_id": ObjectId(subscription_id)},
                {
                    "$set": {
                        "youtube_email": new_email,
                        "youtube_email_edit_count": current_edit_count + 1,
                        "updated_at": datetime.utcnow().isoformat()
                    }
                }
            )
        except:
            raise HTTPException(status_code=400, detail="Invalid subscription ID")
        
        if result.matched_count == 0:
            raise HTTPException(status_code=404, detail="Subscription not found")
        
        # Create YouTube request for admin if it's the first submission
        if create_request and current_edit_count == 0:
            from app.youtube.service import YouTubeRequestService
            youtube_service = YouTubeRequestService(self.db)
            try:
                await youtube_service.create_request(
                    subscription["user_id"],
                    subscription_id,
                    new_email
                )
            except Exception as e:
                # Log error but don't fail the update
                print(f"Error creating YouTube request: {e}")
        
        return await self.get_subscription_by_id(subscription_id)
    
    async def cancel_subscription(self, subscription_id: str) -> dict:
        """Cancel subscription"""
        try:
            result = await self.db.subscriptions.update_one(
                {"_id": ObjectId(subscription_id)},
                {
                    "$set": {
                        "status": "cancelled",
                        "updated_at": datetime.utcnow().isoformat()
                    }
                }
            )
        except:
            raise HTTPException(status_code=400, detail="Invalid subscription ID")
        
        if result.matched_count == 0:
            raise HTTPException(status_code=404, detail="Subscription not found")
        
        return await self.get_subscription_by_id(subscription_id)
    
    async def check_and_expire_subscriptions(self):
        """Background task to expire subscriptions"""
        now = datetime.utcnow().isoformat()
        
        result = await self.db.subscriptions.update_many(
            {
                "status": "active",
                "end_date": {"$lt": now}
            },
            {
                "$set": {
                    "status": "expired",
                    "updated_at": now
                }
            }
        )
        
        return result.modified_count
