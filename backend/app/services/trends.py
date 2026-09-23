from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.models.research_history import ResearchHistory
from app.models.article import Article
from app.models.topic import Topic
import re

async def detect_trends(db: AsyncSession, topic_id: str, num_scans: int = 5):
    hist_res = await db.execute(
        select(ResearchHistory)
        .where(ResearchHistory.topic_id == topic_id)
        .order_by(ResearchHistory.scan_date.desc())
        .limit(num_scans)
    )
    histories = hist_res.scalars().all()
    if not histories:
        return {"timeline": [], "rising_keywords": []}
        
    histories.reverse()
    
    topic_res = await db.execute(select(Topic).where(Topic.id == topic_id))
    topic = topic_res.scalar_one_or_none()
    keywords = topic.keywords if topic and topic.keywords else []
    
    art_res = await db.execute(select(Article).where(Article.topic_id == topic_id))
    articles = art_res.scalars().all()
    
    trends = []
    for i, hist in enumerate(histories):
        if i == 0:
            bucket_arts = [a for a in articles if a.created_at <= hist.scan_date]
        else:
            prev_date = histories[i-1].scan_date
            bucket_arts = [a for a in articles if prev_date < a.created_at <= hist.scan_date]
            
        freqs = {}
        for kw in keywords:
            kw_lower = kw.lower()
            count = 0
            for a in bucket_arts:
                text = f"{a.title or ''} {a.abstract or ''}".lower()
                if re.search(r'\b' + re.escape(kw_lower) + r'\b', text):
                    count += 1
            freqs[kw_lower] = count
            
        trends.append({
            "scan_date": hist.scan_date,
            "new_articles_in_scan": len(bucket_arts),
            "keyword_frequencies": freqs
        })
        
    rising_keywords = []
    if len(trends) > 1:
        latest_freqs = trends[-1]["keyword_frequencies"]
        for kw in keywords:
            kw_lower = kw.lower()
            prev_counts = [t["keyword_frequencies"].get(kw_lower, 0) for t in trends[:-1]]
            avg_prev = sum(prev_counts) / len(prev_counts)
            if latest_freqs.get(kw_lower, 0) > avg_prev and latest_freqs.get(kw_lower, 0) > 0:
                rising_keywords.append(kw_lower)
                
    return {
        "topic_id": topic_id,
        "timeline": trends,
        "rising_keywords": rising_keywords
    }
