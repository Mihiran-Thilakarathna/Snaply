import { useEffect, useRef, useState } from 'react'
import { fileUrl, getProgress, startPlaylistDownload } from '../lib/api'
import { saveFileWithPicker } from '../lib/utils'
import { ProgressState, VideoInfo } from '../types'
import FormatSelector from './FormatSelector'
import ProgressBar from './ProgressBar'

export default function PlaylistView({ info }: { info: VideoInfo }) {
  const [selected, setSelected] = useState<Set<string>>(
    new Set(info.playlist_items.map((i) => i.url))
  )
  const [audioOnly, setAudioOnly] = useState(false)
  const [quality, setQuality] = useState('1080p')
  const [audioFormat, setAudioFormat] = useState('mp3')
  const [audioQuality, setAudioQuality] = useState('192')
  const [jobMap, setJobMap] = useState<Record<string, string>>({})
  const [states, setStates] = useState<Record<string, ProgressState>>({})
  const intervalRef = useRef<number | null>(null)

  function toggle(url: string) {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(url)) next.delete(url)
      else next.add(url)
      return next
    })
  }

  function toggleAll() {
    setSelected(
      selected.size === info.playlist_items.length
        ? new Set()
        : new Set(info.playlist_items.map((i) => i.url))
    )
  }

  async function handleDownloadAll() {
    const urls = Array.from(selected)
    if (urls.length === 0) return
    const jobIds = await startPlaylistDownload(urls, { quality, audioOnly, audioFormat, audioQuality })
    const map: Record<string, string> = {}
    urls.forEach((url, idx) => {
      map[url] = jobIds[idx]
    })
    setJobMap(map)
    setStates({})
  }

  useEffect(() => {
    const entries = Object.entries(jobMap)
    if (entries.length === 0) return

    intervalRef.current = window.setInterval(async () => {
      const results = await Promise.all(
        entries.map(async ([url, jobId]) => [url, await getProgress(jobId)] as const)
      )
      const next: Record<string, ProgressState> = {}
      results.forEach(([url, data]) => {
        next[url] = data
      })
      setStates(next)
      if (results.every(([, d]) => d.status === 'done' || d.status === 'error')) {
        if (intervalRef.current) clearInterval(intervalRef.current)
      }
    }, 2000)

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [jobMap])

  const allDone =
    Object.keys(jobMap).length > 0 &&
    Object.values(states).length === Object.keys(jobMap).length &&
    Object.values(states).every((s) => s.status === 'done' || s.status === 'error')

  return (
    <div className="bg-yt-surface border border-yt-border rounded-xl p-4 space-y-4 animate-fade-in-up">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="font-semibold text-lg">{info.title}</h2>
          <p className="text-xs text-yt-gray">
            {info.playlist_items.length} videos &middot; select a few or grab them all
          </p>
        </div>
        <button
          type="button"
          className="text-sm text-yt-red hover:underline shrink-0"
          onClick={toggleAll}
        >
          {selected.size === info.playlist_items.length ? 'Deselect All' : 'Select All'}
        </button>
      </div>

      {allDone && (
        <div className="bg-green-950/40 border border-green-700 text-green-300 rounded-lg px-4 py-2.5 text-sm animate-fade-in-up">
          All downloads complete — click "Save File" on each item to choose where to save it.
        </div>
      )}

      <FormatSelector
        audioOnly={audioOnly}
        setAudioOnly={setAudioOnly}
        quality={quality}
        setQuality={setQuality}
        audioFormat={audioFormat}
        setAudioFormat={setAudioFormat}
        audioQuality={audioQuality}
        setAudioQuality={setAudioQuality}
      />

      <div className="max-h-96 overflow-y-auto space-y-2 pr-1">
        {info.playlist_items.map((item) => {
          const state = states[item.url]
          return (
            <div
              key={item.url}
              className="flex items-center gap-3 bg-yt-dark rounded-lg p-2 hover:bg-yt-dark/70 transition-colors"
            >
              <input
                type="checkbox"
                checked={selected.has(item.url)}
                onChange={() => toggle(item.url)}
                className="accent-yt-red w-4 h-4 shrink-0 cursor-pointer"
              />
              {item.thumbnail && (
                <div className="w-24 aspect-video rounded overflow-hidden shrink-0 bg-yt-black">
                  <img src={item.thumbnail} className="w-full h-full object-cover" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm truncate">{item.title}</p>
                {state && state.status !== 'done' && <ProgressBar state={state} />}
                {state?.status === 'done' && state.filename && (
                  <button
                    type="button"
                    onClick={() => saveFileWithPicker(fileUrl(state.filename!), state.filename!)}
                    className="text-xs text-green-500 hover:underline"
                  >
                    Save File
                  </button>
                )}
              </div>
            </div>
          )
        })}
      </div>

      <button
        type="button"
        onClick={handleDownloadAll}
        disabled={selected.size === 0}
        className="bg-gradient-to-r from-yt-red to-rose-600 hover:shadow-lg hover:shadow-yt-red/30 hover:-translate-y-0.5 disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-none text-white font-semibold px-6 py-2.5 rounded-full transition-all duration-200"
      >
        {selected.size === info.playlist_items.length
          ? `Download Entire Playlist (${selected.size})`
          : `Download Selected (${selected.size})`}
      </button>
    </div>
  )
}
