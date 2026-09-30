import { ProgressState, VideoInfo } from '../types'

const API_BASE = '/api'

export async function fetchVideoInfo(url: string): Promise<VideoInfo> {
  const res = await fetch(`${API_BASE}/info?url=${encodeURIComponent(url)}`)
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(body.detail ?? 'Failed to fetch video info')
  }
  return res.json()
}

export interface DownloadOptions {
  url: string
  quality: string
  audioOnly: boolean
  audioFormat: string
  audioQuality: string
}

export async function startDownload(opts: DownloadOptions): Promise<string> {
  const res = await fetch(`${API_BASE}/download`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      url: opts.url,
      quality: opts.quality,
      audio_only: opts.audioOnly,
      audio_format: opts.audioFormat,
      audio_quality: opts.audioQuality,
    }),
  })
  if (!res.ok) throw new Error('Failed to start download')
  const data = await res.json()
  return data.job_id as string
}

export async function startPlaylistDownload(
  urls: string[],
  opts: Omit<DownloadOptions, 'url'>
): Promise<string[]> {
  const res = await fetch(`${API_BASE}/download/playlist`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      urls,
      quality: opts.quality,
      audio_only: opts.audioOnly,
      audio_format: opts.audioFormat,
      audio_quality: opts.audioQuality,
    }),
  })
  if (!res.ok) throw new Error('Failed to start playlist download')
  const data = await res.json()
  return data.job_ids as string[]
}

export async function getProgress(jobId: string): Promise<ProgressState> {
  const res = await fetch(`${API_BASE}/progress/${jobId}`)
  if (!res.ok) throw new Error('Failed to fetch progress')
  return res.json()
}

export function fileUrl(filename: string): string {
  return `${API_BASE}/file/${filename}`
}

export async function cancelDownload(jobId: string): Promise<void> {
  await fetch(`${API_BASE}/cancel/${jobId}`, { method: 'DELETE' })
}
