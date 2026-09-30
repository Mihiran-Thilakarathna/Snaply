import { useCallback, useEffect, useRef, useState } from 'react'
import { cancelDownload, getProgress, startDownload } from '../lib/api'
import { ProgressState, VideoInfo } from '../types'
import DownloadCompleteModal from './DownloadCompleteModal'
import FormatSelector from './FormatSelector'
import ProgressBar from './ProgressBar'

interface Props {
  info: VideoInfo
  url: string
  onConvertAnother: () => void
}

export default function VideoPreviewCard({ info, url, onConvertAnother }: Props) {
  const [audioOnly, setAudioOnly] = useState(false)
  const [quality, setQuality] = useState('1080p')
  const [audioFormat, setAudioFormat] = useState('mp3')
  const [audioQuality, setAudioQuality] = useState('192')
  const [jobId, setJobId] = useState<string | null>(null)
  const [progress, setProgress] = useState<ProgressState | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const intervalRef = useRef<number | null>(null)

  const stopPolling = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }, [])

  const startPolling = useCallback((id: string) => {
    stopPolling()
    intervalRef.current = window.setInterval(async () => {
      try {
        const data = await getProgress(id)
        setProgress(data)
        if (data.status === 'done') setShowModal(true)
        if (data.status === 'done' || data.status === 'error') {
          stopPolling()
        }
      } catch {
        stopPolling()
      }
    }, 1200)
  }, [stopPolling])

  useEffect(() => {
    if (!jobId) return
    startPolling(jobId)
    return stopPolling
  }, [jobId])

  async function handleDownload() {
    setProgress({ status: 'queued', progress: 0 })
    setIsPaused(false)
    const id = await startDownload({ url, quality, audioOnly, audioFormat, audioQuality })
    setJobId(id)
  }

  function handlePause() {
    setIsPaused(true)
    stopPolling()
  }

  function handleResume() {
    if (!jobId) return
    setIsPaused(false)
    startPolling(jobId)
  }

  async function handleCancel() {
    stopPolling()
    if (jobId) {
      try { await cancelDownload(jobId) } catch { /* best effort */ }
    }
    setProgress({ status: 'cancelled', progress: progress?.progress ?? 0 })
    setIsPaused(false)
  }

  function handleTryAgain() {
    setProgress(null)
    setJobId(null)
    setIsPaused(false)
  }

  const isActiveDownload =
    progress !== null &&
    progress.status !== 'done' &&
    progress.status !== 'error' &&
    progress.status !== 'cancelled'

  return (
    <div className="bg-yt-surface border border-yt-border rounded-xl animate-fade-in-up">
      <div className="flex flex-col sm:flex-row sm:items-start gap-4 p-4">
        {info.thumbnail && (
          <div className="w-full sm:w-64 aspect-video rounded-lg overflow-hidden bg-yt-black shrink-0">
            <img src={info.thumbnail} alt={info.title} className="w-full h-full object-cover" />
          </div>
        )}
        <div className="flex-1 space-y-3 min-w-0">
          <h2 className="font-semibold text-lg">{info.title}</h2>
          <FormatSelector
            audioOnly={audioOnly}
            setAudioOnly={setAudioOnly}
            quality={quality}
            setQuality={setQuality}
            audioFormat={audioFormat}
            setAudioFormat={setAudioFormat}
            audioQuality={audioQuality}
            setAudioQuality={setAudioQuality}
            videoSizes={info.video_sizes}
            duration={info.duration}
            availableVideoQualities={info.available_video_qualities}
            availableAudioBitrates={info.available_audio_bitrates}
          />

          {/* Download button — only when no active job */}
          {!progress && (
            <button
              onClick={handleDownload}
              className="bg-gradient-to-r from-yt-red to-rose-600 hover:shadow-lg hover:shadow-yt-red/30 hover:-translate-y-0.5 text-white font-semibold px-6 py-2.5 rounded-full transition-all duration-200"
            >
              Download
            </button>
          )}

          {/* Progress bar with Pause / Cancel */}
          {isActiveDownload && (
            <ProgressBar
              state={progress}
              isPaused={isPaused}
              onPause={handlePause}
              onResume={handleResume}
              onCancel={handleCancel}
            />
          )}

          {/* Cancelled state */}
          {progress?.status === 'cancelled' && (
            <div className="flex gap-2 items-center">
              <ProgressBar state={progress} />
              <button
                onClick={handleTryAgain}
                className="ml-2 bg-yt-dark hover:bg-yt-border text-white text-sm font-medium px-4 py-1.5 rounded-full transition-colors"
              >
                Try Again
              </button>
            </div>
          )}

          {/* Error state */}
          {progress?.status === 'error' && (
            <div className="flex gap-2 items-center">
              <ProgressBar state={progress} />
              <button
                onClick={handleTryAgain}
                className="ml-2 bg-yt-dark hover:bg-yt-border text-white text-sm font-medium px-4 py-1.5 rounded-full transition-colors"
              >
                Retry
              </button>
            </div>
          )}

          {/* Done state */}
          {progress?.status === 'done' && progress.filename && !showModal && (
            <div className="flex gap-2">
              <button
                onClick={() => setShowModal(true)}
                className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-2.5 rounded-full transition-colors"
              >
                Save File
              </button>
              <button
                onClick={onConvertAnother}
                className="bg-yt-dark hover:bg-yt-border text-white font-semibold px-6 py-2.5 rounded-full transition-colors"
              >
                Convert Another
              </button>
            </div>
          )}
        </div>
      </div>

      {showModal && progress?.filename && (
        <DownloadCompleteModal
          filename={progress.filename}
          title={info.title}
          onClose={() => setShowModal(false)}
          onConvertAnother={onConvertAnother}
        />
      )}
    </div>
  )
}
