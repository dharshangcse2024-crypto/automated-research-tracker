import difflib
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.models.article import Article
import re

def normalize_title(title: str) -> str:
    title = title.lower()
    title = re.sub(r'[^\w\s]', '', title)
    return ' '.join(title.split())

async def check_duplicate(db: AsyncSession, topic_id: str, new_article) -> tuple[bool, str]:
    if new_article.doi:
        stmt = select(Article.id).where(Article.topic_id == topic_id, Article.doi == new_article.doi)
        if (await db.execute(stmt)).scalar_one_or_none():
            return True, "Exact DOI match"
            
    if new_article.external_id:
        stmt = select(Article.id).where(Article.topic_id == topic_id, Article.external_id == new_article.external_id)
        if (await db.execute(stmt)).scalar_one_or_none():
            return True, "Exact external source ID match"
            
    if new_article.url:
        stmt = select(Article.id).where(Article.topic_id == topic_id, Article.url == new_article.url)
        if (await db.execute(stmt)).scalar_one_or_none():
            return True, "Exact URL match"
            
    stmt = select(Article.title).where(Article.topic_id == topic_id)
    existing_titles = (await db.execute(stmt)).scalars().all()
    
    norm_new_title = normalize_title(new_article.title)
    
    for existing_title in existing_titles:
        norm_existing = normalize_title(existing_title)
        if norm_new_title == norm_existing:
            return True, "Normalized title exact match"
            
        similarity = difflib.SequenceMatcher(None, norm_new_title, norm_existing).ratio()
        if similarity > 0.95:
            return True, f"High title similarity ({similarity:.2f})"
            
    return False, ""
