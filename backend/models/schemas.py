from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List, Dict
from datetime import datetime
import uuid

class UserBase(BaseModel):
    name: str
    email: EmailStr
    role: str = "user"

class UserCreate(UserBase):
    password: str

class UserResponse(UserBase):
    id: str = Field(alias="_id")
    class Config:
        populate_by_name = True
        alias_generator = lambda s: "_id" if s == "id" else s

class Token(BaseModel):
    access_token: str
    token_type: str
    role: str = "user"

class LostItemBase(BaseModel):
    title: str
    description: str
    location: str
    date_lost: str
    category: Optional[str] = None
    image_url: Optional[str] = None

class LostItemCreate(LostItemBase):
    pass

class LostItemInDB(LostItemBase):
    id: str = Field(alias="_id", default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    embedding: Optional[List[float]] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)

class FoundItemBase(BaseModel):
    description: str
    location: str
    image_url: str

class FoundItemInDB(FoundItemBase):
    id: str = Field(alias="_id", default_factory=lambda: str(uuid.uuid4()))
    uploaded_by: str
    detected_labels: List[str] = []
    color: Optional[str] = None
    brand: Optional[str] = None
    embedding: List[float] = []
    created_at: datetime = Field(default_factory=datetime.utcnow)

class MatchResponse(BaseModel):
    lost_item: Dict
    found_item: Dict
    score: float
    status: str = "potential"

class MatchDB(BaseModel):
    lost_item_id: str
    found_item_id: str
    similarity_score: float
    status: str = "potential"
