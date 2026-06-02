'use client'

import { useEffect, useRef, useCallback, type ReactNode } from 'react'
import { motion } from 'framer-motion'

// ── BORDER BEAM — línea de luz que recorre el borde del card ─────────────────
export function BorderBeam({
  colorFrom = '#db8918',
  colorTo = '#7D59B5',
  duration = 6,
  size = 80,
}: {
  colorFrom?: string
  colorTo?: string
  duration?: number
  size?: number
}) {
  return (
    <div className="absolute inset-0 rounded-[inherit] overflow-hidden pointer-events-none">
      <motion.div
        className="absolute"
        style={{
          width: size,
          height: size,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${colorFrom} 0%, ${colorTo} 50%, transparent 80%)`,
          filter: 'blur(8px)',
          opacity: 0.7,
          offsetPath: `rect(0 100% 100% 0 round inherit)`,
        } as React.CSSProperties}
        animate={{ offsetDistance: ['0%', '100%'] }}
        transition={{ duration, repeat: Infinity, ease: 'linear' }}
      />
    </div>
  )
}

// ── SHIMMER BUTTON — luz que pasa sobre el botón ──────────────────────────────
export function ShimmerButton({
  children,
  onClick,
  disabled,
  className = '',
  background = 'linear-gradient(135deg, #db8918, #a86611)',
  shimmerColor = 'rgba(255,255,255,0.15)',
}: {
  children: ReactNode
  onClick?: () => void
  disabled?: boolean
  className?: string
  background?: string
  shimmerColor?: string
}) {
  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      disabled={disabled}
      className={`relative overflow-hidden font-bold transition-all disabled:opacity-40 ${className}`}
      style={{ background }}
    >
      {/* Shimmer overlay */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `linear-gradient(105deg, transparent 40%, ${shimmerColor} 50%, transparent 60%)`,
          backgroundSize: '200% 100%',
        }}
        animate={{ backgroundPosition: ['-100% 0', '200% 0'] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: 'linear', repeatDelay: 1 }}
      />
      <span className="relative">{children}</span>
    </motion.button>
  )
}

// ── RIPPLE — efecto de onda al tocar ──────────────────────────────────────────
export function RippleButton({
  children,
  onClick,
  className = '',
  color = 'rgba(219,137,24,0.3)',
}: {
  children: ReactNode
  onClick?: () => void
  className?: string
  color?: string
}) {
  const ref = useRef<HTMLButtonElement>(null)

  function handleClick(e: React.MouseEvent<HTMLButtonElement>) {
    const btn = ref.current
    if (!btn) return
    const rect = btn.getBoundingClientRect()
    const ripple = document.createElement('span')
    const size = Math.max(rect.width, rect.height)
    ripple.style.cssText = `
      position:absolute;width:${size}px;height:${size}px;
      border-radius:50%;background:${color};
      transform:translate(-50%,-50%) scale(0);
      left:${e.clientX - rect.left}px;top:${e.clientY - rect.top}px;
      animation:ripple-anim 0.6s ease-out forwards;pointer-events:none;
    `
    btn.appendChild(ripple)
    setTimeout(() => ripple.remove(), 700)
    onClick?.()
  }

  return (
    <button ref={ref} onClick={handleClick}
      className={`relative overflow-hidden ${className}`}>
      {children}
    </button>
  )
}

// ── PULSE RING — anillos que emanan desde un punto ────────────────────────────
export function PulseRing({
  color = '#db8918',
  size = 40,
  count = 3,
}: {
  color?: string
  size?: number
  count?: number
}) {
  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      {Array.from({ length: count }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{ width: size, height: size, border: `1.5px solid ${color}` }}
          animate={{ scale: [1, 2.5], opacity: [0.6, 0] }}
          transition={{
            duration: 2,
            repeat: Infinity,
            delay: i * (2 / count),
            ease: 'easeOut',
          }}
        />
      ))}
    </div>
  )
}

// ── SPARKLES — destellos para estados de éxito ────────────────────────────────
export function Sparkles({ color = '#db8918', count = 12 }: { color?: string; count?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const draw = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    canvas.width  = canvas.offsetWidth
    canvas.height = canvas.offsetHeight

    const particles = Array.from({ length: count }, (_, i) => ({
      x:     canvas.width / 2 + (Math.random() - 0.5) * 40,
      y:     canvas.height / 2 + (Math.random() - 0.5) * 40,
      vx:    (Math.random() - 0.5) * 5,
      vy:    -(2 + Math.random() * 4),
      size:  2 + Math.random() * 3,
      alpha: 1,
      color: i % 3 === 0 ? color : i % 3 === 1 ? '#FFB300' : '#ffffff',
    }))

    let frame: number
    function animate() {
      ctx!.clearRect(0, 0, canvas!.width, canvas!.height)
      let alive = 0
      particles.forEach(p => {
        p.x += p.vx; p.y += p.vy
        p.vy += 0.08
        p.alpha -= 0.018
        if (p.alpha <= 0) return
        alive++
        ctx!.save()
        ctx!.globalAlpha = p.alpha
        ctx!.fillStyle = p.color
        ctx!.shadowColor = p.color
        ctx!.shadowBlur = 6
        ctx!.beginPath()
        ctx!.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx!.fill()
        ctx!.restore()
      })
      if (alive > 0) frame = requestAnimationFrame(animate)
    }
    animate()
    return () => cancelAnimationFrame(frame)
  }, [color, count])

  useEffect(() => { return draw() }, [draw])

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />
}

// ── GLOW TEXT — texto con halo de luz ────────────────────────────────────────
export function GlowText({
  children,
  color = '#db8918',
  className = '',
  style,
}: {
  children: ReactNode
  color?: string
  className?: string
  style?: React.CSSProperties
}) {
  return (
    <span className={className} style={{ textShadow: `0 0 20px ${color}60, 0 0 40px ${color}30`, ...style }}>
      {children}
    </span>
  )
}
