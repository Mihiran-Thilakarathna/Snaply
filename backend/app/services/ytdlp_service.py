import re
from typing import Optional
from urllib.parse import urlparse

import yt_dlp

VIDEO_HEIGHTS = {
    "2160p": 2160,
    "1440p": 1440,
    "1080p": 1080,
    "720p": 720,
    "480p": 480,
    "360p": 360,
    "144p": 144,
}

YOUTUBE_HOSTS = {
    "youtube.com",
    "www.youtube.com",
    "m.youtube.com",
    "music.youtube.com",
    "youtu.be",
}


def is_valid_youtube_url(url: str) -> bool:
    try:
        parsed = urlparse(url if "://" in url else f"https://{url}")
    except ValueError:
        return False
    host = (parsed.netloc or "").lower()
    if host not in YOUTUBE_HOSTS:
        return False
    if host == "youtu.be":
        return bool(re.match(r"^/[\w-]{6,}", parsed.path))
    return "v=" in parsed.query or "/playlist" in parsed.path or "/shorts/" in parsed.path


def extract_info(url: str) -> dict:
    # extract_flat='in_playlist' skips full per-video metadata when the URL is a
    # playlist, which is the difference between a listing that returns in ~1s
    # and one that takes 20s+ for a 15-video playlist. It has no effect on a
    # single-video URL, so it's always safe to pass.
    opts = {
        "quiet": True,
        "no_warnings": True,
        "skip_download": True,
        "extract_flat": "in_playlist",
    }
    with yt_dlp.YoutubeDL(opts) as ydl:
        return ydl.extract_info(url, download=False)


def is_playlist(info: dict) -> bool:
    return info.get("_type") == "playlist" or "entries" in info


def best_thumbnail(info: dict) -> Optional[str]:
    thumbs = info.get("thumbnails") or []
    if not thumbs:
        return info.get("thumbnail")
    best = max(thumbs, key=lambda t: (t.get("width") or 0) * (t.get("height") or 0))
    return best.get("url") or info.get("thumbnail")


def get_available_video_qualities(info: dict) -> list[str]:
    """Return quality labels (e.g. '1080p') that actually exist in the format list."""
    formats = info.get("formats") or []
    available_heights: set[int] = set()
    for f in formats:
        h = f.get("height")
        if h and f.get("vcodec") not in (None, "none"):
            available_heights.add(h)
    return [
        label
        for label, height in VIDEO_HEIGHTS.items()
        if height in available_heights
    ]


def get_available_audio_bitrates(info: dict) -> list[str]:
    """Return audio bitrate labels that make sense given the best audio stream's abr."""
    formats = info.get("formats") or []
    audio_only = [
        f for f in formats
        if f.get("vcodec") in (None, "none") and f.get("acodec") not in (None, "none")
    ]
    if not audio_only:
        # Fallback: video has muxed audio, offer all standard bitrates
        return ["320", "256", "192", "128", "96"]
    best_abr = max((f.get("abr") or 0 for f in audio_only), default=0)
    all_bitrates = ["320", "256", "192", "128", "96"]
    if best_abr <= 0:
        return all_bitrates
    # Only offer bitrates up to the source bitrate (no point upscaling)
    return [b for b in all_bitrates if int(b) <= int(best_abr) + 16] or all_bitrates


def estimate_video_sizes(info: dict) -> dict[str, int]:
    formats = info.get("formats") or []
    audio_only = [f for f in formats if f.get("vcodec") in (None, "none") and f.get("acodec") not in (None, "none")]
    best_audio_size = max(
        (f.get("filesize") or f.get("filesize_approx") or 0 for f in audio_only), default=0
    )

    sizes: dict[str, int] = {}
    for label, height in VIDEO_HEIGHTS.items():
        # Include all heights that have a matching video stream (size may be 0 if unknown)
        matches = [
            f
            for f in formats
            if f.get("height") == height
            and f.get("vcodec") not in (None, "none")
        ]
        if not matches:
            continue
        best = max(matches, key=lambda f: f.get("tbr") or 0)
        video_size = best.get("filesize") or best.get("filesize_approx") or 0
        
        # If yt-dlp doesn't know the video size, do not return just the audio size!
        # This prevents 4K videos from showing up as 4MB.
        if video_size == 0:
            continue
            
        total = int(video_size + best_audio_size)
        if total > 0:
            sizes[label] = total
    return sizes
