from pydantic import BaseModel, ConfigDict
from typing import List, Optional
from datetime import datetime

class TopicBase(BaseModel):
    name: str
    description: Optional[str] = None
    category: Optional[str] = None
    keywords: List[str] = []
    sources: List[str] = []
    is_active: bool = True

class TopicCreate(TopicBase):
    pass

class TopicUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    category: Optional[str] = None
    keywords: Optional[List[str]] = None
    sources: Optional[List[str]] = None
    is_active: Optional[bool] = None

class TopicResponse(TopicBase):
    id: str
    created_at: datetime
    updated_at: datetime
    last_scanned_at: Optional[datetime] = None
    
    model_config = ConfigDict(from_attributes=True)
