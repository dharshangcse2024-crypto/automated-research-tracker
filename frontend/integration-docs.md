# Frontend Backend Integration

This document explains how the React frontend connects to the FastAPI backend.

## Environment Configuration

The frontend uses Vite's environment variables to configure the API connection. 
This is managed in `frontend/.env`:

```env
VITE_API_BASE_URL=https://petty-affidavit-scrimmage.ngrok-free.dev
```

In the codebase, this is accessed via `import.meta.env.VITE_API_BASE_URL` and passed into an Axios client instance (`src/api/index.ts`).

## Backend Requirements

Because the backend is running on another team member's laptop, they are exposing it via an **ngrok** tunnel (`https://petty-affidavit-scrimmage.ngrok-free.dev`).

For the frontend to work during development, the backend laptop must have:
1. **FastAPI running**
2. **ngrok running** (forwarding to the FastAPI port)

*Note: ngrok URLs are temporary. Do not use this URL for production deployment.*

## Axios Client & ngrok Warning

The centralized Axios client in `src/api/index.ts` automatically injects the `ngrok-skip-browser-warning: true` header into all requests. This allows the frontend to fetch JSON directly without being intercepted by ngrok's HTML warning page.

## Available Endpoints Connected

The following endpoints are connected and used by the frontend:

- `GET /health` (or `GET /health/database`) - Used to verify connection status.
- `GET /api/topics` - Connected in `src/pages/MyResearch.tsx` to list active research topics.
- `GET /api/articles` - Connected in `src/pages/Updates.tsx` to list collected research articles.
