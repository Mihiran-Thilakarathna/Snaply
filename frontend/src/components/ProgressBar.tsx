import { ProgressState } from '../types'

function formatEta(seconds?: number | null): string | null {
  if (seconds === null || seconds === undefined) return null
  const m = Math.floor(seconds / 60)
  const s = Math.floor(seconds % 60)
  return `${m}:${s.toString().padStart(2, '0')} left`
}

interface Props {
  state: ProgressState
  isPaused?: boolean
  onPause?: () => void
  onResume?: () => void
  onCancel?: () => void
}

export default function ProgressBar({ state, isPaused, onPause, onResume, onCancel }: Props) {
  const isError = state.status === 'error'
  const isCancelled = state.status === 'cancelled'
  const isDone = state.status === 'done'
  const isActive = !isError && !isCancelled && !isDone
  const eta = formatEta(state.eta)

  const statusLabel = isCancelled
    ? 'Cancelled'
    : isError
    ? 'Error'
    : isPaused
    ? 'Paused'
    : state.status.charAt(0).toUpperCase() + state.status.slice(1)

  const barColor = isError || isCancelled
    ? 'bg-red-800'
    : isPaused
    ? 'bg-yellow-500'
    : 'bg-yt-red'

  return (
    <div className="space-y-2">
      {/* Status row */}
      <div className="flex items-center justify-between text-xs text-yt-gray">
        <span className={isPaused ? 'text-yellow-400' : isCancelled ? 'text-red-400' : ''}>
          {statusLabel}
        </span>
        <span className="text-white font-medium">
          {(isError || isCancelled) ? '' : `${state.progress.toFixed(0)}%`}
        </span>
      </div>

      {/* Progress bar */}
      <div className="w-full h-2 bg-yt-black rounded-full overflow-hidden">
        <div
          className={`h-full transition-all duration-300 ${barColor}`}
          style={{ width: `${Math.max(state.progress, (isError || isCancelled) ? 100 : 0)}%` }}
        />
      </div>

      {/* Speed / ETA / Error row */}
      <p className="text-xs text-yt-gray min-h-[1rem]">
        {isError && state.error}
        {isCancelled && 'Download was cancelled.'}
        {!isError && !isCancelled && !isPaused && [state.speed, eta].filter(Boolean).join(' · ')}
        {isPaused && 'Download paused — running in background.'}
      </p>

      {/* Pause / Resume / Cancel buttons — only while active */}
      {isActive && (onPause || onResume || onCancel) && (
        <div className="flex gap-2 pt-1">
          {isPaused ? (
            <button
              onClick={onResume}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-yt-surface border border-yt-border text-white hover:bg-yt-border transition-colors"
            >
              <svg viewBox="0 0 16 16" className="w-3.5 h-3.5" fill="currentColor">
                <path d="M6 3.5L12.5 8 6 12.5V3.5z" />
              </svg>
              Resume
            </button>
          ) : (
            <button
              onClick={onPause}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-yt-surface border border-yt-border text-yt-gray hover:text-white hover:bg-yt-border transition-colors"
            >
              <svg viewBox="0 0 16 16" className="w-3.5 h-3.5" fill="currentColor">
                <rect x="3" y="2.5" width="3.5" height="11" rx="1" />
                <rect x="9.5" y="2.5" width="3.5" height="11" rx="1" />
              </svg>
              Pause
            </button>
          )}
          <button
            onClick={onCancel}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-yt-surface border border-red-900 text-red-400 hover:bg-red-950 hover:text-red-300 transition-colors"
          >
            <svg viewBox="0 0 16 16" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M4 4l8 8M12 4l-8 8" strokeLinecap="round" />
            </svg>
            Cancel
          </button>
        </div>
      )}
    </div>
  )
}
