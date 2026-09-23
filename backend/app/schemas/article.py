from pydantic import BaseModel, ConfigDict
from typing import Optional
from datetime import datetime

class ArticleBase(BaseModel):
    topic_id: str
    title: str
    authors: Optional[str] = None
    abstract: Optional[str] = None
    url: Optional[str] = None
    source: Optional[str] = None
    external_id: Optional[str] = None
    doi: Optional[str] = None
    published_date: Optional[datetime] = None
    category: Optional[str] = None
    relevance_score: Optional[float] = None
    relevance_label: Optional[str] = None
    summary: Optional[str] = None

class ArticleResponse(ArticleBase):
    id: str
    created_at: datetime
    
    model_config = ConfigDict(from_attributes=True)
