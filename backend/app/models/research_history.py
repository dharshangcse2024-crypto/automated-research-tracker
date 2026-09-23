from sqlalchemy import Column, String, Text, Integer, DateTime, ForeignKey, ARRAY
from sqlalchemy.orm import relationship
import uuid
from datetime import datetime, timezone
from app.database import Base

class ResearchHistory(Base):
    __tablename__ = "research_history"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    topic_id = Column(String, ForeignKey("topics.id", ondelete="CASCADE"), nullable=False)
    scan_date = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    articles_found = Column(Integer, default=0)
    new_articles = Column(Integer, default=0)
    duplicates_removed = Column(Integer, default=0)
    highly_relevant = Column(Integer, default=0)
    emerging_keywords = Column(ARRAY(String), default=[])
    update_summary = Column(Text, nullable=True)

    topic = relationship("Topic", back_populates="history")
