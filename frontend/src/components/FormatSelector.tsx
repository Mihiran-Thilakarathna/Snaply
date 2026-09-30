import { useEffect } from 'react'
import { estimateAudioBytes, estimateVideoBytes, formatBytes } from '../lib/utils'
import Dropdown from './Dropdown'

const ALL_VIDEO_QUALITIES = [
  { value: '2160p', label: '2160p (4K)' },
  { value: '1440p', label: '1440p (QHD)' },
  { value: '1080p', label: '1080p (Full HD)' },
  { value: '720p', label: '720p (HD)' },
  { value: '480p', label: '480p' },
  { value: '360p', label: '360p' },
  { value: '144p', label: '144p' },
]

const AUDIO_FORMATS = ['mp3', 'm4a', 'aac', 'opus', 'wav', 'flac']
const ALL_AUDIO_QUALITIES = ['320', '256', '192', '128', '96']

interface Props {
  audioOnly: boolean
  setAudioOnly: (v: boolean) => void
  quality: string
  setQuality: (v: string) => void
  audioFormat: string
  setAudioFormat: (v: string) => void
  audioQuality: string
  setAudioQuality: (v: string) => void
  videoSizes?: Record<string, number>
  duration?: number | null
  availableVideoQualities?: string[]
  availableAudioBitrates?: string[]
}

export default function FormatSelector({
  audioOnly,
  setAudioOnly,
  quality,
  setQuality,
  audioFormat,
  setAudioFormat,
  audioQuality,
  setAudioQuality,
  videoSizes = {},
  duration,
  availableVideoQualities,
  availableAudioBitrates,
}: Props) {
  // Use all available qualities regardless of backend available list
  const filteredVideoQualities = ALL_VIDEO_QUALITIES
  const filteredAudioQualities = ALL_AUDIO_QUALITIES

  // Auto-select best available video quality
  useEffect(() => {
    if (filteredVideoQualities.length > 0 && !filteredVideoQualities.find((q) => q.value === quality)) {
      setQuality(filteredVideoQualities[0].value)
    }
  }, [availableVideoQualities, quality, setQuality])

  // Auto-select best available audio bitrate
  useEffect(() => {
    if (filteredAudioQualities.length > 0 && !filteredAudioQualities.includes(audioQuality)) {
      setAudioQuality(filteredAudioQualities[0])
    }
  }, [availableAudioBitrates])

  const videoOptions = filteredVideoQualities.map((q) => ({
    value: q.value,
    label: q.label,
    hint: formatBytes(videoSizes[q.value] || estimateVideoBytes(duration, q.value)),
  }))

  const audioFormatOptions = AUDIO_FORMATS.map((f) => ({ value: f, label: f.toUpperCase() }))

  const audioQualityOptions = filteredAudioQualities.map((q) => ({
    value: q,
    label: `${q} kbps`,
    hint: formatBytes(estimateAudioBytes(duration, q)),
  }))

  return (
    <div className="bg-yt-dark border border-yt-border rounded-xl p-4 space-y-4">
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setAudioOnly(false)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            !audioOnly ? 'bg-yt-red text-white' : 'bg-yt-surface text-yt-gray'
          }`}
        >
          Video
        </button>
        <button
          type="button"
          onClick={() => setAudioOnly(true)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            audioOnly ? 'bg-yt-red text-white' : 'bg-yt-surface text-yt-gray'
          }`}
        >
          MP3 / Audio
        </button>
      </div>

      {!audioOnly ? (
        <>
          <Dropdown label="Video Quality" value={quality} options={videoOptions} onChange={setQuality} />
          <SizeBadge value={formatBytes(videoSizes[quality] || estimateVideoBytes(duration, quality))} />
        </>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-3">
            <Dropdown label="Audio Format" value={audioFormat} options={audioFormatOptions} onChange={setAudioFormat} />
            <Dropdown label="Bitrate" value={audioQuality} options={audioQualityOptions} onChange={setAudioQuality} />
          </div>
          <SizeBadge value={formatBytes(estimateAudioBytes(duration, audioQuality))} />
        </>
      )}
    </div>
  )
}

function SizeBadge({ value }: { value: string | null }) {
  if (!value) return null
  return (
    <p className="flex items-center gap-1.5 text-sm text-yt-gray">
      <svg viewBox="0 0 20 20" className="w-4 h-4 text-yt-red shrink-0" fill="none">
        <path
          d="M10 3v10m0 0l-3.5-3.5M10 13l3.5-3.5M4 16h12"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      Estimated size: <span className="text-white font-medium">{value}</span>
    </p>
  )
}
