from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from typing import List
from app.database import get_db
from app.models.topic import Topic
from app.schemas.topic import TopicCreate, TopicUpdate, TopicResponse
from datetime import datetime, timezone

router = APIRouter(prefix="/api/topics", tags=["Topics"])

@router.post("", response_model=TopicResponse, status_code=status.HTTP_201_CREATED)
async def create_topic(topic: TopicCreate, db: AsyncSession = Depends(get_db)):
    db_topic = Topic(**topic.model_dump())
    db.add(db_topic)
    await db.commit()
    await db.refresh(db_topic)
    return db_topic

@router.get("", response_model=List[TopicResponse])
async def get_topics(skip: int = 0, limit: int = 100, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Topic).offset(skip).limit(limit))
    return result.scalars().all()

@router.get("/{topic_id}", response_model=TopicResponse)
async def get_topic(topic_id: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Topic).where(Topic.id == topic_id))
    topic = result.scalar_one_or_none()
    if not topic:
        raise HTTPException(status_code=404, detail="Topic not found")
    return topic

@router.put("/{topic_id}", response_model=TopicResponse)
async def update_topic(topic_id: str, topic_update: TopicUpdate, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Topic).where(Topic.id == topic_id))
    db_topic = result.scalar_one_or_none()
    if not db_topic:
        raise HTTPException(status_code=404, detail="Topic not found")
    
    update_data = topic_update.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_topic, key, value)
    
    db_topic.updated_at = datetime.now(timezone.utc)
    await db.commit()
    await db.refresh(db_topic)
    return db_topic

@router.delete("/{topic_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_topic(topic_id: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Topic).where(Topic.id == topic_id))
    db_topic = result.scalar_one_or_none()
    if not db_topic:
        raise HTTPException(status_code=404, detail="Topic not found")
    
    await db.delete(db_topic)
    await db.commit()

from app.services.research_update import get_latest_update

@router.get("/{topic_id}/latest-update")
async def get_topic_latest_update(topic_id: str, db: AsyncSession = Depends(get_db)):
    update_data = await get_latest_update(db, topic_id)
    if not update_data:
        raise HTTPException(status_code=404, detail="Topic not found or no history available")
    return update_data

from app.services.trends import detect_trends

@router.get("/{topic_id}/trends")
async def get_topic_trends(topic_id: str, scans: int = 5, db: AsyncSession = Depends(get_db)):
    trends_data = await detect_trends(db, topic_id, scans)
    if not trends_data.get("timeline"):
        raise HTTPException(status_code=404, detail="Topic not found or no history available")
    return trends_data

from app.services.underexplored import find_underexplored

@router.get("/{topic_id}/underexplored")
async def get_topic_underexplored(topic_id: str, db: AsyncSession = Depends(get_db)):
    underexplored_data = await find_underexplored(db, topic_id)
    if not underexplored_data:
        raise HTTPException(status_code=404, detail="Topic not found")
    return underexplored_data
