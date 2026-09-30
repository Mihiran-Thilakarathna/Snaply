export function formatBytes(bytes?: number | null): string | null {
  if (!bytes || bytes <= 0) return null
  const units = ['B', 'KB', 'MB', 'GB']
  let value = bytes
  let unitIndex = 0
  while (value >= 1024 && unitIndex < units.length - 1) {
    value /= 1024
    unitIndex++
  }
  return `${value.toFixed(unitIndex === 0 ? 0 : 1)} ${units[unitIndex]}`
}

export function estimateAudioBytes(durationSeconds?: number | null, bitrateKbps?: string): number | null {
  if (!durationSeconds || !bitrateKbps) return null
  const kbps = parseInt(bitrateKbps, 10)
  if (!kbps) return null
  return (durationSeconds * kbps * 1000) / 8
}

const TYPICAL_VIDEO_BITRATES: Record<string, number> = {
  '2160p': 18000,
  '1440p': 9000,
  '1080p': 4500,
  '720p': 2500,
  '480p': 1000,
  '360p': 500,
  '144p': 200,
}

export function estimateVideoBytes(durationSeconds?: number | null, quality?: string): number | null {
  if (!durationSeconds || !quality) return null
  const kbps = TYPICAL_VIDEO_BITRATES[quality]
  if (!kbps) return null
  // Estimate total size = video + ~128kbps audio
  return (durationSeconds * (kbps + 128) * 1000) / 8
}

const YOUTUBE_HOSTS = new Set([
  'youtube.com',
  'www.youtube.com',
  'm.youtube.com',
  'music.youtube.com',
  'youtu.be',
])

export function isValidYouTubeUrl(input: string): boolean {
  if (!input.trim()) return false
  try {
    const url = new URL(input.includes('://') ? input : `https://${input}`)
    const host = url.hostname.toLowerCase()
    if (!YOUTUBE_HOSTS.has(host)) return false
    if (host === 'youtu.be') return /^\/[\w-]{6,}/.test(url.pathname)
    return url.searchParams.has('v') || url.pathname.includes('/playlist') || url.pathname.includes('/shorts/')
  } catch {
    return false
  }
}

declare global {
  interface Window {
    showSaveFilePicker?: (options?: { suggestedName?: string }) => Promise<FileSystemFileHandle>
  }
}

export async function saveFileWithPicker(fetchUrl: string, filename: string): Promise<void> {
  if (typeof window.showSaveFilePicker === 'function') {
    try {
      const res = await fetch(fetchUrl)
      const blob = await res.blob()
      const handle = await window.showSaveFilePicker({ suggestedName: filename })
      const writable = await handle.createWritable()
      await writable.write(blob)
      await writable.close()
      return
    } catch (e) {
      if (e instanceof DOMException && e.name === 'AbortError') return
      // fall through to plain download on any other failure
    }
  }
  const a = document.createElement('a')
  a.href = fetchUrl
  a.download = filename
  document.body.appendChild(a)
  a.click()
  a.remove()
}
