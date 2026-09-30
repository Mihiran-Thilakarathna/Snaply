const CARDS: [string, string][] = [
  ['Multiple video qualities', '2160p (4K) down to 144p, so you can match your device and connection.'],
  ['Flexible audio formats', 'MP3, M4A, AAC, OPUS, WAV and FLAC, at bitrates from 96 to 320 kbps.'],
  ['Playlist batch downloads', 'Pick individual videos or download an entire playlist in one go.'],
  ['No installs required', 'Everything runs in your browser — nothing to download or set up.'],
]

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-14 space-y-8">
      <header className="text-center space-y-3 animate-fade-in-up">
        <h1 className="text-3xl sm:text-4xl font-extrabold">
          About <span className="bg-gradient-to-r from-yt-red to-rose-400 bg-clip-text text-transparent">Snaply</span>
        </h1>
        <p className="text-yt-gray">A simple, fast way to save YouTube videos and audio for offline use.</p>
      </header>

      <section className="bg-yt-surface border border-yt-border rounded-xl p-6 space-y-3 animate-fade-in-up">
        <h2 className="text-lg font-semibold">What Snaply does</h2>
        <p className="text-sm text-yt-gray leading-relaxed">
          Snaply lets you paste a YouTube video or playlist link and download it as a video file (up to 2160p / 4K) or
          extract just the audio as MP3, M4A, AAC, OPUS, WAV or FLAC. You can select specific videos from a playlist, or
          grab the whole thing in one session — with live progress, speed, and an estimated file size before you commit.
        </p>
      </section>

      <section className="grid sm:grid-cols-2 gap-4">
        {CARDS.map(([title, desc], i) => (
          <div
            key={title}
            className="bg-yt-surface border border-yt-border rounded-xl p-5 space-y-1.5 hover:border-yt-red/50 transition-colors animate-fade-in-up"
            style={{ animationDelay: `${i * 80}ms` }}
          >
            <h3 className="font-semibold text-sm">{title}</h3>
            <p className="text-xs text-yt-gray">{desc}</p>
          </div>
        ))}
      </section>

      <section className="bg-yt-surface border border-yt-border rounded-xl p-6 space-y-3 animate-fade-in-up">
        <h2 className="text-lg font-semibold">Why we built it</h2>
        <p className="text-sm text-yt-gray leading-relaxed">
          We wanted a straightforward tool — no clutter, no confusing ads, just paste a link and get your file. Snaply is
          built for personal use: saving your own uploads, content you have the rights to, or material that's fine to
          download under YouTube's Terms of Service and your local law. See our{' '}
          <span className="text-yt-red">Terms &amp; Conditions</span> for details.
        </p>
      </section>
    </div>
  )
}
