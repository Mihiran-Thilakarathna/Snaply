import { useState } from 'react'
import PlaylistView from '../components/PlaylistView'
import UrlInput from '../components/UrlInput'
import VideoPreviewCard from '../components/VideoPreviewCard'
import { fetchVideoInfo } from '../lib/api'
import { VideoInfo } from '../types'



export default function HomePage() {
  const [info, setInfo] = useState<VideoInfo | null>(null)
  const [url, setUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleFetch(inputUrl: string) {
    setLoading(true)
    setError(null)
    setInfo(null)
    try {
      const data = await fetchVideoInfo(inputUrl)
      setInfo(data)
      setUrl(inputUrl)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  function resetAll() {
    setInfo(null)
    setUrl('')
    setError(null)
  }



  return (
    <div className="relative">


      {/* Hero */}
      <section className="px-4 pt-16 pb-12 sm:pt-24 sm:pb-16 text-center">
        <div className="max-w-2xl mx-auto space-y-5">
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight leading-tight">
            Effortless{' '}
            <span className="bg-gradient-to-r from-red-500 to-rose-400 bg-clip-text text-transparent">
              YouTube
            </span>{' '}
            Downloads
          </h1>
          <p className="text-zinc-400 text-base sm:text-lg">
            Video &amp; Audio in any quality — Fast, Free, No Watermarks.
          </p>
        </div>

        <div className="max-w-2xl mx-auto mt-10">
          <UrlInput onSubmit={handleFetch} loading={loading} />
        </div>
      </section>

      {/* Results / features */}
      <div className="max-w-4xl mx-auto px-4 space-y-6 pb-20">
        {error && (
          <div className="bg-red-950/40 border border-red-800 text-red-300 rounded-lg px-4 py-3 text-sm animate-fade-in-up">
            {error}
          </div>
        )}

        {info && !info.is_playlist && (
          <VideoPreviewCard info={info} url={url} onConvertAnother={resetAll} />
        )}
        {info && info.is_playlist && <PlaylistView info={info} />}


      </div>

    </div>
  )
}
