'use client'

import { motion } from 'framer-motion'

/** Mockup del producto — vista de la app de radio */
export function BbxPhoneMockup() {
  return (
    <div className="relative mx-auto w-[min(100%,280px)]">
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
        <div className="rounded-[1.5rem] overflow-hidden" style={{ background: '#07070e' }}>
          {/* Status bar */}
          <div className="flex items-center justify-between px-4 pt-3 pb-1">
            <span className="text-[9px] text-white/40 font-mono">9:41</span>
            <div className="w-16 h-4 rounded-full bg-black/80 mx-auto absolute left-1/2 -translate-x-1/2 top-2" />
            <span className="text-[9px] text-white/40">●●●</span>
          </div>

          {/* App header */}
          <div className="px-4 pt-2 pb-3 flex items-center justify-between">
            <div>
              <p className="font-display text-lg text-white leading-none tracking-wide">RADIO BIENVENIDA</p>
              <p className="text-[9px] text-[#db8918] font-semibold mt-0.5">93.3 FM · En vivo</p>
            </div>
            <span className="text-[10px] font-bold px-2 py-1 rounded-lg" style={{ background: 'rgba(219,137,24,0.15)', color: '#db8918' }}>
              LIVE
            </span>
          </div>

          {/* Player hero */}
          <div className="mx-3 rounded-2xl overflow-hidden relative" style={{ height: 168, background: 'linear-gradient(170deg, #1a1028 0%, #07070e 70%)' }}>
            <div className="absolute inset-0 opacity-30" style={{ background: 'radial-gradient(circle at 50% 40%, #db8918 0%, transparent 55%)' }} />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative w-24 h-24">
                {[...Array(24)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute left-1/2 top-1/2 origin-bottom rounded-full"
                    style={{
                      width: 2,
                      height: 8 + (i % 3) * 6,
                      marginLeft: -1,
                      marginTop: -40,
                      transform: `rotate(${(i / 24) * 360}deg)`,
                      background: i % 2 === 0 ? '#db8918' : '#40B9BF',
                      opacity: 0.5 + (i % 4) * 0.12,
                    }}
                  />
                ))}
                <div
                  className="absolute inset-2 rounded-full flex items-center justify-center"
                  style={{ background: '#0c0c14', border: '2px solid rgba(219,137,24,0.4)' }}
                >
                  <span className="font-display text-xl text-[#db8918]">93.3</span>
                </div>
              </div>
            </div>
            <div className="absolute bottom-2 left-3 right-3 flex items-center gap-2">
              <div className="flex-1 h-1 rounded-full bg-white/10 overflow-hidden">
                <div className="h-full w-2/3 rounded-full" style={{ background: '#db8918' }} />
              </div>
              <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: '#db8918' }}>
                <span className="text-[#07070e] text-xs ml-0.5">▶</span>
              </div>
            </div>
          </div>

          {/* Sponsor strip */}
          <div className="mx-3 mt-2 rounded-xl px-3 py-2 flex items-center gap-2" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
            <div className="w-8 h-8 rounded-lg shrink-0" style={{ background: 'rgba(219,137,24,0.25)' }} />
            <div className="min-w-0">
              <p className="text-[9px] text-white/90 font-bold truncate">Patrocinador destacado</p>
              <p className="text-[8px] text-white/40 truncate">Banner digital · BBX</p>
            </div>
          </div>

          {/* Nav */}
          <div className="flex justify-around px-2 py-3 mt-1 border-t border-white/5">
            {['En vivo', 'Grilla', 'Participá', 'TV'].map((label, i) => (
              <div key={label} className="flex flex-col items-center gap-0.5">
                <div
                  className="w-5 h-5 rounded-md"
                  style={{ background: i === 0 ? 'rgba(219,137,24,0.35)' : 'rgba(255,255,255,0.06)' }}
                />
                <span className="text-[7px] font-semibold" style={{ color: i === 0 ? '#db8918' : 'rgba(255,255,255,0.35)' }}>
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
      <p className="text-center text-white/30 text-[10px] mt-4 tracking-wide">
        Vista referencial · personalizable a tu marca
      </p>
    </div>
  )
}
