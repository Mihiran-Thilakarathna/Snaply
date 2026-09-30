import { ReactNode } from 'react'

export default function Modal({ children, onClose }: { children: ReactNode; onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xl px-4 transition-all duration-300"
      onClick={onClose}
    >
      <div
        className="glass-card relative overflow-hidden max-w-sm w-full p-8 shadow-[0_0_50px_rgba(255,0,0,0.1)] ring-1 ring-white/10 animate-[scale-in_0.3s_cubic-bezier(0.16,1,0.3,1)]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Subtle top glare */}
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />
        
        {children}
      </div>
    </div>
  )
}
