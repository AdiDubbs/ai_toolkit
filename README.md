# AI Toolkit

Full-stack playground for multimodal AI experiments. The React/Tailwind frontend provides interactive workflows while a FastAPI backend serves Florence-2 image captioning.

## Features

- **Frontend (Vite + React + Tailwind)**: Landing page that highlights available tools, drag-and-drop uploader with live preview, and a text summarization prototype.
- **Backend (FastAPI + Florence-2)**: Production-ready `/caption` endpoint backed by Florence-2-base, CORS rules tuned for the local Vite dev server, plus scripts for Apple silicon.
- **Developer tooling**: TypeScript, ESLint, shadcn UI primitives on the frontend and Python requirements with virtual environment support on the backend.

## Project Layout

- `frontend/` – Vite React app served at `http://127.0.0.1:5173`
- `backend/` – FastAPI application, Florence-2 integration, and helper scripts
- `florence_venv/` – Optional local virtual environment directory (ignored by git)

## Prerequisites

- Node.js 18+ (20 LTS recommended)
- Python 3.11+ with `pip`
- Hugging Face access token if your environment requires authentication for Florence-2 downloads

## Backend Setup

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate  # Windows: .venv\\Scripts\\activate
pip install -r requirements.txt
python florence_download.py  # Optional: pre-download Florence-2 weights
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

The API runs at `http://127.0.0.1:8000`. The `/caption` route accepts an image file via the `file` form field and returns a generated caption string.

Example request:

```bash
curl -X POST \
  -F "file=@example.jpg" \
  http://127.0.0.1:8000/caption
```

## Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The development server defaults to `http://127.0.0.1:5173`. The captioning page expects the backend at `http://127.0.0.1:8000`; update the fetch URL in `frontend/src/pages/tools/Caption.tsx` if you deploy the API elsewhere.

## API Overview

- `GET /` – Health check that returns `{ "Hello": "World" }`.
- `POST /caption` – Accepts `multipart/form-data` with an image file (`file`) and responds with `{ "caption": "<generated text>" }`.

## Next Steps

- Expand the backend with additional inference routes (summarization, audio, etc.).
- Connect the frontend text tools to live endpoints as they become available.
