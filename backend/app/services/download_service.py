from pathlib import Path
from typing import Callable, Optional

import yt_dlp

from app.config import settings
from app.services.ytdlp_service import VIDEO_HEIGHTS

UpdateFn = Callable[..., None]


def _format_speed(bytes_per_sec: Optional[float]) -> Optional[str]:
    if not bytes_per_sec:
        return None
    mb_per_sec = bytes_per_sec / (1024 * 1024)
    if mb_per_sec >= 1:
        return f"{mb_per_sec:.1f} MB/s"
    return f"{bytes_per_sec / 1024:.0f} KB/s"


def _progress_hook_factory(update_fn: UpdateFn):
    def hook(d: dict):
        if d["status"] == "downloading":
            total = d.get("total_bytes") or d.get("total_bytes_estimate") or 0
            downloaded = d.get("downloaded_bytes", 0)
            pct = (downloaded / total * 100) if total else 0
            update_fn(
                status="downloading",
                progress=round(pct, 1),
                speed=_format_speed(d.get("speed")),
                eta=d.get("eta"),
            )
        elif d["status"] == "finished":
            update_fn(status="processing", progress=100)

    return hook


def _base_opts() -> dict:
    opts = {"quiet": True, "no_warnings": True}
    if settings.ffmpeg_location:
        opts["ffmpeg_location"] = settings.ffmpeg_location
    return opts


def download_video(url: str, quality: Optional[str], job_id: str, update_fn: UpdateFn) -> str:
    height = VIDEO_HEIGHTS.get(quality or "1080p", 1080)
    outtmpl = str(settings.download_dir / f"{job_id}.%(ext)s")
    opts = {
        **_base_opts(),
        "format": f"bestvideo[height<={height}]+bestaudio/best[height<={height}]/best",
        "merge_output_format": "mp4",
        "outtmpl": outtmpl,
        "progress_hooks": [_progress_hook_factory(update_fn)],
    }
    with yt_dlp.YoutubeDL(opts) as ydl:
        ydl.extract_info(url, download=True)
    return f"{job_id}.mp4"


def download_audio(
    url: str, audio_format: str, audio_quality: str, job_id: str, update_fn: UpdateFn
) -> str:
    outtmpl = str(settings.download_dir / f"{job_id}.%(ext)s")
    opts = {
        **_base_opts(),
        "format": "bestaudio/best",
        "outtmpl": outtmpl,
        "postprocessors": [
            {
                "key": "FFmpegExtractAudio",
                "preferredcodec": audio_format,
                "preferredquality": audio_quality,
            }
        ],
        "progress_hooks": [_progress_hook_factory(update_fn)],
    }
    with yt_dlp.YoutubeDL(opts) as ydl:
        ydl.extract_info(url, download=True)
    return f"{job_id}.{audio_format}"
