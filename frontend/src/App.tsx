import { useState } from 'react'
import Header from './components/Header'
import DarkVeil from './components/DarkVeil'
import AboutPage from './pages/AboutPage'
import HomePage from './pages/HomePage'
import TermsPage from './pages/TermsPage'

export type Page = 'home' | 'about' | 'terms'

export default function App() {
  const [page, setPage] = useState<Page>('home')

  function navigate(next: Page) {
    setPage(next)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="relative min-h-screen flex flex-col">
      {/* ── DarkVeil full-page background (shared across all pages) ── */}
      <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: 0, pointerEvents: 'none', overflow: 'hidden', willChange: 'transform', transform: 'translateZ(0)' }}>
        {/* hue-rotate shifts the CPPN purple output → dark red/crimson */}
        <div style={{ width: '100%', height: '100%', filter: 'hue-rotate(90deg) saturate(1.6) brightness(0.8)' }}>
          <DarkVeil
            hueShift={0}
            noiseIntensity={0}
            scanlineIntensity={0}
            speed={0.5}
            scanlineFrequency={0}
            warpAmount={0.3}
            resolutionScale={0.85}
          />
        </div>
        {/* Dark red tint overlay — blends the CPPN output toward crimson */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(ellipse 80% 60% at 50% 30%, rgba(120,0,0,0.55) 0%, rgba(60,0,0,0.35) 50%, rgba(10,10,10,0.85) 100%)',
          mixBlendMode: 'multiply',
        }} />
        {/* Bottom fade to solid background so content below stays readable */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to bottom, rgba(10,10,10,0.25) 0%, rgba(10,10,10,0.5) 55%, rgba(10,10,10,0.92) 85%, rgba(10,10,10,1) 100%)',
        }} />
      </div>

      <div className="relative z-10 flex flex-col flex-1">
        <Header page={page} onNavigate={navigate} />
        <main className="flex-1 w-full">
          <div style={{ display: page === 'home' ? 'block' : 'none' }}>
            <HomePage />
          </div>
          {page === 'about' && <AboutPage />}
          {page === 'terms' && <TermsPage />}
        </main>
      </div>
    </div>
  )
}
