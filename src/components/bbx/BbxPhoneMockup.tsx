'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { RADIO } from '@/lib/radioConfig'
import { FEATURES } from '@/lib/plan'

const NAV_TABS = [
  { label: 'En Vivo', active: true },
  { label: 'Grilla', active: false },
  { label: 'Participa', active: false },
  { label: 'Saludos', active: false },
  ...(FEATURES.replay ? [{ label: 'Replay', active: false }] : []),
  { label: 'TV', active: false },
  ...(FEATURES.publicidad ? [{ label: 'Anuncia', active: false }] : []),
]

// 24 bars with staggered animation delays
const BARS = Array.from({ length: 24 }, (_, i) => ({
  height: 5 + (i % 3) * 4,
  color: i % 2 === 0 ? '#db8918' : '#40B9BF',
  opacity: 0.45 + (i % 4) * 0.1,
  delay: `${(i * 0.12).toFixed(2)}s`,
  duration: `${0.6 + (i % 3) * 0.2}s`,
}))

export function BbxPhoneMockup() {
  return (
    <div className="relative mx-auto w-full max-w-[min(100%,280px)] min-w-0 overflow-hidden">
      <style>{`
        @keyframes bar-pulse {
          0%, 100% { transform: rotate(var(--bar-rot)) scaleY(0.45) }
          50%       { transform: rotate(var(--bar-rot)) scaleY(1.0) }
        }
        @keyframes phone-float {
          0%, 100% { transform: translateY(0px) rotateX(2deg) }
          50%       { transform: translateY(-8px) rotateX(0deg) }
        }
      `}</style>

      {/* Ambient glow */}
      <div
        className="absolute inset-0 rounded-full opacity-60 blur-3xl pointer-events-none scale-90"
        style={{ background: 'radial-gradient(circle, rgba(219,137,24,0.4) 0%, rgba(64,185,191,0.18) 45%, transparent 70%)' }}
      />

      {/* Floating phone */}
      <motion.div
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        style={{ animation: 'phone-float 4s ease-in-out infinite', transformStyle: 'preserve-3d' }}
      >
        <div
          className="relative rounded-[2rem] p-2.5 shadow-2xl"
          style={{
            background: 'linear-gradient(145deg, #2a2a38 0%, #12121c 50%, #0a0a12 100%)',
            boxShadow: '0 32px 80px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.09), 0 0 60px rgba(219,137,24,0.12)',
          }}
        >
          <div
            className="rounded-[1.5rem] overflow-hidden flex flex-col max-h-[min(420px,52dvh)]"
            style={{ background: '#07070e', minHeight: 320 }}
          >
            {/* Status bar */}
            <div className="flex items-center justify-between px-4 pt-3 pb-1 relative shrink-0">
              <span className="text-[9px] text-white/40 font-mono">9:41</span>
              <div className="w-16 h-4 rounded-full bg-black/80 absolute left-1/2 -translate-x-1/2 top-2" />
              <span className="text-[9px] text-white/40">●●●</span>
            </div>

            {/* Header */}
            <div className="px-4 pt-1 pb-2 flex items-center justify-between gap-2 shrink-0">
              <div className="min-w-0">
                <p className="font-display text-base text-white leading-none tracking-wide truncate uppercase">
                  {RADIO.name}
                </p>
                <p className="text-[9px] font-semibold mt-0.5" style={{ color: '#db8918' }}>
                  {RADIO.frequency} · En vivo
                </p>
              </div>
              <span
                className="text-[9px] font-bold px-2 py-0.5 rounded-lg shrink-0 flex items-center gap-1"
                style={{ background: 'rgba(219,137,24,0.15)', color: '#db8918' }}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#db8918] inline-block" style={{ animation: 'bar-pulse 1s ease-in-out infinite' }} />
                LIVE
              </span>
            </div>

            {/* Player card */}
            <div
              className="mx-3 rounded-2xl overflow-hidden relative shrink-0 flex flex-col"
              style={{ height: 200, background: 'linear-gradient(170deg, #1a1028 0%, #07070e 70%)' }}
            >
              {/* Visualizer area */}
              <div
                className="relative flex-1 min-h-0 overflow-hidden flex items-center justify-center"
                style={{ background: 'radial-gradient(circle at 50% 40%, rgba(219,137,24,0.22) 0%, transparent 55%)' }}
              >
                <div className="relative w-[7.5rem] h-[7.5rem] shrink-0">
                  {BARS.map((bar, i) => {
                    const angle = (i / 24) * 360
                    return (
                      <div
                        key={i}
                        className="absolute left-1/2 top-1/2 origin-bottom rounded-full"
                        style={{
                          width: 2.5,
                          height: bar.height,
                          marginLeft: -1,
                          marginTop: -38,
                          transform: `rotate(${angle}deg)`,
                          '--bar-rot': `${angle}deg`,
                          background: bar.color,
                          opacity: bar.opacity,
                          animation: `bar-pulse ${bar.duration} ease-in-out infinite`,
                          animationDelay: bar.delay,
                        } as React.CSSProperties}
                      />
                    )
                  })}
                  {/* Center circle */}
                  <div
                    className="absolute inset-2 rounded-full flex flex-col items-center justify-center"
                    style={{ background: '#0c0c14', border: '2px solid rgba(219,137,24,0.45)' }}
                  >
                    <span className="font-display text-xl leading-none" style={{ color: '#db8918' }}>
                      {RADIO.frequency.replace(/\s*FM/i, '').trim() || '93.3'}
                    </span>
                    <span className="text-[8px] text-white/40 mt-0.5">En Vivo</span>
                  </div>
                </div>
              </div>

              {/* Controls */}
              <div className="shrink-0 px-3 pb-2.5 pt-1.5 flex items-center gap-2 border-t border-white/[0.06]">
                <div className="flex-1 min-w-0 h-1 rounded-full bg-white/10 overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ background: 'linear-gradient(90deg, #db8918, #40B9BF)' }}
                    animate={{ width: ['55%', '65%', '60%', '70%', '55%'] }}
                    transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
                  />
                </div>
                <motion.div
                  className="w-9 h-9 shrink-0 rounded-full flex items-center justify-center"
                  style={{ background: '#db8918', boxShadow: '0 4px 16px rgba(219,137,24,0.5)' }}
                  animate={{ boxShadow: ['0 4px 16px rgba(219,137,24,0.5)', '0 4px 28px rgba(219,137,24,0.8)', '0 4px 16px rgba(219,137,24,0.5)'] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <span className="text-[#07070e] text-xs ml-0.5 leading-none">❚❚</span>
                </motion.div>
              </div>
            </div>

            {/* Ad banner */}
            <div
              className="mx-3 mt-2 rounded-xl px-3 py-2 flex items-center gap-2 shrink-0"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}
            >
              <div
                className="w-9 h-9 rounded-lg shrink-0 flex items-center justify-center text-[10px] font-bold"
                style={{ background: 'rgba(219,137,24,0.18)', color: '#db8918' }}
              >
                AD
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[9px] text-white/90 font-bold truncate">Patrocinador destacado</p>
                <p className="text-[8px] text-white/40 truncate">Banner digital · BBX</p>
              </div>
              <span className="text-[8px] text-white/20 shrink-0">→</span>
            </div>

            {/* Bottom nav */}
            <div
              className="mt-auto flex items-stretch px-0.5 pt-2 border-t border-white/5 shrink-0"
              style={{ background: 'rgba(7,7,14,0.94)' }}
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
