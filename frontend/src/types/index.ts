export interface PlaylistItem {
  id: string
  title: string
  url: string
  thumbnail?: string | null
}

export interface VideoInfo {
  id: string
  title: string
  thumbnail?: string | null
  duration?: number | null
  is_playlist: boolean
  playlist_items: PlaylistItem[]
  video_sizes: Record<string, number>
  available_video_qualities: string[]
  available_audio_bitrates: string[]
}

export type JobStatus = 'queued' | 'downloading' | 'processing' | 'done' | 'error' | 'cancelled'

export interface ProgressState {
  status: JobStatus
  progress: number
  filename?: string | null
  error?: string | null
  speed?: string | null
  eta?: number | null
}
