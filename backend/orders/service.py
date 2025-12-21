"""
Order service
"""
from datetime import datetime
from motor.motor_asyncio import AsyncIOMotorDatabase
from bson import ObjectId
from fastapi import HTTPException, status
from products.service import ProductService
from subscriptions.service import SubscriptionService
from bots.telegram import telegram_service


class OrderService:
    """Order management service"""
    
    def __init__(self, db: AsyncIOMotorDatabase):
        self.db = db
        self.product_service = ProductService(db)
    
    async def create_order(self, user_id: str, product_id: str) -> dict:
        """
        Create order and process payment from wallet
        """
        # Get product details
        product = await self.product_service.get_product_by_id(product_id)
        
        # Check if product is active
        if not product.get("is_active", False):
            raise HTTPException(status_code=400, detail="Product is not available")
        
        # Check user exists before creating order
        user = await self.db.users.find_one({"_id": ObjectId(user_id)}, {"wallet_balance": 1})
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        
        # Check wallet balance (non-atomic check for early validation)
        wallet_balance = user.get("wallet_balance", 0.0)
        if wallet_balance < product["price"]:
            raise HTTPException(
                status_code=400, 
                detail=f"Insufficient wallet balance. Required: ₹{product['price']}, Available: ₹{wallet_balance}"
            )
        
        # Create order
        order = {
            "user_id": user_id,
            "product_id": product_id,
            "product_name": f"{product['platform_name']} - {product['plan_name']}",
            "amount": product["price"],
            "status": "pending",
            "created_at": datetime.utcnow().isoformat(),
            "updated_at": datetime.utcnow().isoformat()
        }
        
        result = await self.db.orders.insert_one(order)
        order_id = str(result.inserted_id)
        
        # Atomically decrease stock FIRST to prevent overselling under concurrent requests
        try:
            await self.product_service.decrease_stock(product_id)
        except HTTPException:
            # Stock unavailable - rollback order and re-raise
            await self.db.orders.delete_one({"_id": ObjectId(order_id)})
            raise HTTPException(status_code=400, detail="Product out of stock")
        
        # Create subscription after stock is reserved
        subscription_service = SubscriptionService(self.db)
        try:
            subscription = await subscription_service.create_subscription(user_id, product_id, order_id)
        except HTTPException as e:
            # If subscription creation fails, rollback order and stock
            await self.db.orders.delete_one({"_id": ObjectId(order_id)})
            # Restore stock since we decremented it earlier
            await self.db.products.update_one(
                {"_id": ObjectId(product_id)},
                {"$inc": {"stock": 1}}
            )
            raise e
        
        # Atomically deduct wallet balance with balance check to prevent race conditions
        updated_user = await self.db.users.find_one_and_update(
            {
                "_id": ObjectId(user_id),
                "wallet_balance": {"$gte": product["price"]}  # Atomic balance check
            },
            {
                "$inc": {"wallet_balance": -product["price"]},
                "$set": {"updated_at": datetime.utcnow().isoformat()}
            },
            return_document=True
        )
        
        if not updated_user:
            # Balance check failed or user not found (rollback subscription, order, and stock)
            await self.db.subscriptions.delete_one({"_id": ObjectId(subscription["_id"])})
            await self.db.orders.delete_one({"_id": ObjectId(order_id)})
            # Restore stock since we decremented it earlier
            await self.db.products.update_one(
                {"_id": ObjectId(product_id)},
                {"$inc": {"stock": 1}}
            )
            raise HTTPException(
                status_code=400,
                detail=f"Insufficient wallet balance. Please add money to your wallet."
            )
        
        new_balance = updated_user["wallet_balance"]
        
        # Add wallet transaction (debit)
        wallet_txn = {
            "user_id": user_id,
            "type": "debit",
            "amount": product["price"],
            "balance_after": new_balance,
            "reference_type": "order",
            "reference_id": order_id,
            "description": f"Payment for {order['product_name']}",
            "created_at": datetime.utcnow().isoformat()
        }
        await self.db.wallet_transactions.insert_one(wallet_txn)
        
        # Update order status to paid
        await self.db.orders.update_one(
            {"_id": ObjectId(order_id)},
            {
                "$set": {
                    "status": "paid",
                    "paid_at": datetime.utcnow().isoformat(),
                    "updated_at": datetime.utcnow().isoformat()
                }
            }
        )
        
        # Update order to completed and store subscription_id
        await self.db.orders.update_one(
            {"_id": ObjectId(order_id)},
            {"$set": {
                "status": "completed",
                "subscription_id": subscription["_id"],
                "updated_at": datetime.utcnow().isoformat()
            }}
        )
        
        # Fetch updated order
        order = await self.db.orders.find_one({"_id": ObjectId(order_id)})
        order["_id"] = order_id
        
        # Send Telegram notifications to admin
        try:
            # Notify new order
            await telegram_service.notify_new_order({
                "order_id": order_id,
                "user_id": user_id,
                "product_name": order["product_name"],
                "amount": order["amount"],
                "status": order["status"],
                "created_at": order["created_at"]
            })
            
            # Notify payment success
            await telegram_service.notify_payment_success({
                "order_id": order_id,
                "user_id": user_id,
                "amount": order["amount"],
                "payment_id": order_id,
                "paid_at": order.get("paid_at")
            })
            
            # Notify subscription activation
            await telegram_service.notify_subscription_activated({
                "subscription_id": subscription["_id"],
                "user_id": user_id,
                "platform_name": product["platform_name"],
                "plan_name": product["plan_name"],
                "duration_days": product["duration_days"],
                "end_date": subscription["end_date"]
            })
        except Exception as e:
            print(f"Failed to send Telegram notification: {e}")
        
        return order
    
    async def get_order_by_id(self, order_id: str) -> dict:
        """Get order by ID"""
        try:
            order = await self.db.orders.find_one({"_id": ObjectId(order_id)})
        except:
            raise HTTPException(status_code=400, detail="Invalid order ID")
        
        if not order:
            raise HTTPException(status_code=404, detail="Order not found")
        
        order["_id"] = str(order["_id"])
        return order
    
    async def list_user_orders(self, user_id: str, skip: int = 0, limit: int = 100) -> list:
        """List user's orders"""
        cursor = self.db.orders.find({"user_id": user_id}).sort("created_at", -1).skip(skip).limit(limit)
        orders = await cursor.to_list(length=limit)
        
        for order in orders:
            order["_id"] = str(order["_id"])
        
        return orders
    
    async def list_all_orders(self, skip: int = 0, limit: int = 100) -> list:
        """List all orders (admin)"""
        cursor = self.db.orders.find().sort("created_at", -1).skip(skip).limit(limit)
        orders = await cursor.to_list(length=limit)
        
        for order in orders:
            order["_id"] = str(order["_id"])
        
        return orders
    
    async def refund_order(self, order_id: str, reason: str = None) -> dict:
        """Process order refund"""
        order = await self.get_order_by_id(order_id)
        
        # Check if order can be refunded
        if order["status"] != "completed":
            raise HTTPException(status_code=400, detail="Only completed orders can be refunded")
        
        # Atomically refund amount to wallet to prevent race conditions
        updated_user = await self.db.users.find_one_and_update(
            {"_id": ObjectId(order["user_id"])},
            {
                "$inc": {"wallet_balance": order["amount"]},
                "$set": {"updated_at": datetime.utcnow().isoformat()}
            },
            return_document=True
        )
        
        if not updated_user:
            raise HTTPException(status_code=404, detail="User not found")
        
        new_balance = updated_user["wallet_balance"]
        
        # Add wallet transaction (credit)
        wallet_txn = {
            "user_id": order["user_id"],
            "type": "credit",
            "amount": order["amount"],
            "balance_after": new_balance,
            "reference_type": "refund",
            "reference_id": order_id,
            "description": f"Refund for {order['product_name']}" + (f" - {reason}" if reason else ""),
            "created_at": datetime.utcnow().isoformat()
        }
        await self.db.wallet_transactions.insert_one(wallet_txn)
        
        # Update order status
        await self.db.orders.update_one(
            {"_id": ObjectId(order_id)},
            {
                "$set": {
                    "status": "refunded",
                    "refund_reason": reason,
                    "refunded_at": datetime.utcnow().isoformat(),
                    "updated_at": datetime.utcnow().isoformat()
                }
            }
        )
        
        # Cancel associated subscription
        await self.db.subscriptions.update_many(
            {"order_id": order_id},
            {"$set": {"status": "cancelled", "updated_at": datetime.utcnow().isoformat()}}
        )
        
        # Restore stock
        try:
            await self.db.products.update_one(
                {"_id": ObjectId(order["product_id"])},
                {"$inc": {"stock": 1}}
            )
        except:
            pass  # Product might be deleted
        
        # Send Telegram notification
        try:
            await telegram_service.notify_refund_issued({
                "order_id": order_id,
                "user_id": order["user_id"],
                "amount": order["amount"],
                "reason": reason,
                "refunded_at": datetime.utcnow().isoformat()
            })
        except Exception as e:
            print(f"Failed to send Telegram notification: {e}")
        
        return await self.get_order_by_id(order_id)
