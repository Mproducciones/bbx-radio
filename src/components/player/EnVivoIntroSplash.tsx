'use client'

import { motion } from 'framer-motion'
import { RADIO } from '@/lib/radioConfig'
import { EASE_OUT } from '@/lib/motion/framer'

/** Apertura En Vivo — ondas que colapsan hacia el núcleo del reproductor. */
export function EnVivoIntroSplash({ active }: { active: boolean }) {
  if (!active) return null

  return (
    <motion.div
      className="envivo-intro absolute inset-0 z-[8] flex flex-col items-center justify-center pointer-events-none overflow-hidden"
      initial={{ opacity: 1 }}
      animate={{ opacity: 0 }}
      transition={{ duration: 0.65, ease: EASE_OUT, delay: 1.55 }}
    >
      <div className="envivo-intro__glow absolute inset-0" aria-hidden />

      <div className="relative flex items-center justify-center" style={{ width: 200, height: 200 }}>
        {[0, 1, 2].map(i => (
          <motion.span
            key={i}
            className="envivo-intro__ring absolute inset-0 rounded-full"
            initial={{ scale: 0.35, opacity: 0.85 }}
            animate={{ scale: 1.55 + i * 0.22, opacity: 0 }}
            transition={{
              duration: 1.35,
              ease: EASE_OUT,
              delay: i * 0.18,
              repeat: Infinity,
              repeatDelay: 0.15,
            }}
            style={{ animationDelay: `${i * 0.18}s` }}
            aria-hidden
          />
        ))}

        <motion.div
          className="envivo-intro__core relative z-[1] flex flex-col items-center"
          initial={{ scale: 0.72, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.7, ease: EASE_OUT }}
        >
          <motion.div
            className="envivo-intro__logo-wrap rounded-full overflow-hidden"
            animate={{ scale: [1, 1.04, 1] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
          >
            <img
              src="/icons/icon-512.png"
              alt=""
              className="w-[5.5rem] h-[5.5rem] object-contain"
              draggable={false}
            />
          </motion.div>
        </motion.div>
      </div>

      <motion.div
        className="relative z-[1] text-center px-6 mt-2 max-w-full"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: EASE_OUT, delay: 0.2 }}
      >
        <motion.p
          className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#40B9BF] mb-2"
          animate={{ opacity: [0.55, 1, 0.55] }}
          transition={{ duration: 1.6, repeat: Infinity }}
        >
          Señal en vivo
        </motion.p>
        <h2 className="font-display text-[1.75rem] leading-none text-white tracking-wide">
          {RADIO.name}
        </h2>
        <p className="text-[#db8918] font-display text-lg mt-1.5 leading-none">{RADIO.frequency}</p>
        <p className="text-white/38 text-xs mt-2 max-w-[16rem] mx-auto leading-relaxed">{RADIO.slogan}</p>
      </motion.div>

      <motion.div
        className="envivo-intro__scan absolute inset-x-0 h-24 pointer-events-none"
        initial={{ top: '-20%' }}
        animate={{ top: '120%' }}
        transition={{ duration: 1.4, ease: 'linear', delay: 0.35 }}
        aria-hidden
      />
    </motion.div>
  )
}
