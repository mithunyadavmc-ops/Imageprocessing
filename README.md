<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/b709f8c9-7d08-4df7-9e0a-1cc213717dc3

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

## Production Deployment (Vercel Frontend + Render Backend)

To get the same output quality as local, deploy the full Node backend pipeline separately and point Vercel frontend to it.

### 1. Deploy backend on Render

This repository includes [render.yaml](render.yaml) for backend deployment.

Backend settings:
- Build command: `npm install && npm run build`
- Start command: `npm run start`
- Runtime: Node

Required backend environment variables:
- `GEMINI_API_KEY=<your_api_key>`
- `CORS_ORIGIN=https://<your-vercel-domain>.vercel.app`

### 2. Configure Vercel frontend

Set this environment variable in Vercel project settings:
- `VITE_API_BASE_URL=https://<your-render-backend-domain>`

Then redeploy Vercel.

### 3. Verify API routing

After redeploy, browser network requests for analysis must go to your backend domain, for example:
- `https://<your-render-backend-domain>/api/upload`
- `https://<your-render-backend-domain>/api/status/...`
- `https://<your-render-backend-domain>/api/results/...`

If `VITE_API_BASE_URL` is missing on Vercel, the frontend now shows an explicit configuration error instead of silently running a reduced path.

## Deployment Failure Root Cause (Resolved)

The primary production failure (`FUNCTION_INVOCATION_FAILED`) was caused by oversized serverless responses and payload pressure during `/api/upload` handling.

What failed in deployment:
- The upload API returned the full base64 image in the response report payload (`image_url`), which can exceed serverless response limits.
- Large base64 upload payloads can also trigger memory/size pressure in serverless runtime.

What was fixed:
- `/api/upload` no longer returns base64 image content in serverless report responses.
- Client-side upload compression/downscale enforces a strict serverless-safe payload budget.
- Upload API enforces payload size checks and returns structured errors.
- API routes now return structured error JSON with step and solution guidance.
- Vercel function limits are explicitly configured in [vercel.json](vercel.json).
