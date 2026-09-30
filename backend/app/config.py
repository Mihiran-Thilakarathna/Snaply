from pathlib import Path
from typing import Optional

from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    download_dir: Path = Path("downloads")
    redis_url: str = "redis://localhost:6379/0"
    cors_origins: list[str] = ["http://localhost:5173"]
    file_ttl_minutes: int = 180
    ffmpeg_location: Optional[str] = None

    class Config:
        env_file = ".env"


settings = Settings()
settings.download_dir.mkdir(parents=True, exist_ok=True)

if settings.ffmpeg_location is None:
    _bundled_ffmpeg = Path(__file__).resolve().parent.parent / "bin" / "ffmpeg.exe"
    if _bundled_ffmpeg.exists():
        settings.ffmpeg_location = str(_bundled_ffmpeg)
