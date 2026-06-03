'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { RADIO } from '@/lib/radioConfig'
import { FEATURES } from '@/lib/plan'

const NAV_TABS = [
  { label: 'En Vivo', active: true },
  { label: 'Grilla', active: false },
  { label: 'Participá', active: false },
  { label: 'Saludos', active: false },
  ...(FEATURES.replay ? [{ label: 'Replay', active: false }] : []),
  { label: 'TV', active: false },
  ...(FEATURES.publicidad ? [{ label: 'Anuncia', active: false }] : []),
]

/** Mockup del producto — alineado con la PWA de la radio */
export function BbxPhoneMockup() {
  return (
    <div className="relative mx-auto w-[min(100%,300px)]">
      <div
        className="absolute -inset-8 rounded-full opacity-60 blur-3xl pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(219,137,24,0.35) 0%, rgba(64,185,191,0.15) 45%, transparent 70%)' }}
      />
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="relative rounded-[2rem] p-2.5 shadow-2xl"
        style={{
          background: 'linear-gradient(145deg, #2a2a38 0%, #12121c 50%, #0a0a12 100%)',
          boxShadow: '0 32px 80px rgba(0,0,0,0.65), 0 0 0 1px rgba(255,255,255,0.08)',
        }}
      >
        <div className="rounded-[1.5rem] overflow-hidden flex flex-col" style={{ background: '#07070e', minHeight: 420 }}>
          <div className="flex items-center justify-between px-4 pt-3 pb-1 relative shrink-0">
            <span className="text-[9px] text-white/40 font-mono">9:41</span>
            <div className="w-16 h-4 rounded-full bg-black/80 absolute left-1/2 -translate-x-1/2 top-2" />
            <span className="text-[9px] text-white/40">●●●</span>
          </div>

          <div className="px-4 pt-1 pb-2 flex items-center justify-between gap-2 shrink-0">
            <div className="min-w-0">
              <p className="font-display text-base text-white leading-none tracking-wide truncate uppercase">
                {RADIO.name}
              </p>
              <p className="text-[9px] font-semibold mt-0.5" style={{ color: 'var(--color-mag-400, #db8918)' }}>
                {RADIO.frequency} · En vivo
              </p>
            </div>
            <span
              className="text-[9px] font-bold px-2 py-1 rounded-lg shrink-0"
              style={{ background: 'rgba(219,137,24,0.15)', color: '#db8918' }}
            >
              LIVE
            </span>
          </div>

          <div
            className="mx-3 rounded-2xl overflow-hidden relative shrink-0"
            style={{ height: 200, background: 'linear-gradient(170deg, #1a1028 0%, #07070e 70%)' }}
          >
            <div
              className="absolute inset-0 opacity-35"
              style={{ background: 'radial-gradient(circle at 50% 35%, #db8918 0%, transparent 55%)' }}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative w-28 h-28">
                {[...Array(24)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute left-1/2 top-1/2 origin-bottom rounded-full"
                    style={{
                      width: 2,
                      height: 6 + (i % 3) * 5,
                      marginLeft: -1,
                      marginTop: -48,
                      transform: `rotate(${(i / 24) * 360}deg)`,
                      background: i % 2 === 0 ? '#db8918' : '#40B9BF',
                      opacity: 0.45 + (i % 4) * 0.1,
                    }}
                  />
                ))}
                <div
                  className="absolute inset-3 rounded-full flex flex-col items-center justify-center"
                  style={{ background: '#0c0c14', border: '2px solid rgba(219,137,24,0.45)' }}
                >
                  <span className="font-display text-2xl leading-none" style={{ color: '#db8918' }}>
                    {RADIO.frequency.replace(/\s*FM/i, '').trim() || '93.3'}
                  </span>
                  <span className="text-[8px] text-white/40 mt-0.5">En Vivo</span>
                </div>
              </div>
            </div>
            <div className="absolute bottom-2.5 left-3 right-3 flex items-center gap-2">
              <div className="flex-1 h-1 rounded-full bg-white/10 overflow-hidden">
                <div className="h-full w-3/5 rounded-full" style={{ background: '#db8918' }} />
              </div>
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center shadow-lg"
                style={{ background: '#db8918', boxShadow: '0 4px 16px rgba(219,137,24,0.45)' }}
              >
                <span className="text-[#07070e] text-sm ml-0.5">▶</span>
              </div>
            </div>
          </div>

          <div
            className="mx-3 mt-2 rounded-xl px-3 py-2 flex items-center gap-2 shrink-0"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}
          >
            <div
              className="w-9 h-9 rounded-lg shrink-0 flex items-center justify-center text-[10px] font-bold"
              style={{ background: 'rgba(219,137,24,0.2)', color: '#db8918' }}
            >
              AD
            </div>
            <div className="min-w-0">
              <p className="text-[9px] text-white/90 font-bold truncate">Patrocinador destacado</p>
              <p className="text-[8px] text-white/40 truncate">Banner digital · BBX</p>
            </div>
          </div>

          <div
            className="mt-auto flex items-stretch px-0.5 pt-2 border-t border-white/5 shrink-0"
            style={{ background: 'rgba(7,7,14,0.92)' }}
          >
            {NAV_TABS.map(tab => (
              <div key={tab.label} className="flex-1 flex flex-col items-center justify-center py-2 min-w-0">
                <div
                  className="w-4 h-4 rounded-md mb-0.5"
                  style={{
                    background: tab.active ? 'rgba(219,137,24,0.35)' : 'rgba(255,255,255,0.06)',
                    border: tab.active ? '1px solid rgba(219,137,24,0.4)' : 'none',
                  }}
                />
                <span
                  className="text-[6px] font-semibold leading-none truncate max-w-full px-0.5"
                  style={{ color: tab.active ? '#db8918' : 'rgba(255,255,255,0.32)' }}
                >
                  {tab.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
      <p className="text-center text-white/30 text-[10px] mt-3 tracking-wide">
        Vista referencial ·{' '}
        <Link href="/" className="text-[#40B9BF] hover:underline">
          ver demo en vivo
        </Link>
      </p>
    </div>
  )
}
