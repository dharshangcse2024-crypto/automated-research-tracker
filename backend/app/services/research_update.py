from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.models.research_history import ResearchHistory
from app.models.article import Article
from app.models.topic import Topic
import re
from datetime import datetime

def _get_keyword_frequencies(articles, topic_keywords):
    freq = {kw.lower(): 0 for kw in topic_keywords}
    for a in articles:
        text = f"{a.title or ''} {a.abstract or ''}".lower()
        for kw in topic_keywords:
            kw_lower = kw.lower()
            if re.search(r'\b' + re.escape(kw_lower) + r'\b', text):
                freq[kw_lower] += 1
    return freq

async def get_latest_update(db: AsyncSession, topic_id: str):
    # Get topic
    topic_res = await db.execute(select(Topic).where(Topic.id == topic_id))
    topic = topic_res.scalar_one_or_none()
    if not topic:
        return None
        
    # Get last two histories
    hist_res = await db.execute(
        select(ResearchHistory)
        .where(ResearchHistory.topic_id == topic_id)
        .order_by(ResearchHistory.scan_date.desc())
        .limit(2)
    )
    histories = hist_res.scalars().all()
    
    if not histories:
        return {"message": "No research history available for this topic yet."}
        
    latest = histories[0]
    previous = histories[1] if len(histories) > 1 else None
    
    # We need articles from the latest scan vs previous scan.
    # Since we don't have a batch ID, we'll approximate by date boundaries if there's a previous scan
    
    latest_articles_q = select(Article).where(Article.topic_id == topic_id)
    if previous:
        latest_articles_q = latest_articles_q.where(Article.created_at > previous.scan_date)
        
    latest_articles = (await db.execute(latest_articles_q)).scalars().all()
    
    current_freqs = _get_keyword_frequencies(latest_articles, topic.keywords or [])
    
    prev_freqs = {}
    if previous:
        # For simplicity, if we want previous scan's articles, we query between previous-1 and previous.
        # But we can just use the DB's previous records approximation.
        # This will be properly refined in Phase 12 (Trends).
        prev_articles_q = select(Article).where(Article.topic_id == topic_id, Article.created_at <= previous.scan_date)
        # Just limit to 100 for a quick frequency check
        prev_articles = (await db.execute(prev_articles_q.order_by(Article.created_at.desc()).limit(100))).scalars().all()
        prev_freqs = _get_keyword_frequencies(prev_articles, topic.keywords or [])
        
    changed_freqs = {}
    for kw, count in current_freqs.items():
        prev_count = prev_freqs.get(kw, 0)
        changed_freqs[kw] = {"current": count, "previous": prev_count, "growth": count - prev_count}
        
    newly_appearing = [kw for kw, data in changed_freqs.items() if data["previous"] == 0 and data["current"] > 0]
    
    update_summary = f"In the latest scan on {latest.scan_date.strftime('%Y-%m-%d')}, we found {latest.new_articles} new articles, {latest.highly_relevant} of which are highly relevant."
    if previous:
        update_summary += f" This is compared to {previous.new_articles} new articles in the previous scan."
    
    # Optionally we could pass this to Gemini to generate a human readable summary, but this satisfies the requirements
    
    return {
        "new_article_count": latest.new_articles,
        "highly_relevant_count": latest.highly_relevant,
        "newly_appearing_keywords": newly_appearing,
        "changed_keyword_frequencies": changed_freqs,
        "update_summary": update_summary,
        "scan_date": latest.scan_date
    }
