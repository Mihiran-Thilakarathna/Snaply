import { useState } from 'react'
import { fileUrl } from '../lib/api'
import { saveFileWithPicker } from '../lib/utils'
import Modal from './Modal'

interface Props {
  filename: string
  title?: string
  onClose: () => void
  onConvertAnother: () => void
}

export default function DownloadCompleteModal({ filename, title, onClose, onConvertAnother }: Props) {
  const [saving, setSaving] = useState(false)

  async function handleSave() {
    setSaving(true)
    try {
      const extMatch = filename.match(/\.([^.]+)$/)
      const ext = extMatch ? `.${extMatch[1]}` : ''
      const safeTitle = title ? title.replace(/[<>:"/\\|?*]+/g, '_') : 'download'
      const suggestedName = title ? `${safeTitle}${ext}` : filename
      
      await saveFileWithPicker(fileUrl(filename), suggestedName)
    } finally {
      setSaving(false)
    }
  }

  // Truncate UUID filenames for a cleaner look: "b7e7...35a4.mp4"
  const cleanFilename = filename.length > 25 
    ? `${filename.substring(0, 8)}...${filename.substring(filename.length - 12)}`
    : filename

  return (
    <Modal onClose={onClose}>
      <div className="flex flex-col items-center text-center gap-5">
        
        {/* Glowing Success Icon */}
        <div className="relative">
          <div className="absolute inset-0 bg-emerald-500 blur-xl opacity-30 rounded-full animate-pulse" />
          <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-emerald-400 to-green-600 flex items-center justify-center shadow-lg shadow-emerald-900/50 border border-white/20">
            <svg viewBox="0 0 24 24" className="w-10 h-10 text-white drop-shadow-md" fill="none">
              <path
                d="M5 13l4 4L19 7"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="animate-[draw-check_0.5s_ease-out_forwards]"
                strokeDasharray="30"
                strokeDashoffset="30"
              />
            </svg>
          </div>
        </div>

        {/* Text content */}
        <div className="space-y-2">
          <h3 className="text-2xl font-bold tracking-tight text-white">
            Download Ready!
          </h3>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-white/5 border border-white/10 text-zinc-300 text-xs font-mono">
            <svg viewBox="0 0 16 16" className="w-3.5 h-3.5 text-zinc-400" fill="currentColor">
              <path d="M4 2.5A1.5 1.5 0 015.5 1h5A1.5 1.5 0 0112 2.5v11A1.5 1.5 0 0110.5 15h-5A1.5 1.5 0 014 13.5v-11zM5.5 2a.5.5 0 00-.5.5v11a.5.5 0 00.5.5h5a.5.5 0 00.5-.5v-11a.5.5 0 00-.5-.5h-5z" />
            </svg>
            {cleanFilename}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col w-full gap-3 mt-4">
          <button
            onClick={handleSave}
            disabled={saving}
            className="group relative overflow-hidden bg-gradient-to-r from-red-600 to-rose-500 disabled:opacity-60 text-white font-semibold px-6 py-3.5 rounded-xl shadow-[0_0_20px_rgba(220,38,38,0.3)] hover:shadow-[0_0_30px_rgba(220,38,38,0.5)] transition-all duration-300 hover:-translate-y-0.5"
          >
            <div className="absolute inset-0 bg-white/20 translate-y-[-100%] group-hover:translate-y-[100%] transition-transform duration-500 ease-in-out" />
            <span className="relative flex items-center justify-center gap-2">
              <svg viewBox="0 0 20 20" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 16v1a2 2 0 002 2h8a2 2 0 002-2v-1M10 4v9M6 9l4 4 4-4" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              {saving ? 'Choosing location...' : 'Save File'}
            </span>
          </button>
          
          <button
            onClick={onConvertAnother}
            className="bg-zinc-800/60 hover:bg-zinc-700 border border-zinc-700/50 text-zinc-300 hover:text-white font-medium px-6 py-3 rounded-xl transition-all duration-200"
          >
            Convert Another
          </button>
        </div>
      </div>
    </Modal>
  )
}
