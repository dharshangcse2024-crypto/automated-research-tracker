from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class CollectedArticle(BaseModel):
    title: str
    authors: Optional[str] = None
    abstract: Optional[str] = None
    url: Optional[str] = None
    source: Optional[str] = None
    external_id: Optional[str] = None
    doi: Optional[str] = None
    published_date: Optional[datetime] = None

class ResearchCollectPayload(BaseModel):
    topic_id: str
    articles: List[CollectedArticle]

class ResearchCollectResponse(BaseModel):
    status: str
    message: str
    processed_count: int
    new_articles_added: int
