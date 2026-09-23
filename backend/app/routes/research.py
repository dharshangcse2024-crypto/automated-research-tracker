from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.database import get_db
from app.models.topic import Topic
from app.models.article import Article
from app.models.research_history import ResearchHistory
from app.schemas.research import ResearchCollectPayload, ResearchCollectResponse
from app.services.duplicate import check_duplicate
from app.services.relevance import calculate_relevance
from app.services.summarizer import generate_summary
import logging
from datetime import datetime, timezone

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/research", tags=["Research"])

@router.post("/collect", response_model=ResearchCollectResponse)
async def collect_research(payload: ResearchCollectPayload, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Topic).where(Topic.id == payload.topic_id))
    topic = result.scalar_one_or_none()
    if not topic:
        raise HTTPException(status_code=404, detail="Topic not found")
        
    added_count = 0
    duplicate_count = 0
    highly_relevant_count = 0
    
    for item in payload.articles:
        # Phase 7 - Duplicate Detection
        is_duplicate, reason = await check_duplicate(db, topic.id, item)
        if is_duplicate:
            logger.info(f"Skipping duplicate article '{item.title}': {reason}")
            duplicate_count += 1
            continue
            
        # Phase 8 - Relevance Scoring
        score, label = calculate_relevance(topic, item)
        
        if score >= 80:
            highly_relevant_count += 1
            
        # Phase 9 - AI Summarization
        ai_summary = await generate_summary(item.title, item.abstract)
        
        new_article = Article(
            topic_id=topic.id,
            title=item.title,
            authors=item.authors,
            abstract=item.abstract,
            url=item.url,
            source=item.source,
            external_id=item.external_id,
            doi=item.doi,
            published_date=item.published_date,
            relevance_score=score,
            relevance_label=label,
            summary=ai_summary
        )
        
        if hasattr(item, 'category') and item.category:
            new_article.category = item.category
            
        db.add(new_article)
        added_count += 1
        
    # Phase 10 - Research History
    history_record = ResearchHistory(
        topic_id=topic.id,
        articles_found=len(payload.articles),
        new_articles=added_count,
        duplicates_removed=duplicate_count,
        highly_relevant=highly_relevant_count,
        scan_date=datetime.now(timezone.utc)
    )
    db.add(history_record)
    
    # Update topic last_scanned_at
    topic.last_scanned_at = datetime.now(timezone.utc)
        
    # TODO: Phase 11 & 12 & 13 - Trend Analysis, What's New
    
    await db.commit()
    
    return ResearchCollectResponse(
        status="success",
        message=f"Research data collected. Added: {added_count}, Duplicates ignored: {duplicate_count}",
        processed_count=len(payload.articles),
        new_articles_added=added_count
    )
