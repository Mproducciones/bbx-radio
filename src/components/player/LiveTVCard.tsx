'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { HlsPlayer } from './HlsPlayer'

interface LiveTVCardProps {
  src: string
  isOpen: boolean
  onToggle: () => void
}

export function LiveTVCard({ src, isOpen, onToggle }: LiveTVCardProps) {
  return (
    <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid rgba(255,0,110,0.2)' }}>

      {/* Header card — siempre visible */}
      <motion.button
        onClick={onToggle}
        className="relative w-full overflow-hidden text-left"
        whileTap={{ scale: 0.99 }}
        style={{
          background: isOpen
            ? 'linear-gradient(135deg, #1a0010 0%, #0a0020 100%)'
            : 'linear-gradient(135deg, #0d0020 0%, #1a000a 100%)',
        }}
      >
        {/* Ambient glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse at 30% 50%, rgba(255,0,110,0.12) 0%, transparent 60%)',
          }}
        />

        {/* Scanlines decorativas */}
        <div
          className="absolute inset-0 pointer-events-none opacity-5"
          style={{
            backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.3) 2px, rgba(255,255,255,0.3) 3px)',
          }}
        />

        <div className="relative flex items-center gap-4 px-5 py-4">

          {/* Icono TV con pulso */}
          <div className="relative flex-shrink-0">
            <motion.div
              animate={isOpen ? { scale: [1, 1.08, 1] } : {}}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-14 h-14 rounded-xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, rgba(255,0,110,0.25), rgba(123,47,255,0.25))', border: '1px solid rgba(255,0,110,0.3)' }}
            >
              <TvIcon className="w-7 h-7 text-[#FF006E]" />
            </motion.div>
            {/* Ping ring */}
            {!isOpen && (
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FF006E] opacity-75" />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-[#FF006E]" />
              </span>
            )}
          </div>

          {/* Texto */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              <p className="text-white font-bold text-base leading-none">Bienvenida TV</p>
              <span
                className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full"
                style={{ background: 'rgba(255,0,110,0.15)', color: '#FF006E', border: '1px solid rgba(255,0,110,0.3)' }}
              >
                <span className="w-1 h-1 rounded-full bg-[#FF006E] animate-pulse" />
                EN VIVO
              </span>
            </div>
            <p className="text-[#8888AA] text-xs">Transmisión de video en directo</p>
          </div>

          {/* CTA */}
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.3 }}
            className="flex-shrink-0"
          >
            {isOpen ? (
              <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: 'rgba(255,0,110,0.1)' }}>
                <ChevronIcon className="w-5 h-5 text-[#FF006E]" />
              </div>
            ) : (
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, #FF006E, #7B2FFF)' }}
              >
                <PlayIcon className="w-4 h-4 text-white ml-0.5" />
              </div>
            )}
          </motion.div>
        </div>
      </motion.button>

      {/* Player expandible */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
            style={{ overflow: 'hidden', background: '#000' }}
          >
            <HlsPlayer src={src} title="Bienvenida TV en vivo" shouldPlay />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function TvIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M21 3H3c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h5v2h8v-2h5c1.1 0 1.99-.9 1.99-2L23 5c0-1.1-.9-2-2-2zm0 14H3V5h18v12z"/>
    </svg>
  )
}

function PlayIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M8 5.14v14l11-7-11-7z"/>
    </svg>
  )
}

function ChevronIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M7 14l5-5 5 5z"/>
    </svg>
  )
}
