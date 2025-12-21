"""
Wallet API routes
"""
from fastapi import APIRouter, Depends, Query
from core.database import get_database
from core.security import get_current_user, require_role
from .schemas import AddMoneyRequest, VerifyPaymentRequest, AdminWalletOperation, WalletTransactionOut
from .service import WalletService


router = APIRouter(prefix="/wallet", tags=["Wallet"])


@router.get("/balance", summary="Get wallet balance")
async def get_balance(
    current_user: dict = Depends(get_current_user),
    db=Depends(get_database)
):
    """Get authenticated user's wallet balance"""
    service = WalletService(db)
    balance = await service.get_wallet_balance(current_user["_id"])
    return {"balance": balance}


@router.post("/add-money", summary="Initiate add money to wallet")
async def add_money(
    request: AddMoneyRequest,
    current_user: dict = Depends(get_current_user),
    db=Depends(get_database)
):
    """
    Create Razorpay order to add money to wallet
    
    Returns Razorpay order details for payment processing
    """
    service = WalletService(db)
    order = await service.create_razorpay_order(current_user["_id"], request.amount)
    return order


@router.post("/verify-payment", summary="Verify Razorpay payment")
async def verify_payment(
    request: VerifyPaymentRequest,
    current_user: dict = Depends(get_current_user),
    db=Depends(get_database)
):
    """
    Verify Razorpay payment and credit wallet
    
    - Verifies payment signature
    - Credits wallet with amount
    - Creates transaction record
    """
    service = WalletService(db)
    result = await service.verify_and_credit_wallet(
        current_user["_id"],
        request.razorpay_order_id,
        request.razorpay_payment_id,
        request.razorpay_signature
    )
    return result


@router.get("/transactions", summary="Get wallet transactions")
async def get_transactions(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    current_user: dict = Depends(get_current_user),
    db=Depends(get_database)
):
    """Get authenticated user's wallet transaction history"""
    service = WalletService(db)
    transactions = await service.get_wallet_transactions(current_user["_id"], skip, limit)
    
    return {
        "transactions": [
            {
                "id": t["_id"],
                "user_id": t["user_id"],
                "type": t["type"],
                "amount": t["amount"],
                "balance_after": t["balance_after"],
                "reference_type": t.get("reference_type"),
                "reference_id": t.get("reference_id"),
                "description": t.get("description", "N/A"),
                "created_at": t["created_at"]
            }
            for t in transactions
        ],
        "count": len(transactions)
    }


@router.post("/admin-operation", summary="Admin wallet operation (Admin only)")
async def admin_operation(
    request: AdminWalletOperation,
    current_user: dict = Depends(require_role(["admin"])),
    db=Depends(get_database)
):
    """
    Admin manual credit/debit to user wallet
    
    - **operation**: "credit" or "debit"
    - **amount**: Amount to credit/debit
    - **description**: Reason for operation
    """
    service = WalletService(db)
    result = await service.admin_wallet_operation(
        request.user_id,
        request.amount,
        request.operation,
        request.description
    )
    return result
