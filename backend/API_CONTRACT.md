# Automated Research Tracker - API Contract

This document outlines the REST API endpoints available in the backend of the Automated Research Tracker.

## Base URL
`http://localhost:8000` (Default local deployment)

---

## 1. System Health
Endpoints to verify system and database stability.

### `GET /`
Returns a basic welcome message confirming the API is running.
- **Response**: `{"message": "Automated Research Tracker API is running"}`

### `GET /health`
Returns the operational status of the FastAPI server.
- **Response**: `{"status": "healthy"}`

### `GET /health/database`
Verifies the asynchronous PostgreSQL connection via SQLAlchemy.
- **Response**: `{"status": "healthy", "database": "connected"}`

---

## 2. Topic Management
Manage the research topics that the system tracks.

### `GET /api/topics`
Retrieves a list of all active research topics.
- **Response**: Array of `TopicResponse` objects.

### `POST /api/topics`
Creates a new research topic.
- **Body (`TopicCreate`)**: `name`, `description`, `keywords` (array), `category`.
- **Response**: The newly created `TopicResponse` object.

### `GET /api/topics/{topic_id}`
Retrieves a specific topic by its UUID.
- **Response**: `TopicResponse` object.

### `PUT /api/topics/{topic_id}`
Updates an existing topic.
- **Body (`TopicUpdate`)**: Optional fields (`name`, `description`, `keywords`, `category`, `is_active`).
- **Response**: The updated `TopicResponse` object.

### `DELETE /api/topics/{topic_id}`
Soft-deletes or completely removes a topic.
- **Response**: `204 No Content`.

---

## 3. Article Retrieval
Access the articles downloaded and processed by the system.

### `GET /api/articles`
Retrieves a global list of all collected articles.
- **Response**: Array of `ArticleResponse` objects.

### `GET /api/articles/{article_id}`
Retrieves a specific article by its UUID.
- **Response**: `ArticleResponse` object including its AI summary and relevance scores.

### `GET /api/topics/{topic_id}/articles`
Retrieves all articles associated with a specific topic.
- **Response**: Array of `ArticleResponse` objects.

---

## 4. Research Analytics & Insights
Endpoints that deliver the processed intelligence and historical data.

### `GET /api/topics/{topic_id}/history`
Retrieves the chronological timeline of research scans for a topic.
- **Response**: Array of `ResearchHistoryResponse` objects detailing duplicates ignored, highly relevant papers found, etc.

### `GET /api/topics/{topic_id}/latest-update`
Generates a "What's New" comparison between the most recent scan and the previous one.
- **Response**: JSON containing new article counts, newly appearing keywords, keyword frequency changes, and an automated text summary.

### `GET /api/topics/{topic_id}/trends`
Calculates keyword popularity over time.
- **Response**: JSON containing a chronological `timeline` of keyword frequencies over the last N scans, and an array of mathematically `rising_keywords`.

### `GET /api/topics/{topic_id}/underexplored`
Identifies gaps in current research.
- **Response**: JSON listing keywords that are either completely unexplored (0 articles) or have a very low volume but high average relevance score.

---

## 5. Ingestion Pipeline (n8n Webhook)
The core endpoint used by external automations to feed data into the system.

### `POST /api/research/collect`
Accepts a payload of newly scraped articles, passing them through the intelligence pipeline:
1. **Duplicate Detection**: Filters exact matches and high-similarity titles.
2. **Relevance Scoring**: Grades the article based on topic keywords and categories.
3. **AI Summarization**: Uses Gemini 2.5 Flash to generate a short summary, key contribution, and keywords.
4. **History Logging**: Records the scan execution statistics.

- **Body (`ResearchCollectPayload`)**: 
  - `topic_id`: UUID
  - `articles`: Array of `CollectedArticle` objects (`title`, `abstract`, `authors`, `url`, `doi`, etc.)
- **Response**: `ResearchCollectResponse` detailing the number of articles successfully ingested versus ignored as duplicates.
