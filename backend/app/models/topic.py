from sqlalchemy import Column, String, Text, Boolean, DateTime, ARRAY
from sqlalchemy.orm import relationship
import uuid
from datetime import datetime, timezone
from app.database import Base

class Topic(Base):
    __tablename__ = "topics"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    category = Column(String, nullable=True)
    keywords = Column(ARRAY(String), default=[])
    sources = Column(ARRAY(String), default=[])
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))
    last_scanned_at = Column(DateTime(timezone=True), nullable=True)

    articles = relationship("Article", back_populates="topic", cascade="all, delete-orphan")
    history = relationship("ResearchHistory", back_populates="topic", cascade="all, delete-orphan")
    trends = relationship("ResearchTrend", back_populates="topic", cascade="all, delete-orphan")
