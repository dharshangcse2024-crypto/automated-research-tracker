from sqlalchemy import Column, String, Text, Float, DateTime, ForeignKey
from sqlalchemy.orm import relationship
import uuid
from datetime import datetime, timezone
from app.database import Base

class Article(Base):
    __tablename__ = "articles"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    topic_id = Column(String, ForeignKey("topics.id", ondelete="CASCADE"), nullable=False)
    title = Column(String, nullable=False)
    authors = Column(String, nullable=True)
    abstract = Column(Text, nullable=True)
    url = Column(String, nullable=True)
    source = Column(String, nullable=True)
    external_id = Column(String, nullable=True)
    doi = Column(String, nullable=True)
    published_date = Column(DateTime(timezone=True), nullable=True)
    category = Column(String, nullable=True)
    relevance_score = Column(Float, nullable=True)
    relevance_label = Column(String, nullable=True)
    summary = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))

    topic = relationship("Topic", back_populates="articles")
