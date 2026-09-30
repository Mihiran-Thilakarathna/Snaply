from celery.result import AsyncResult
from fastapi import APIRouter, HTTPException
from fastapi.responses import FileResponse

from app.celery_app import celery_app
from app.config import settings
from app.schemas import (
    DownloadRequest,
    JobResponse,
    PlaylistDownloadRequest,
    PlaylistItem,
    PlaylistJobResponse,
    ProgressResponse,
    VideoInfoResponse,
)
from app.services import ytdlp_service
from app.tasks import download_media_task

router = APIRouter(prefix="/api")


@router.get("/info", response_model=VideoInfoResponse)
def get_info(url: str):
    if not ytdlp_service.is_valid_youtube_url(url):
        raise HTTPException(400, "That doesn't look like a valid YouTube video or playlist link.")

    try:
        info = ytdlp_service.extract_info(url)
    except Exception:
        raise HTTPException(
            400,
            "Couldn't load this video. It may be private, age-restricted, region-locked, or unavailable.",
        )

    if ytdlp_service.is_playlist(info):
        items = [
            PlaylistItem(
                id=entry["id"],
                title=entry.get("title", "Untitled"),
                url=entry.get("url") or f"https://www.youtube.com/watch?v={entry['id']}",
                thumbnail=ytdlp_service.best_thumbnail(entry),
            )
            for entry in info.get("entries", [])
            if entry
        ]
        return VideoInfoResponse(
            id=info.get("id", ""),
            title=info.get("title", "Playlist"),
            thumbnail=items[0].thumbnail if items else None,
            duration=None,
            is_playlist=True,
            playlist_items=items,
        )

    return VideoInfoResponse(
        id=info["id"],
        title=info.get("title", ""),
        thumbnail=ytdlp_service.best_thumbnail(info),
        duration=info.get("duration"),
        is_playlist=False,
        video_sizes=ytdlp_service.estimate_video_sizes(info),
        available_video_qualities=ytdlp_service.get_available_video_qualities(info),
        available_audio_bitrates=ytdlp_service.get_available_audio_bitrates(info),
    )


@router.post("/download", response_model=JobResponse)
def start_download(req: DownloadRequest):
    task = download_media_task.delay(
        req.url, req.quality, req.audio_only, req.audio_format, req.audio_quality
    )
    return JobResponse(job_id=task.id)


@router.post("/download/playlist", response_model=PlaylistJobResponse)
def start_playlist_download(req: PlaylistDownloadRequest):
    job_ids = [
        download_media_task.delay(
            url, req.quality, req.audio_only, req.audio_format, req.audio_quality
        ).id
        for url in req.urls
    ]
    return PlaylistJobResponse(job_ids=job_ids)


@router.get("/progress/{job_id}", response_model=ProgressResponse)
def get_progress(job_id: str):
    result = AsyncResult(job_id, app=celery_app)

    if result.state == "PENDING":
        return ProgressResponse(status="queued", progress=0)
    if result.state == "PROGRESS":
        meta = result.info or {}
        return ProgressResponse(
            status=meta.get("status", "downloading"),
            progress=meta.get("progress", 0),
            speed=meta.get("speed"),
            eta=meta.get("eta"),
        )
    if result.state == "SUCCESS":
        data = result.result
        if data.get("status") == "error":
            return ProgressResponse(status="error", progress=0, error=data.get("error"))
        return ProgressResponse(status="done", progress=100, filename=data.get("filename"))
    if result.state == "FAILURE":
        return ProgressResponse(status="error", progress=0, error=str(result.info))

    return ProgressResponse(status="downloading", progress=0)


@router.get("/file/{filename}")
def get_file(filename: str):
    path = settings.download_dir / filename
    if not path.exists():
        raise HTTPException(404, "File not found or expired")
    return FileResponse(path, filename=filename, media_type="application/octet-stream")


@router.delete("/cancel/{job_id}")
def cancel_job(job_id: str):
    """Revoke a running Celery download task and clean up any partial files."""
    celery_app.control.revoke(job_id, terminate=True)
    # Clean up any partial files left by yt-dlp
    for partial in settings.download_dir.glob(f"{job_id}*"):
        try:
            partial.unlink()
        except Exception:
            pass
    return {"status": "cancelled"}
