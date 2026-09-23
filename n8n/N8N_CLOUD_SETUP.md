# n8n Cloud Integration Setup

## 1. How the n8n Cloud Workflow Connects to FastAPI
The existing workflow (`n8n/workflows/Research_Pipeline.json`) orchestrates the automated research collection:
- It triggers daily.
- It calls the FastAPI backend to fetch active topics.
- It queries the public Crossref API for research matching those topics.
- It formats and POSTs the articles back to the FastAPI backend.

**Crucially, since you are using n8n Cloud, n8n cannot reach local servers (e.g. `localhost`, `127.0.0.1`, `host.docker.internal`) directly.**

## 2. Public HTTPS Backend URL Required
To allow n8n Cloud to push and pull data, your FastAPI backend must be accessible over the internet via a public HTTPS URL (e.g., `https://api.yourdomain.com` or a tunnel like ngrok/Cloudflare Tunnels).

## 3. Configuration in n8n Cloud
The `Research_Pipeline.json` has been updated to use the `BACKEND_API_URL` variable.
1. In n8n Cloud, go to **Settings > Variables**.
2. Add a new variable:
   - **Name**: `BACKEND_API_URL`
   - **Value**: Your public FastAPI URL (e.g., `https://my-fastapi-app.onrender.com`)
3. Import the `Research_Pipeline.json` into a new workflow.

## 4. API Endpoints Used by n8n
- `GET /api/topics` - To retrieve the list of active topics to search.
- `POST /api/research/collect` - To push the found articles back to your database.

## 5. How to Test the Workflow
1. Start your FastAPI server locally and expose it publicly (e.g., `ngrok http 8000`).
2. Update the `BACKEND_API_URL` variable in n8n Cloud to the ngrok HTTPS URL.
3. In n8n Cloud, open the workflow and click **Test Workflow**.
4. Check the FastAPI console logs to verify that the endpoints are being hit.

## 6. Current Status limitation
**FastAPI is currently local, so n8n Cloud cannot reach it yet.** Until you deploy the backend or expose it via a tunnel, running the workflow in n8n Cloud will result in connection timeouts or "Connection Refused" errors.
