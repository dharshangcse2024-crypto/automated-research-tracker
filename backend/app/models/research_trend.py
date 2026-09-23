from sqlalchemy import Column, String, Float, DateTime, ForeignKey, Integer
from sqlalchemy.orm import relationship
import uuid
from datetime import datetime, timezone
from app.database import Base

class ResearchTrend(Base):
    __tablename__ = "research_trends"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    topic_id = Column(String, ForeignKey("topics.id", ondelete="CASCADE"), nullable=False)
    keyword = Column(String, nullable=False)
    previous_frequency = Column(Integer, default=0)
    current_frequency = Column(Integer, default=0)
    growth_percentage = Column(Float, default=0.0)
    detected_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))

    topic = relationship("Topic", back_populates="trends")
