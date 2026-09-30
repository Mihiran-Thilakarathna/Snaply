import { useState } from 'react'
import { isValidYouTubeUrl } from '../lib/utils'

interface Props {
  onSubmit: (url: string) => void
  loading: boolean
}

export default function UrlInput({ onSubmit, loading }: Props) {
  const [url, setUrl] = useState('')
  const [touched, setTouched] = useState(false)

  const trimmed = url.trim()
  const showInvalid = touched && trimmed.length > 0 && !isValidYouTubeUrl(trimmed)

  return (
    <form
      className="space-y-2"
      onSubmit={(e) => {
        e.preventDefault()
        setTouched(true)
        if (isValidYouTubeUrl(trimmed)) onSubmit(trimmed)
      }}
    >
      <div className="flex gap-2 p-1.5 rounded-[2rem] bg-zinc-900/80 border border-red-900/50 backdrop-blur-md">
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          onBlur={() => setTouched(true)}
          placeholder="Paste YouTube video or playlist URL..."
          className={`flex-1 bg-transparent px-5 py-3 text-white placeholder-zinc-500 focus:outline-none text-sm ${
            showInvalid ? 'text-red-400' : ''
          }`}
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-[#7f1d1d] hover:bg-[#991b1b] disabled:opacity-50 text-white font-semibold px-7 py-3 rounded-[1.5rem] transition-all duration-200 text-sm shrink-0 shadow-lg shadow-red-900/30"
        >
          {loading ? 'Fetching…' : 'Fetch'}
        </button>
      </div>
      {showInvalid && (
        <p className="text-sm text-yt-red px-2">
          That doesn't look like a valid YouTube link. Paste a full youtube.com or youtu.be URL.
        </p>
      )}
    </form>
  )
}
