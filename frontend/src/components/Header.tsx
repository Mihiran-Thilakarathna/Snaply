import type { Page } from '../App'

interface Props {
  page: Page
  onNavigate: (page: Page) => void
}

const NAV_LINKS: { id: Page; label: string }[] = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'terms', label: 'Terms' },
]

function Logo() {
  return (
    <span className="w-7 h-7 rounded-lg bg-black/60 border border-red-900/50 flex items-center justify-center shrink-0">
      <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 text-red-500" fill="currentColor">
        <path d="M8 5v14l11-7z" />
      </svg>
    </span>
  )
}

export default function Header({ page, onNavigate }: Props) {
  return (
    /* Centered floating pill — matches the React Bits reference image */
    <header className="sticky top-4 z-30 flex justify-center px-4">
      <div className="flex items-center gap-6 px-3 py-2 rounded-full nav-pill shadow-xl shadow-black/40">

        {/* Logo + Brand */}
        <button
          type="button"
          onClick={() => onNavigate('home')}
          className="flex items-center gap-2 shrink-0"
        >
          <Logo />
          <span className="text-sm font-bold tracking-tight">
            <span className="text-white">Snap</span>
            <span className="text-red-500">ly</span>
          </span>
        </button>

        {/* Divider */}
        <div className="w-px h-4 bg-white/10" />

        {/* Nav links */}
        <nav className="flex items-center gap-0.5">
          {NAV_LINKS.map((link) => (
            <button
              key={link.id}
              type="button"
              onClick={() => onNavigate(link.id)}
              className={`px-3.5 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
                page === link.id
                  ? 'bg-white/10 text-white'
                  : 'text-zinc-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {link.label}
            </button>
          ))}
          
          <div className="w-px h-3.5 bg-white/10 mx-1" />
          
          <a
            href="https://www.youtube.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium text-red-400 hover:text-white hover:bg-red-500/20 transition-colors"
          >
            <svg viewBox="0 0 24 24" className="w-4 h-4 shrink-0" fill="currentColor">
              <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
            </svg>
            YouTube
          </a>
        </nav>

      </div>
    </header>
  )
}
