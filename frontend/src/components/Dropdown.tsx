import { useEffect, useRef, useState } from 'react'

export interface DropdownOption {
  value: string
  label: string
  hint?: string | null
}

interface Props {
  label: string
  value: string
  options: DropdownOption[]
  onChange: (value: string) => void
}

export default function Dropdown({ label, value, options, onChange }: Props) {
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const selected = options.find((o) => o.value === value) ?? options[0]

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onClickOutside)
    return () => document.removeEventListener('mousedown', onClickOutside)
  }, [])

  return (
    <div ref={rootRef} className="relative">
      <label className="text-xs text-yt-gray block mb-1">{label}</label>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between gap-2 bg-yt-surface border border-yt-border rounded-lg px-3 py-2.5 text-white text-left hover:border-yt-red/60 focus:outline-none focus:border-yt-red transition-colors"
      >
        <span className="flex items-baseline gap-2 min-w-0">
          <span className="truncate">{selected?.label}</span>
          {selected?.hint && <span className="text-xs text-yt-gray shrink-0">{selected.hint}</span>}
        </span>
        <svg
          className={`w-4 h-4 shrink-0 text-yt-gray transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
          viewBox="0 0 20 20"
          fill="none"
        >
          <path d="M5 7.5L10 12.5L15 7.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {open && (
        <ul className="absolute z-20 mt-1.5 w-full bg-yt-surface border border-yt-border rounded-lg shadow-xl shadow-black/40 py-1 animate-dropdown origin-top max-h-60 overflow-y-auto custom-scrollbar">
          {options.map((opt) => (
            <li key={opt.value}>
              <button
                type="button"
                onClick={() => {
                  onChange(opt.value)
                  setOpen(false)
                }}
                className={`w-full flex items-center justify-between gap-2 px-3 py-2 text-sm text-left transition-colors ${
                  opt.value === value ? 'bg-yt-red/15 text-yt-red' : 'text-white hover:bg-yt-dark'
                }`}
              >
                <span>{opt.label}</span>
                {opt.hint && <span className="text-xs text-yt-gray">{opt.hint}</span>}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
