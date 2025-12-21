"""
Referral service - Core business logic
"""
import secrets
import string
from datetime import datetime
from motor.motor_asyncio import AsyncIOMotorDatabase
from bson import ObjectId
from fastapi import HTTPException, status


class ReferralService:
    """Referral management service"""
    
    # Configuration
    COMMISSION_RATE = 0.10  # 10%
    MIN_WITHDRAWAL_AMOUNT = 100.0  # Minimum ₹100
    
    def __init__(self, db: AsyncIOMotorDatabase):
        self.db = db
    
    def generate_referral_code(self, user_id: str) -> str:
        """Generate unique referral code for user"""
        # Generate 8-character alphanumeric code
        characters = string.ascii_uppercase + string.digits
        code = ''.join(secrets.choice(characters) for _ in range(8))
        return f"REF{code}"
    
    async def create_referral_code(self, user_id: str) -> str:
        """Create and store referral code for user"""
        # Check if user already has a referral code
        user = await self.db.users.find_one({"_id": ObjectId(user_id)})
        if user and user.get("referral_code"):
            return user["referral_code"]
        
        # Generate unique code
        max_attempts = 10
        for _ in range(max_attempts):
            code = self.generate_referral_code(user_id)
            # Check if code already exists
            existing = await self.db.users.find_one({"referral_code": code})
            if not existing:
                # Update user with referral code
                await self.db.users.update_one(
                    {"_id": ObjectId(user_id)},
                    {"$set": {"referral_code": code}}
                )
                return code
        
        raise HTTPException(
            status_code=500,
            detail="Failed to generate unique referral code"
        )
    
    async def apply_referral_code(self, user_id: str, referral_code: str) -> dict:
        """Apply referral code during signup"""
        # Get referring user
        referrer = await self.db.users.find_one({"referral_code": referral_code.upper()})
        if not referrer:
            raise HTTPException(
                status_code=404,
                detail="Invalid referral code"
            )
        
        referrer_id = str(referrer["_id"])
        
        # Prevent self-referral
        if referrer_id == user_id:
            raise HTTPException(
                status_code=400,
                detail="Cannot use your own referral code"
            )
        
        # Check if user already has a referrer
        current_user = await self.db.users.find_one({"_id": ObjectId(user_id)})
        if current_user.get("referred_by"):
            raise HTTPException(
                status_code=400,
                detail="You have already used a referral code"
            )
        
        # Update user with referrer
        await self.db.users.update_one(
            {"_id": ObjectId(user_id)},
            {
                "$set": {
                    "referred_by": referrer_id,
                    "referral_applied_at": datetime.utcnow().isoformat()
                }
            }
        )
        
        return {
            "message": "Referral code applied successfully",
            "referrer_name": referrer.get("name", "User"),
            "referrer_code": referral_code
        }
    
    async def credit_referral_commission(
        self,
        referred_user_id: str,
        topup_amount: float,
        transaction_id: str
    ) -> dict:
        """
        Credit commission to referrer when referred user adds money
        CRITICAL: Only called for genuine wallet top-ups, NOT admin credits
        """
        # Get referred user
        referred_user = await self.db.users.find_one({"_id": ObjectId(referred_user_id)})
        if not referred_user or not referred_user.get("referred_by"):
            return {"message": "No referrer found", "commission_credited": False}
        
        referrer_id = referred_user["referred_by"]
        
        # Calculate commission (10%)
        commission_amount = topup_amount * self.COMMISSION_RATE
        
        # Get referrer's current balance
        referrer = await self.db.users.find_one({"_id": ObjectId(referrer_id)})
        if not referrer:
            return {"message": "Referrer not found", "commission_credited": False}
        
        # Get current balances from referrer user document
        current_wallet_balance = referrer.get("wallet_balance", 0.0)
        current_withdrawable_balance = referrer.get("withdrawable_balance", 0.0)
        
        # Calculate new balances after commission
        new_wallet_balance = current_wallet_balance + commission_amount
        new_withdrawable_balance = current_withdrawable_balance + commission_amount
        
        # Atomic update to prevent race conditions
        result = await self.db.users.update_one(
            {"_id": ObjectId(referrer_id)},
            {
                "$set": {
                    "wallet_balance": new_wallet_balance,
                    "withdrawable_balance": new_withdrawable_balance,
                    "updated_at": datetime.utcnow().isoformat()
                }
            }
        )
        
        if result.modified_count == 0:
            raise HTTPException(
                status_code=500,
                detail="Failed to credit referral commission"
            )
        
        # Log commission in referral_commissions collection for audit trail
        commission_record = {
            "referrer_id": referrer_id,
            "referred_user_id": referred_user_id,
            "referred_user_name": referred_user.get("name", "Unknown"),
            "referred_user_email": referred_user.get("email", ""),
            "topup_amount": topup_amount,
            "commission_amount": commission_amount,
            "commission_rate": self.COMMISSION_RATE,
            "transaction_id": transaction_id,
            "balance_before": current_withdrawable_balance,
            "balance_after": new_withdrawable_balance,
            "created_at": datetime.utcnow().isoformat()
        }
        
        await self.db.referral_commissions.insert_one(commission_record)
        
        return {
            "message": "Commission credited successfully",
            "commission_credited": True,
            "commission_amount": commission_amount,
            "referrer_id": referrer_id
        }
    
    async def get_referral_dashboard(self, user_id: str) -> dict:
        """Get user's referral dashboard data"""
        # Get user
        user = await self.db.users.find_one({"_id": ObjectId(user_id)})
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        
        referral_code = user.get("referral_code")
        if not referral_code:
            # Generate code if not exists
            referral_code = await self.create_referral_code(user_id)
        
        # Get all referrals
        referrals_cursor = self.db.users.find({"referred_by": user_id})
        referrals = await referrals_cursor.to_list(length=1000)
        
        # Get commission history
        commissions_cursor = self.db.referral_commissions.find({"referrer_id": user_id})
        commissions = await commissions_cursor.to_list(length=1000)
        
        # Calculate stats
        total_referrals = len(referrals)
        total_earnings = sum(c["commission_amount"] for c in commissions)
        withdrawable_balance = user.get("withdrawable_balance", 0.0)
        
        # Get active referrals (those who added money at least once)
        active_referral_ids = set(c["referred_user_id"] for c in commissions)
        active_referrals = len(active_referral_ids)
        
        # Build referral list with stats
        referral_list = []
        for referral in referrals:
            referral_id = str(referral["_id"])
            
            # Get commissions from this referral
            referral_commissions = [c for c in commissions if c["referred_user_id"] == referral_id]
            total_commission_from_referral = sum(c["commission_amount"] for c in referral_commissions)
            total_added_by_referral = sum(c["topup_amount"] for c in referral_commissions)
            
            referral_list.append({
                "user_id": referral_id,
                "name": referral.get("name", "Unknown"),
                "email": referral.get("email", ""),
                "phone": referral.get("phone", ""),
                "joined_at": referral.get("referral_applied_at", referral.get("created_at")),
                "total_amount_added": total_added_by_referral,
                "total_commission_earned": total_commission_from_referral,
                "is_active": referral_id in active_referral_ids
            })
        
        # Sort by commission earned (highest first)
        referral_list.sort(key=lambda x: x["total_commission_earned"], reverse=True)
        
        return {
            "referral_code": referral_code,
            "total_referrals": total_referrals,
            "active_referrals": active_referrals,
            "total_earnings": total_earnings,
            "withdrawable_balance": withdrawable_balance,
            "commission_rate": self.COMMISSION_RATE * 100,  # 10%
            "min_withdrawal_amount": self.MIN_WITHDRAWAL_AMOUNT,
            "referrals": referral_list,
            "recent_commissions": [
                {
                    "id": str(c["_id"]),
                    "referred_user_name": c["referred_user_name"],
                    "topup_amount": c["topup_amount"],
                    "commission_amount": c["commission_amount"],
                    "created_at": c["created_at"]
                }
                for c in sorted(commissions, key=lambda x: x["created_at"], reverse=True)[:10]
            ]
        }
    
    async def request_withdrawal(
        self,
        user_id: str,
        amount: float,
        upi_id: str
    ) -> dict:
        """Request withdrawal of referral earnings"""
        # Validate amount
        if amount < self.MIN_WITHDRAWAL_AMOUNT:
            raise HTTPException(
                status_code=400,
                detail=f"Minimum withdrawal amount is ₹{self.MIN_WITHDRAWAL_AMOUNT}"
            )
        
        # Get user
        user = await self.db.users.find_one({"_id": ObjectId(user_id)})
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        
        # Check withdrawable balance (commission earnings only)
        referral_balance = user.get("withdrawable_balance", 0.0)
        if referral_balance < amount:
            raise HTTPException(
                status_code=400,
                detail=f"Insufficient withdrawable balance. Available: ₹{referral_balance}"
            )
        
        # Check for pending withdrawal requests
        pending_request = await self.db.withdrawal_requests.find_one({
            "user_id": user_id,
            "status": "pending"
        })
        if pending_request:
            raise HTTPException(
                status_code=400,
                detail="You already have a pending withdrawal request"
            )
        
        # Create withdrawal request
        withdrawal_request = {
            "user_id": user_id,
            "user_name": user.get("name", "Unknown"),
            "user_email": user.get("email", ""),
            "user_phone": user.get("phone", ""),
            "amount": amount,
            "upi_id": upi_id,
            "payment_method": "UPI",
            "payment_details": {"upi_id": upi_id},
            "status": "pending",
            "created_at": datetime.utcnow().isoformat(),
            "processed_at": None,
            "admin_notes": None
        }
        
        result = await self.db.withdrawal_requests.insert_one(withdrawal_request)
        withdrawal_request["_id"] = str(result.inserted_id)
        
        return {
            "message": "Withdrawal request submitted successfully",
            "request_id": str(result.inserted_id),
            "amount": amount,
            "upi_id": upi_id,
            "status": "pending"
        }
    
    async def process_withdrawal(
        self,
        withdrawal_id: str,
        admin_id: str,
        status: str,
        admin_notes: str = None
    ) -> dict:
        """Admin: Approve or reject withdrawal request"""
        # Get withdrawal request
        withdrawal = await self.db.withdrawal_requests.find_one({"_id": ObjectId(withdrawal_id)})
        if not withdrawal:
            raise HTTPException(status_code=404, detail="Withdrawal request not found")
        
        if withdrawal["status"] != "pending":
            raise HTTPException(
                status_code=400,
                detail=f"Withdrawal already {withdrawal['status']}"
            )
        
        user_id = withdrawal["user_id"]
        amount = withdrawal["amount"]
        
        if status == "approved":
            # Atomically deduct from both wallet_balance and withdrawable_balance with balance check
            updated_user = await self.db.users.find_one_and_update(
                {
                    "_id": ObjectId(user_id),
                    "wallet_balance": {"$gte": amount},
                    "withdrawable_balance": {"$gte": amount}
                },
                {
                    "$inc": {
                        "wallet_balance": -amount,
                        "withdrawable_balance": -amount
                    },
                    "$set": {"updated_at": datetime.utcnow().isoformat()}
                },
                return_document=True
            )
            
            if not updated_user:
                # Either user not found or insufficient balance
                user = await self.db.users.find_one({"_id": ObjectId(user_id)})
                if not user:
                    raise HTTPException(status_code=404, detail="User not found")
                raise HTTPException(
                    status_code=400,
                    detail="Insufficient withdrawable balance"
                )
            
            new_wallet = updated_user["wallet_balance"]
            new_withdrawable = updated_user["withdrawable_balance"]
            
            # Log withdrawal in wallet_transactions for user transaction history
            withdrawal_txn = {
                "user_id": user_id,
                "type": "debit",
                "amount": amount,
                "balance_after": new_wallet,
                "reference_type": "withdrawal",
                "reference_id": withdrawal_id,
                "description": f"Withdrawal via {withdrawal.get('payment_method', 'UPI')}",
                "status": "completed",
                "created_at": datetime.utcnow().isoformat()
            }
            await self.db.wallet_transactions.insert_one(withdrawal_txn)
            
            # Log in referral transactions for admin tracking
            withdrawal_transaction = {
                "user_id": user_id,
                "type": "withdrawal",
                "amount": amount,
                "balance_before": new_withdrawable + amount,  # Calculate from atomic result
                "balance_after": new_withdrawable,
                "withdrawal_id": withdrawal_id,
                "payment_method": withdrawal["payment_method"],
                "payment_details": withdrawal["payment_details"],
                "processed_by": admin_id,
                "created_at": datetime.utcnow().isoformat()
            }
            await self.db.referral_transactions.insert_one(withdrawal_transaction)
        
        # Update withdrawal request
        await self.db.withdrawal_requests.update_one(
            {"_id": ObjectId(withdrawal_id)},
            {
                "$set": {
                    "status": status,
                    "processed_at": datetime.utcnow().isoformat(),
                    "processed_by": admin_id,
                    "admin_notes": admin_notes or ""
                }
            }
        )
        
        return {
            "message": f"Withdrawal {status} successfully",
            "withdrawal_id": withdrawal_id,
            "status": status,
            "amount": amount
        }
    
    async def get_admin_referral_stats(self) -> dict:
        """Admin: Get overall referral system statistics"""
        # Total users with referrals
        users_with_referrals = await self.db.users.count_documents({"referred_by": {"$exists": True, "$ne": None}})
        
        # Total commissions paid
        commissions_cursor = self.db.referral_commissions.find({})
        commissions = await commissions_cursor.to_list(length=None)
        total_commissions_paid = sum(c["commission_amount"] for c in commissions)
        
        # Pending withdrawals
        pending_withdrawals_cursor = self.db.withdrawal_requests.find({"status": "pending"})
        pending_withdrawals = await pending_withdrawals_cursor.to_list(length=100)
        pending_withdrawal_amount = sum(w["amount"] for w in pending_withdrawals)
        
        # Top referrers
        pipeline = [
            {"$group": {
                "_id": "$referrer_id",
                "total_commission": {"$sum": "$commission_amount"},
                "total_referrals": {"$sum": 1}
            }},
            {"$sort": {"total_commission": -1}},
            {"$limit": 10}
        ]
        top_referrers = await self.db.referral_commissions.aggregate(pipeline).to_list(length=10)
        
        # Enrich with user data
        for referrer in top_referrers:
            user = await self.db.users.find_one({"_id": ObjectId(referrer["_id"])})
            referrer["user_name"] = user.get("name", "Unknown") if user else "Unknown"
            referrer["user_email"] = user.get("email", "") if user else ""
        
        return {
            "total_referred_users": users_with_referrals,
            "total_commissions_paid": total_commissions_paid,
            "pending_withdrawals_count": len(pending_withdrawals),
            "pending_withdrawals_amount": pending_withdrawal_amount,
            "commission_rate": self.COMMISSION_RATE * 100,
            "top_referrers": top_referrers
        }
