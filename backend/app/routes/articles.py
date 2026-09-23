from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from typing import List
from app.database import get_db
from app.models.article import Article
from app.schemas.article import ArticleResponse

# We create two routers, one for articles, and one specifically for topic nested articles
router = APIRouter(prefix="/api/articles", tags=["Articles"])
topic_articles_router = APIRouter(prefix="/api/topics", tags=["Topic Articles"])

@router.get("", response_model=List[ArticleResponse])
async def get_articles(skip: int = 0, limit: int = 100, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Article).offset(skip).limit(limit))
    return result.scalars().all()

@router.get("/{article_id}", response_model=ArticleResponse)
async def get_article(article_id: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Article).where(Article.id == article_id))
    article = result.scalar_one_or_none()
    if not article:
        raise HTTPException(status_code=404, detail="Article not found")
    return article

@topic_articles_router.get("/{topic_id}/articles", response_model=List[ArticleResponse])
async def get_topic_articles(topic_id: str, skip: int = 0, limit: int = 100, db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(Article)
        .where(Article.topic_id == topic_id)
        .offset(skip)
        .limit(limit)
    )
    return result.scalars().all()
