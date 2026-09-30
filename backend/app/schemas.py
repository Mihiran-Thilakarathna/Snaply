from typing import Optional

from pydantic import BaseModel


class PlaylistItem(BaseModel):
    id: str
    title: str
    url: str
    thumbnail: Optional[str] = None


class VideoInfoResponse(BaseModel):
    id: str
    title: str
    thumbnail: Optional[str] = None
    duration: Optional[int] = None
    is_playlist: bool = False
    playlist_items: list[PlaylistItem] = []
    video_sizes: dict[str, int] = {}
    available_video_qualities: list[str] = []
    available_audio_bitrates: list[str] = []


class DownloadRequest(BaseModel):
    url: str
    quality: Optional[str] = "1080p"
    audio_only: bool = False
    audio_format: str = "mp3"
    audio_quality: str = "192"


class PlaylistDownloadRequest(BaseModel):
    urls: list[str]
    quality: Optional[str] = "1080p"
    audio_only: bool = False
    audio_format: str = "mp3"
    audio_quality: str = "192"


class JobResponse(BaseModel):
    job_id: str


class PlaylistJobResponse(BaseModel):
    job_ids: list[str]


class ProgressResponse(BaseModel):
    status: str
    progress: float = 0.0
    filename: Optional[str] = None
    error: Optional[str] = None
    speed: Optional[str] = None
    eta: Optional[int] = None
