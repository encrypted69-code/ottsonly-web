"""
Wallet service with Razorpay integration
"""
from datetime import datetime
from motor.motor_asyncio import AsyncIOMotorDatabase
from bson import ObjectId
from fastapi import HTTPException, status
import razorpay
import hmac
import hashlib
from core.config import settings
from bots.telegram import telegram_service


class WalletService:
    """Wallet management service with Razorpay integration"""
    
    def __init__(self, db: AsyncIOMotorDatabase):
        self.db = db
        # Initialize Razorpay client
        self.razorpay_client = razorpay.Client(
            auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET)
        )
    
    async def create_razorpay_order(self, user_id: str, amount: float) -> dict:
        """
        Create Razorpay order for adding money to wallet
        """
        print(f"\n🔍 DEBUG: Creating Razorpay order")
        print(f"  User ID: {user_id}")
        print(f"  Amount: {amount}")
        print(f"  Razorpay client: {self.razorpay_client}")
        
        # Create Razorpay order
        # Receipt must be <= 40 chars, so use short timestamp
        receipt = f"wlt_{user_id[:8]}_{int(datetime.utcnow().timestamp())}"
        print(f"  Receipt: {receipt} (length: {len(receipt)})")
        
        order_data = {
            "amount": int(amount * 100),  # Convert to paise
            "currency": "INR",
            "receipt": receipt,  # Must be <= 40 characters
            "notes": {
                "user_id": user_id,
                "purpose": "wallet_recharge"
            }
        }
        
        print(f"  Order data: {order_data}")
        
        try:
            print("  📤 Calling Razorpay API...")
            razorpay_order = self.razorpay_client.order.create(data=order_data)
            print(f"  ✅ Razorpay order created: {razorpay_order['id']}")
        except Exception as e:
            print(f"  ❌ Razorpay API failed: {str(e)}")
            raise HTTPException(status_code=500, detail=f"Failed to create Razorpay order: {str(e)}")
        
        # Store pending wallet transaction
        wallet_txn = {
            "user_id": user_id,
            "type": "credit",
            "amount": amount,
            "status": "pending",
            "razorpay_order_id": razorpay_order["id"],
            "razorpay_payment_id": None,
            "created_at": datetime.utcnow().isoformat()
        }
        
        result = await self.db.wallet_pending_transactions.insert_one(wallet_txn)
        
        return {
            "order_id": razorpay_order["id"],
            "amount": amount,
            "currency": "INR",
            "razorpay_key": settings.RAZORPAY_KEY_ID
        }
    
    async def verify_and_credit_wallet(
        self, 
        user_id: str, 
        razorpay_order_id: str, 
        razorpay_payment_id: str, 
        razorpay_signature: str
    ) -> dict:
        """
        Verify Razorpay payment and credit wallet
        """
        # Verify signature
        generated_signature = hmac.new(
            settings.RAZORPAY_KEY_SECRET.encode(),
            f"{razorpay_order_id}|{razorpay_payment_id}".encode(),
            hashlib.sha256
        ).hexdigest()
        
        if generated_signature != razorpay_signature:
            raise HTTPException(status_code=400, detail="Invalid payment signature")
        
        # Atomically lock transaction by changing status from pending to processing
        # This prevents duplicate credits if multiple verify requests come simultaneously
        pending_txn = await self.db.wallet_pending_transactions.find_one_and_update(
            {
                "razorpay_order_id": razorpay_order_id,
                "user_id": user_id,
                "status": "pending"  # Only proceed if status is still pending
            },
            {
                "$set": {
                    "status": "processing",
                    "razorpay_payment_id": razorpay_payment_id,
                    "razorpay_signature": razorpay_signature,
                    "processing_started_at": datetime.utcnow().isoformat()
                }
            },
            return_document=False  # Return original document before update
        )
        
        if not pending_txn:
            # Transaction either doesn't exist, already processed, or belongs to different user
            raise HTTPException(
                status_code=400, 
                detail="Transaction already processed or not found"
            )
        
        # Credit wallet atomically to prevent race conditions
        amount = pending_txn["amount"]
        
        updated_user = await self.db.users.find_one_and_update(
            {"_id": ObjectId(user_id)},
            {"$inc": {"wallet_balance": amount}},
            return_document=True
        )
        
        if not updated_user:
            raise HTTPException(status_code=404, detail="User not found")
        
        new_balance = updated_user["wallet_balance"]
        
        # Create wallet transaction
        wallet_txn = {
            "user_id": user_id,
            "type": "credit",
            "amount": amount,
            "balance_after": new_balance,
            "reference_type": "razorpay",
            "reference_id": razorpay_payment_id,
            "description": f"Wallet recharge via Razorpay",
            "created_at": datetime.utcnow().isoformat()
        }
        
        txn_result = await self.db.wallet_transactions.insert_one(wallet_txn)
        
        # ✅ REFERRAL COMMISSION: Credit referrer if user was referred
        try:
            from app.referrals.service import ReferralService
            referral_service = ReferralService(self.db)
            await referral_service.credit_referral_commission(
                referred_user_id=user_id,
                topup_amount=amount,
                transaction_id=str(txn_result.inserted_id)
            )
        except Exception as e:
            # Log error but don't fail the wallet credit
            print(f"Referral commission error: {e}")
        
        # Mark transaction as completed (was already set to "processing" earlier)
        await self.db.wallet_pending_transactions.update_one(
            {"_id": pending_txn["_id"]},
            {
                "$set": {
                    "status": "completed",
                    "completed_at": datetime.utcnow().isoformat()
                }
            }
        )
        
        # Send Telegram notification
        try:
            await telegram_service.notify_wallet_recharge({
                "user_id": user_id,
                "amount": amount,
                "new_balance": new_balance,
                "payment_id": razorpay_payment_id,
                "created_at": datetime.utcnow().isoformat()
            })
        except Exception as e:
            print(f"Failed to send Telegram notification: {e}")
        
        return {
            "message": "Wallet credited successfully",
            "amount": amount,
            "new_balance": new_balance
        }
    
    async def get_wallet_transactions(self, user_id: str, skip: int = 0, limit: int = 100) -> list:
        """Get user's wallet transaction history"""
        cursor = self.db.wallet_transactions.find({"user_id": user_id}).sort("created_at", -1).skip(skip).limit(limit)
        transactions = await cursor.to_list(length=limit)
        
        for txn in transactions:
            txn["_id"] = str(txn["_id"])
        
        return transactions
    
    async def get_wallet_balance(self, user_id: str) -> float:
        """Get user's wallet balance"""
        user = await self.db.users.find_one({"_id": ObjectId(user_id)})
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        
        return user.get("wallet_balance", 0.0)
    
    async def admin_wallet_operation(
        self, 
        user_id: str, 
        amount: float, 
        operation: str, 
        description: str = None
    ) -> dict:
        """
        Admin manual wallet credit/debit
        """
        if operation not in ["credit", "debit"]:
            raise HTTPException(status_code=400, detail="Invalid operation. Must be 'credit' or 'debit'")
        
        # For debit, check balance first
        if operation == "debit":
            user = await self.db.users.find_one({"_id": ObjectId(user_id)}, {"wallet_balance": 1})
            if not user:
                raise HTTPException(status_code=404, detail="User not found")
            if user.get("wallet_balance", 0.0) < amount:
                raise HTTPException(status_code=400, detail="Insufficient balance")
        
        # Update wallet atomically to prevent race conditions
        amount_delta = amount if operation == "credit" else -amount
        
        updated_user = await self.db.users.find_one_and_update(
            {"_id": ObjectId(user_id)},
            {"$inc": {"wallet_balance": amount_delta}},
            return_document=True
        )
        
        if not updated_user:
            raise HTTPException(status_code=404, detail="User not found")
        
        new_balance = updated_user["wallet_balance"]
        
        # Create transaction
        wallet_txn = {
            "user_id": user_id,
            "type": operation,
            "amount": amount,
            "balance_after": new_balance,
            "reference_type": "admin",
            "reference_id": None,
            "description": description or f"Admin {operation}",
            "created_at": datetime.utcnow().isoformat()
        }
        
        await self.db.wallet_transactions.insert_one(wallet_txn)
        
        return {
            "message": f"Wallet {operation} successful",
            "user_id": user_id,
            "amount": amount,
            "operation": operation,
            "new_balance": new_balance
        }
