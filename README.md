# Snaply

YouTube video (up to 4K) and MP3/audio downloader with playlist batch-download support.

## Stack

- **Backend:** FastAPI, yt-dlp, ffmpeg, Celery, Redis
- **Frontend:** React (Vite) + TypeScript + Tailwind CSS

## Project Structure

```
Snaply/
├─ backend/
│  ├─ app/
│  │  ├─ api/routes.py        # /api/info, /api/download, /api/progress, /api/file
│  │  ├─ services/            # yt-dlp + ffmpeg logic
│  │  ├─ tasks.py             # Celery download task
│  │  ├─ celery_app.py
│  │  ├─ config.py
│  │  └─ main.py
│  ├─ requirements.txt
│  └─ Dockerfile
├─ frontend/
│  ├─ src/
│  │  ├─ components/          # UrlInput, FormatSelector, VideoPreviewCard, PlaylistView, ProgressBar
│  │  ├─ lib/api.ts
│  │  ├─ types/
│  │  └─ App.tsx
│  ├─ package.json
│  └─ Dockerfile
└─ docker-compose.yml
```

## Local Development (without Docker)

**Prerequisites:** Python 3.11+, Node 20+, ffmpeg installed and on PATH, Redis running locally.

### 1. Redis (quickest via Docker)
```bash
docker run -p 6379:6379 redis:7-alpine
```

### 2. Backend
```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
copy .env.example .env
uvicorn app.main:app --reload --port 8000
```

### 3. Celery worker (separate terminal, same venv)
```bash
cd backend
venv\Scripts\activate
celery -A app.celery_app worker --loglevel=info --pool=solo
```
(`--pool=solo` is needed on Windows.)

### 4. Frontend
```bash
cd frontend
npm install
npm run dev
```

Open http://localhost:5173

## Run Everything With Docker

```bash
docker-compose up --build
```

- Frontend → http://localhost:5173
- Backend → http://localhost:8000

## Notes

- Downloaded files are stored in `backend/downloads/` and should be periodically cleaned up (see hosting guide — add a cron job deleting files older than a few hours).
- Audio bitrate is decoupled from video resolution tiers and exposed directly (320/256/192/128/96 kbps) since that reflects what yt-dlp/ffmpeg actually control.
- Respect YouTube's Terms of Service and applicable copyright law in your jurisdiction before deploying this publicly.
