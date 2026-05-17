'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface VideoSource {
  label: string
  url: string
  embedUrl?: string
  icon: string
  color: string
}

interface VideoPlayerProps {
  sources: VideoSource[]
}

export function VideoPlayer({ sources }: VideoPlayerProps) {
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(0)

  if (!sources.length) return null

  const current = sources[active]
  const hasEmbed = !!current.embedUrl

  return (
    <div className="flex flex-col gap-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="pulso-badge-live">
            <span
              className="w-1.5 h-1.5 rounded-full bg-[var(--color-mag-400)]"
              style={{ animation: 'var(--animate-live-dot)' }}
            />
            Video en vivo
          </span>
        </div>
        <button
          onClick={() => setOpen((v) => !v)}
          className="pulso-btn pulso-btn-ghost text-xs px-3 py-1.5 h-auto"
        >
          {open ? 'Cerrar ✕' : 'Ver transmisión ▶'}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden flex flex-col gap-3"
          >
            {/* Source selector cuando hay más de uno */}
            {sources.length > 1 && (
              <div className="flex gap-1 bg-[var(--color-ink-800)] p-1 rounded-lg">
                {sources.map((s, i) => (
                  <button
                    key={s.label}
                    onClick={() => setActive(i)}
                    className={`flex-1 py-1.5 rounded-md text-xs font-medium transition-colors ${
                      active === i
                        ? 'bg-[var(--color-mag-400)] text-white'
                        : 'text-[var(--color-ink-300)] hover:text-white'
                    }`}
                  >
                    {s.icon} {s.label}
                  </button>
                ))}
              </div>
            )}

            <AnimatePresence mode="wait">
              <motion.div
                key={current.label}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                {hasEmbed ? (
                  /* YouTube embed — funciona sin restricciones */
                  <div
                    className="relative w-full rounded-xl overflow-hidden bg-[var(--color-ink-800)]"
                    style={{ paddingTop: '56.25%' }}
                  >
                    <iframe
                      src={current.embedUrl}
                      title={current.label}
                      className="absolute inset-0 w-full h-full"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                ) : (
                  /* Tarjeta de enlace externo para plataformas que bloquean iframes */
                  <a
                    href={current.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col items-center justify-center gap-4 rounded-xl p-8 transition-colors hover:bg-[rgba(255,255,255,0.04)]"
                    style={{
                      background: `linear-gradient(135deg, ${current.color}12 0%, var(--color-ink-800) 100%)`,
                      border: `1px solid ${current.color}30`,
                    }}
                  >
                    <span className="text-5xl">{current.icon}</span>
                    <div className="text-center">
                      <p className="text-white font-semibold text-base">
                        Ver en {current.label}
                      </p>
                      <p className="text-[var(--color-ink-300)] text-sm mt-1">
                        Toca para abrir la transmisión en vivo
                      </p>
                    </div>
                    <span
                      className="pulso-btn text-sm px-5 py-2 rounded-full font-semibold text-white"
                      style={{ background: current.color }}
                    >
                      Abrir transmisión →
                    </span>
                  </a>
                )}
              </motion.div>
            </AnimatePresence>

            <p className="text-[var(--color-ink-500)] text-xs text-center">
              La transmisión en vivo depende de que la radio esté al aire.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
