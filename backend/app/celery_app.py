from celery import Celery

from app.config import settings

celery_app = Celery(
    "snaply",
    broker=settings.redis_url,
    backend=settings.redis_url,
    include=["app.tasks"],
)
celery_app.conf.task_track_started = True
