from app.celery_app import celery_app
from app.services import download_service


@celery_app.task(bind=True)
def download_media_task(
    self, url: str, quality: str, audio_only: bool, audio_format: str, audio_quality: str
):
    job_id = self.request.id

    def update(status: str, progress: float = 0, speed=None, eta=None):
        self.update_state(
            state="PROGRESS",
            meta={"status": status, "progress": progress, "speed": speed, "eta": eta},
        )

    try:
        if audio_only:
            filename = download_service.download_audio(
                url, audio_format, audio_quality, job_id, update
            )
        else:
            filename = download_service.download_video(url, quality, job_id, update)
        return {"status": "done", "progress": 100, "filename": filename}
    except Exception as e:
        return {"status": "error", "progress": 0, "error": str(e)}
