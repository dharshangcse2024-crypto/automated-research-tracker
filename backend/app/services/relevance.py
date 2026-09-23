from app.models.topic import Topic
import re

def calculate_relevance(topic: Topic, article_data) -> tuple[float, str]:
    score = 0.0
    
    topic_keywords = [k.lower() for k in topic.keywords] if topic.keywords else []
    topic_category = topic.category.lower() if topic.category else ""
    
    title = article_data.title.lower() if article_data.title else ""
    abstract = article_data.abstract.lower() if article_data.abstract else ""
    article_category = getattr(article_data, 'category', '').lower() if getattr(article_data, 'category', None) else ""
    
    for kw in topic_keywords:
        # Check exact word boundary matches to avoid partial word matches
        pattern = r'\b' + re.escape(kw) + r'\b'
        if re.search(pattern, title):
            score += 30.0
        if re.search(pattern, abstract):
            score += 15.0
            
    if topic_category and article_category and topic_category == article_category:
        score += 20.0
        
    score = min(score, 100.0)
    
    if score >= 80:
        label = "Highly Relevant"
    elif score >= 60:
        label = "Relevant"
    elif score >= 40:
        label = "Possibly Relevant"
    else:
        label = "Low Relevance"
        
    return score, label
