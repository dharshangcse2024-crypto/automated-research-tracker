from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import text
from app.database import get_db

from app.routes.research import router as research_router
from app.routes.articles import router as articles_router, topic_articles_router
from app.routes.history import router as history_router
from app.routes.topics import router as topics_router

from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="Automated Research Tracker API",
    description="Backend API for intelligent research tracking",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://automated-research-tracker.vercel.app",
        "http://localhost:5173",
        "http://localhost:3000"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def root():
    return {
        "message": "Automated Research Tracker API is running"
    }

@app.get("/health")
def health_check():
    return {
        "status": "healthy"
    }

@app.get("/health/database")
async def health_database(db: AsyncSession = Depends(get_db)):
    try:
        result = await db.execute(text("SELECT 1"))
        if result.scalar() == 1:
            return {"status": "healthy", "database": "connected"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database connection failed: {str(e)}")

app.include_router(topics_router)
app.include_router(history_router)
app.include_router(articles_router)
app.include_router(topic_articles_router)
app.include_router(research_router)
