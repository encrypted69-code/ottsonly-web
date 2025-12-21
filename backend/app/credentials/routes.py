"""
Admin credentials management routes
"""
from fastapi import APIRouter, Depends, Query
from core.database import get_database
from core.security import require_role
from .service import CredentialService
from .schemas import CredentialCreate, CredentialUpdate


router = APIRouter(prefix="/admin/credentials", tags=["Admin - Credentials"])


@router.get("", summary="List all credentials (Admin)")
async def list_credentials(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    platform: str = Query(None, description="Filter by platform name"),
    is_active: bool = Query(None, description="Filter by active status"),
    current_user: dict = Depends(require_role(["admin"])),
    db=Depends(get_database)
):
    """List all OTT platform credentials (admin only)"""
    service = CredentialService(db)
    credentials = await service.list_credentials(skip, limit, platform, is_active)
    
    # Get user details for used credentials
    result_credentials = []
    for c in credentials:
        cred_data = {
            "id": c["_id"],
            "platform": c["platform"],
            "username": c["username"],
            "password": c["password"],
            "notes": c.get("notes"),
            "is_active": c["is_active"],
            "created_at": c["created_at"],
            "updated_at": c["updated_at"],
            "is_used": c.get("used_by") is not None,
            "used_at": c.get("used_at"),
            "subscription_id": c.get("subscription_id")
        }
        
        # Get user info if credential is used
        if c.get("used_by"):
            try:
                user = await db.users.find_one({"_id": ObjectId(c["used_by"])})
                if user:
                    cred_data["user_info"] = {
                        "user_id": c["used_by"],
                        "name": user.get("name"),
                        "email": user.get("email"),
                        "phone": user.get("phone")
                    }
            except:
                pass
        
        result_credentials.append(cred_data)
    
    return {
        "credentials": result_credentials,
        "count": len(result_credentials)
    }


@router.get("/{credential_id}", summary="Get credential by ID (Admin)")
async def get_credential(
    credential_id: str,
    current_user: dict = Depends(require_role(["admin"])),
    db=Depends(get_database)
):
    """Get specific credential details (admin only)"""
    service = CredentialService(db)
    credential = await service.get_credential_by_id(credential_id)
    
    return {
        "id": credential["_id"],
        "platform": credential["platform"],
        "username": credential["username"],
        "password": credential["password"],
        "notes": credential.get("notes"),
        "is_active": credential["is_active"],
        "created_at": credential["created_at"],
        "updated_at": credential["updated_at"]
    }


@router.post("", summary="Create new credential (Admin)")
async def create_credential(
    credential: CredentialCreate,
    current_user: dict = Depends(require_role(["admin"])),
    db=Depends(get_database)
):
    """Create new OTT platform credential (admin only)"""
    service = CredentialService(db)
    new_credential = await service.create_credential(
        credential.platform,
        credential.username,
        credential.password,
        credential.notes
    )
    
    return {
        "message": "Credential created successfully",
        "credential": {
            "id": new_credential["_id"],
            "platform": new_credential["platform"],
            "username": new_credential["username"],
            "password": new_credential["password"],
            "notes": new_credential.get("notes"),
            "is_active": new_credential["is_active"],
            "created_at": new_credential["created_at"]
        }
    }


@router.put("/{credential_id}", summary="Update credential (Admin)")
async def update_credential(
    credential_id: str,
    credential: CredentialUpdate,
    current_user: dict = Depends(require_role(["admin"])),
    db=Depends(get_database)
):
    """Update OTT platform credential (admin only)"""
    service = CredentialService(db)
    
    # Build update dict
    update_data = {}
    if credential.platform is not None:
        update_data["platform"] = credential.platform
    if credential.username is not None:
        update_data["username"] = credential.username
    if credential.password is not None:
        update_data["password"] = credential.password
    if credential.notes is not None:
        update_data["notes"] = credential.notes
    if credential.is_active is not None:
        update_data["is_active"] = credential.is_active
    
    updated_credential = await service.update_credential(credential_id, update_data)
    
    return {
        "message": "Credential updated successfully",
        "credential": {
            "id": updated_credential["_id"],
            "platform": updated_credential["platform"],
            "username": updated_credential["username"],
            "password": updated_credential["password"],
            "notes": updated_credential.get("notes"),
            "is_active": updated_credential["is_active"],
            "updated_at": updated_credential["updated_at"]
        }
    }


@router.delete("/{credential_id}", summary="Delete credential (Admin)")
async def delete_credential(
    credential_id: str,
    current_user: dict = Depends(require_role(["admin"])),
    db=Depends(get_database)
):
    """Delete OTT platform credential (admin only)"""
    service = CredentialService(db)
    result = await service.delete_credential(credential_id)
    
    return result
