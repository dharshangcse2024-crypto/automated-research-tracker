from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.models.article import Article
from app.models.topic import Topic
import re

async def find_underexplored(db: AsyncSession, topic_id: str):
    topic_res = await db.execute(select(Topic).where(Topic.id == topic_id))
    topic = topic_res.scalar_one_or_none()
    if not topic or not topic.keywords:
        return {"topic_id": topic_id, "underexplored_keywords": []}
        
    art_res = await db.execute(select(Article).where(Article.topic_id == topic_id))
    articles = art_res.scalars().all()
    
    keyword_stats = {}
    for kw in topic.keywords:
        kw_lower = kw.lower()
        matched_articles = []
        for a in articles:
            text = f"{a.title or ''} {a.abstract or ''}".lower()
            if re.search(r'\b' + re.escape(kw_lower) + r'\b', text):
                matched_articles.append(a)
                
        freq = len(matched_articles)
        avg_rel = sum(a.relevance_score for a in matched_articles) / freq if freq > 0 else 0
        keyword_stats[kw_lower] = {"frequency": freq, "avg_relevance": avg_rel}
        
    underexplored = []
    for kw, stats in keyword_stats.items():
        if stats["frequency"] == 0:
            underexplored.append({
                "keyword": kw, 
                "frequency": 0,
                "avg_relevance": 0,
                "reason": "Completely unexplored (0 articles found)"
            })
        elif stats["frequency"] <= 3 and stats["avg_relevance"] >= 60:
            underexplored.append({
                "keyword": kw,
                "frequency": stats["frequency"],
                "avg_relevance": round(stats["avg_relevance"], 2),
                "reason": "Low volume but high relevance"
            })
            
    return {"topic_id": topic_id, "underexplored_keywords": underexplored}
