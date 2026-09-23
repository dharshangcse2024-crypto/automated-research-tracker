from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from typing import List
from app.database import get_db
from app.models.research_history import ResearchHistory
from app.schemas.history import ResearchHistoryResponse

router = APIRouter(prefix="/api/topics", tags=["Research History"])

@router.get("/{topic_id}/history", response_model=List[ResearchHistoryResponse])
async def get_topic_history(topic_id: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(ResearchHistory)
        .where(ResearchHistory.topic_id == topic_id)
        .order_by(ResearchHistory.scan_date.desc())
    )
    return result.scalars().all()
