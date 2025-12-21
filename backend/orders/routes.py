"""
Order API routes
"""
from fastapi import APIRouter, Depends, Query
from core.database import get_database
from core.security import get_current_user, require_role
from .schemas import OrderCreate, OrderOut, RefundRequest
from .service import OrderService


router = APIRouter(prefix="/orders", tags=["Orders"])


@router.post("/", response_model=OrderOut, summary="Create order")
async def create_order(
    request: OrderCreate,
    current_user: dict = Depends(get_current_user),
    db=Depends(get_database)
):
    """
    Create order and process payment from wallet
    
    - Checks wallet balance
    - Deducts amount
    - Reduces stock
    - Creates subscription
    - Returns order details
    """
    service = OrderService(db)
    order = await service.create_order(current_user["_id"], request.product_id)
    
    return {
        "id": order["_id"],
        "user_id": order["user_id"],
        "product_id": order["product_id"],
        "product_name": order["product_name"],
        "amount": order["amount"],
        "status": order["status"],
        "subscription_id": order.get("subscription_id"),
        "created_at": order["created_at"],
        "paid_at": order.get("paid_at")
    }


@router.get("/my-orders", summary="Get my orders")
async def get_my_orders(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    current_user: dict = Depends(get_current_user),
    db=Depends(get_database)
):
    """Get authenticated user's orders"""
    service = OrderService(db)
    orders = await service.list_user_orders(current_user["_id"], skip, limit)
    
    return {
        "orders": [
            {
                "id": o["_id"],
                "user_id": o["user_id"],
                "product_id": o["product_id"],
                "product_name": o["product_name"],
                "amount": o["amount"],
                "status": o["status"],
                "created_at": o["created_at"],
                "paid_at": o.get("paid_at")
            }
            for o in orders
        ],
        "count": len(orders)
    }


@router.get("/", summary="List all orders (Admin only)")
async def list_orders(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    current_user: dict = Depends(require_role(["admin", "support"])),
    db=Depends(get_database)
):
    """List all orders (admin/support only)"""
    service = OrderService(db)
    orders = await service.list_all_orders(skip, limit)
    
    return {
        "orders": [
            {
                "id": o["_id"],
                "user_id": o["user_id"],
                "product_id": o["product_id"],
                "product_name": o["product_name"],
                "amount": o["amount"],
                "status": o["status"],
                "created_at": o["created_at"],
                "paid_at": o.get("paid_at")
            }
            for o in orders
        ],
        "count": len(orders)
    }


@router.get("/{order_id}", response_model=OrderOut, summary="Get order by ID")
async def get_order(
    order_id: str,
    current_user: dict = Depends(get_current_user),
    db=Depends(get_database)
):
    """Get order details"""
    service = OrderService(db)
    order = await service.get_order_by_id(order_id)
    
    # Check if user owns this order or is admin
    if order["user_id"] != current_user["_id"] and current_user.get("role") not in ["admin", "support"]:
        raise HTTPException(status_code=403, detail="Access denied")
    
    return {
        "id": order["_id"],
        "user_id": order["user_id"],
        "product_id": order["product_id"],
        "product_name": order["product_name"],
        "amount": order["amount"],
        "status": order["status"],
        "created_at": order["created_at"],
        "paid_at": order.get("paid_at")
    }


@router.post("/{order_id}/refund", summary="Refund order (Admin only)")
async def refund_order(
    order_id: str,
    request: RefundRequest,
    current_user: dict = Depends(require_role(["admin"])),
    db=Depends(get_database)
):
    """
    Process order refund (admin only)
    
    - Refunds amount to user wallet
    - Cancels subscription
    - Restores stock
    """
    service = OrderService(db)
    order = await service.refund_order(order_id, request.reason)
    
    return {
        "message": "Order refunded successfully",
        "order": {
            "id": order["_id"],
            "status": order["status"],
            "amount": order["amount"],
            "refund_reason": order.get("refund_reason")
        }
    }
