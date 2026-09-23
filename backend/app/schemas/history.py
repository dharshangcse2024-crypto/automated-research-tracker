from pydantic import BaseModel, ConfigDict
from typing import List, Optional
from datetime import datetime

class ResearchHistoryResponse(BaseModel):
    id: str
    topic_id: str
    scan_date: datetime
    articles_found: int
    new_articles: int
    duplicates_removed: int
    highly_relevant: int
    emerging_keywords: List[str]
    update_summary: Optional[str] = None
    
    model_config = ConfigDict(from_attributes=True)
