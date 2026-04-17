from fastapi import APIRouter, Depends, HTTPException, status
from typing import List, Optional
from datetime import datetime
from models.database import claims_collection, matches_collection, users_collection, lost_items_collection, found_items_collection
from services.auth_service import get_current_user
import uuid

router = APIRouter(prefix="/claims", tags=["Claims"])

@router.post("/")
async def create_claim(
    match_id: str,
    user: dict = Depends(get_current_user)
):
    # Verify match exists
    match = await matches_collection.find_one({"_id": match_id})
    if not match:
        raise HTTPException(status_code=404, detail="Match not found")
        
    # Check if a claim already exists for this match
    existing_claim = await claims_collection.find_one({"match_id": match_id})
    if existing_claim:
        raise HTTPException(status_code=400, detail="Claim already exists for this match")

    claim_doc = {
        "match_id": match_id,
        "user_id": str(user["_id"]),
        "status": "pending",
        "created_at": datetime.utcnow()
    }
    
    result = await claims_collection.insert_one(claim_doc)
    
    # Update match status to reflect it's being claimed
    await matches_collection.update_one(
        {"_id": match_id},
        {"$set": {"status": "claimed"}}
    )
    
    return {"message": "Claim created successfully", "claim_id": str(result.inserted_id)}

@router.get("/")
async def get_claims(user: dict = Depends(get_current_user)):
    # Verify user is Admin
    if user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Not authorized. Admins only.")

    claims = await claims_collection.find().to_list(100)
    
    # Enrich with match details
    detailed_claims = []
    for claim in claims:
        match = await matches_collection.find_one({"_id": claim["match_id"]})
        if match:
            lost = await lost_items_collection.find_one({"_id": match["lost_item_id"]})
            found = await found_items_collection.find_one({"_id": match["found_item_id"]})
            claimer = await users_collection.find_one({"_id": claim["user_id"]})
            
            detailed_claims.append({
                "claim_id": str(claim["_id"]),
                "status": claim["status"],
                "created_at": claim["created_at"],
                "match": match,
                "lost": lost,
                "found": found,
                "claimer": {
                    "name": claimer.get("name") if claimer else "Unknown",
                    "email": claimer.get("email") if claimer else "Unknown"
                }
            })
            
    return detailed_claims

@router.put("/{claim_id}/status")
async def update_claim_status(
    claim_id: str,
    action: str,  # 'approve' or 'reject'
    user: dict = Depends(get_current_user)
):
    if user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Not authorized. Admins only.")
        
    claim = await claims_collection.find_one({"_id": claim_id})
    if not claim:
        raise HTTPException(status_code=404, detail="Claim not found")
        
    if action not in ["approve", "reject"]:
        raise HTTPException(status_code=400, detail="Invalid action")
        
    new_status = "approved" if action == "approve" else "rejected"
    
    # Update claim status
    await claims_collection.update_one(
        {"_id": claim_id},
        {"$set": {"status": new_status, "resolved_at": datetime.utcnow()}}
    )
    
    # Send email notification (Skipping full implementation to avoid bloat, 
    # but the service layer can be integrated here similarly to item_routes)

    return {"message": f"Claim {new_status} successfully"}
