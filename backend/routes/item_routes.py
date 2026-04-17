from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from typing import List, Optional
import os
import shutil
import uuid
from datetime import datetime
from models.database import lost_items_collection, found_items_collection, matches_collection, users_collection
from services.auth_service import get_current_user
from ai.nlp_service import nlp_service
from ai.cv_service import cv_service
from services.notification_service import notification_service
import asyncio

router = APIRouter(prefix="/items", tags=["Items"])

UPLOAD_DIR = "uploads"
if not os.path.exists(UPLOAD_DIR):
    os.makedirs(UPLOAD_DIR)

@router.post("/lost")
async def report_lost_item(
    title: str = Form(...),
    description: str = Form(...),
    location: str = Form(...),
    date_lost: str = Form(...),
    category: Optional[str] = Form(None),
    image: Optional[UploadFile] = File(None),
    user: dict = Depends(get_current_user)
):
    image_url = None
    if image:
        file_ext = image.filename.split(".")[-1]
        file_name = f"{uuid.uuid4()}.{file_ext}"
        file_path = f"{UPLOAD_DIR}/{file_name}"
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(image.file, buffer)
        image_url = f"/api/uploads/{file_name}"

    # Generate text embedding
    text_content = f"{title} {description} {category or ''} {location}"
    embedding = nlp_service.get_embedding(text_content)

    lost_item = {
        "user_id": str(user["_id"]),
        "title": title,
        "description": description,
        "location": location,
        "date_lost": date_lost,
        "category": category,
        "image_url": image_url,
        "embedding": embedding,
        "created_at": datetime.utcnow()
    }
    
    result = await lost_items_collection.insert_one(lost_item)
    lost_item["_id"] = str(result.inserted_id)
    
    # Trigger matching process (can be async task)
    await run_matching_engine(str(result.inserted_id), embedding, True)
    
    return {"message": "Lost item reported", "item_id": str(result.inserted_id)}

@router.post("/found")
async def report_found_item(
    description: str = Form(...),
    location: str = Form(...),
    image: UploadFile = File(...),
    user: dict = Depends(get_current_user)
):
    file_ext = image.filename.split(".")[-1]
    file_name = f"{uuid.uuid4()}.{file_ext}"
    file_path = f"{UPLOAD_DIR}/{file_name}"
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(image.file, buffer)
    image_url = f"/api/uploads/{file_name}"

    # AI Analysis
    cv_analysis = cv_service.analyze_image(file_path)
    
    # NLP Embedding
    text_content = f"{description} {location} {' '.join(cv_analysis['labels'])} {cv_analysis['color']}"
    embedding = nlp_service.get_embedding(text_content)

    found_item = {
        "uploaded_by": str(user["_id"]),
        "description": description,
        "location": location,
        "image_url": image_url,
        "detected_labels": cv_analysis["labels"],
        "color": cv_analysis["color"],
        "brand": cv_analysis["brand"],
        "embedding": embedding,
        "created_at": datetime.utcnow()
    }
    
    result = await found_items_collection.insert_one(found_item)
    found_item["_id"] = str(result.inserted_id)
    
    # Trigger matching
    await run_matching_engine(str(result.inserted_id), embedding, False)
    
    return {"message": "Found item reported", "item_id": str(result.inserted_id), "analysis": cv_analysis}

async def notify_match(lost_item_id: str, found_item_id: str, score: float):
    lost = await lost_items_collection.find_one({"_id": lost_item_id})
    found = await found_items_collection.find_one({"_id": found_item_id})
    
    if not lost or not found: return
    
    loser = await users_collection.find_one({"_id": lost.get("user_id")})
    finder = await users_collection.find_one({"_id": found.get("uploaded_by")})
    admins = await users_collection.find({"role": "admin"}).to_list(100)
    
    subject = "FoundIt AI: New Match Found!"
    body = f"A potential match ({score * 100:.1f}%) was found between lost item '{lost.get('title')}' and a found item."
    
    if loser and loser.get("email"):
        notification_service.send_email(loser["email"], subject, body)
    if finder and finder.get("email"):
        notification_service.send_email(finder["email"], subject, body)
        
    for admin in admins:
        if admin.get("email"):
            notification_service.send_email(admin["email"], subject, f"[ADMIN ALERT] {body}")

async def run_matching_engine(new_item_id: str, new_embedding: list, is_lost: bool):
    """Compare the new item with existing items and store matches."""
    threshold = 0.5 # Similarity threshold (reduced for better initial testing)
    
    if is_lost:
        # Compare with all found items
        async for found in found_items_collection.find():
            score = nlp_service.calculate_similarity(new_embedding, found["embedding"])
            if score >= threshold:
                await matches_collection.update_one(
                    {"lost_item_id": new_item_id, "found_item_id": str(found["_id"])},
                    {"$set": {"similarity_score": score, "status": "potential"}},
                    upsert=True
                )
                asyncio.create_task(notify_match(new_item_id, str(found["_id"]), score))
    else:
        # Compare with all lost items
        async for lost in lost_items_collection.find():
            score = nlp_service.calculate_similarity(lost["embedding"], new_embedding)
            if score >= threshold:
                await matches_collection.update_one(
                    {"lost_item_id": str(lost["_id"]), "found_item_id": new_item_id},
                    {"$set": {"similarity_score": score, "status": "potential"}},
                    upsert=True
                )
                asyncio.create_task(notify_match(str(lost["_id"]), new_item_id, score))

@router.get("/all")
async def get_all_items():
    lost = await lost_items_collection.find().to_list(100)
    found = await found_items_collection.find().to_list(100)
    
    for item in lost + found:
        item["_id"] = str(item["_id"])
        if "embedding" in item: del item["embedding"]
        
    return {"lost": lost, "found": found}

@router.get("/my-items")
async def get_my_items(user: dict = Depends(get_current_user)):
    user_id = str(user["_id"])
    
    # Restored to user specific query
    lost = await lost_items_collection.find({"user_id": user_id}).to_list(100)
    found = await found_items_collection.find({"uploaded_by": user_id}).to_list(100)
    
    for item in lost + found:
        item["_id"] = str(item["_id"])
        if "embedding" in item: del item["embedding"]
        
    return {"lost": lost, "found": found}

@router.get("/matches")
async def get_matches(user: dict = Depends(get_current_user)):
    user_id = str(user["_id"])
    
    # Find all lost items by this user
    lost_items = await lost_items_collection.find({"user_id": user_id}).to_list(100)
    lost_ids = [str(item["_id"]) for item in lost_items]
    
    # Find all matches for these lost items
    matches = await matches_collection.find({"lost_item_id": {"$in": lost_ids}}).to_list(100)
    
    detailed_matches = []
    for match in matches:
        lost = await lost_items_collection.find_one({"_id": match["lost_item_id"]})
        found = await found_items_collection.find_one({"_id": match["found_item_id"]})
        
        if lost and found:
            lost["_id"] = str(lost["_id"])
            found["_id"] = str(found["_id"])
            if "embedding" in lost: del lost["embedding"]
            if "embedding" in found: del found["embedding"]
            
            detailed_matches.append({
                "match_id": str(match["_id"]),
                "lost": lost,
                "found": found,
                "score": match["similarity_score"]
            })
            
    return detailed_matches
