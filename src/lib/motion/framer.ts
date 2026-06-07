/** Tokens Framer Motion — PULSO / BBX */
export const EASE_OUT = [0.22, 1, 0.36, 1] as const
export const EASE_IN_OUT = [0.4, 0, 0.2, 1] as const

export const springSnappy = { type: 'spring' as const, stiffness: 420, damping: 32, mass: 0.85 }
export const springSoft = { type: 'spring' as const, stiffness: 300, damping: 28, mass: 0.9 }

export const fadeUp = {
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
}

export const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
}

/** Transición suave entre tabs del bottom nav (sin slide horizontal). */
export const tabCrossfadeTransition = { duration: 0.22, ease: EASE_OUT }

export const tabCrossfade = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
}

export const scaleIn = {
  initial: { opacity: 0, scale: 0.92 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.96 },
}

export const staggerContainer = {
  animate: { transition: { staggerChildren: 0.06, delayChildren: 0.04 } },
}

export const staggerItem = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.35, ease: EASE_OUT } },
}

export function staggerDelay(index: number, step = 0.05, base = 0) {
  return { delay: base + index * step, duration: 0.35, ease: EASE_OUT }
}
