"""
Product API routes
"""
from fastapi import APIRouter, Depends, Query
from core.database import get_database
from core.security import get_current_user, require_role
from .schemas import ProductCreate, ProductUpdate, ProductOut
from .service import ProductService


router = APIRouter(prefix="/products", tags=["Products"])


@router.post("/", response_model=ProductOut, summary="Create product (Admin only)")
async def create_product(
    product: ProductCreate,
    current_user: dict = Depends(require_role(["admin"])),
    db=Depends(get_database)
):
    """Create new OTT plan (admin only)"""
    service = ProductService(db)
    result = await service.create_product(product.model_dump())
    return {
        "id": result["_id"],
        "platform_name": result["platform_name"],
        "plan_name": result["plan_name"],
        "price": result["price"],
        "duration_days": result["duration_days"],
        "stock": result["stock"],
        "is_active": result["is_active"],
        "description": result.get("description"),
        "created_at": result["created_at"]
    }


@router.get("/", summary="List all products")
async def list_products(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    active_only: bool = Query(False, description="Show only active products"),
    db=Depends(get_database)
):
    """
    List OTT plans with pagination
    - Public endpoint, no authentication required
    - Use active_only=true to show only available plans
    """
    service = ProductService(db)
    products = await service.list_products(skip, limit, active_only)
    
    return {
        "products": [
            {
                "id": p["_id"],
                "platform_name": p["platform_name"],
                "plan_name": p["plan_name"],
                "price": p["price"],
                "duration_days": p["duration_days"],
                "stock": p["stock"],
                "is_active": p["is_active"],
                "description": p.get("description"),
                "created_at": p["created_at"]
            }
            for p in products
        ],
        "count": len(products)
    }


@router.get("/{product_id}", response_model=ProductOut, summary="Get product by ID")
async def get_product(product_id: str, db=Depends(get_database)):
    """Get specific OTT plan details"""
    service = ProductService(db)
    product = await service.get_product_by_id(product_id)
    return {
        "id": product["_id"],
        "platform_name": product["platform_name"],
        "plan_name": product["plan_name"],
        "price": product["price"],
        "duration_days": product["duration_days"],
        "stock": product["stock"],
        "is_active": product["is_active"],
        "description": product.get("description"),
        "created_at": product["created_at"]
    }


@router.patch("/{product_id}", response_model=ProductOut, summary="Update product (Admin only)")
async def update_product(
    product_id: str,
    update_data: ProductUpdate,
    current_user: dict = Depends(require_role(["admin"])),
    db=Depends(get_database)
):
    """Update OTT plan (admin only)"""
    service = ProductService(db)
    product = await service.update_product(product_id, update_data.model_dump())
    return {
        "id": product["_id"],
        "platform_name": product["platform_name"],
        "plan_name": product["plan_name"],
        "price": product["price"],
        "duration_days": product["duration_days"],
        "stock": product["stock"],
        "is_active": product["is_active"],
        "description": product.get("description"),
        "created_at": product["created_at"]
    }


@router.delete("/{product_id}", summary="Delete product (Admin only)")
async def delete_product(
    product_id: str,
    current_user: dict = Depends(require_role(["admin"])),
    db=Depends(get_database)
):
    """Delete OTT plan (admin only)"""
    service = ProductService(db)
    await service.delete_product(product_id)
    return {"message": "Product deleted successfully"}
