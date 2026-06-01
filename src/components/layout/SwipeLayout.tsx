'use client'

import { useEffect, useRef, useState, type ReactNode } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { FEATURES } from '@/lib/plan'

// Orden de las secciones — igual que el bottom nav
const ROUTES = [
  '/',
  '/saludos',
  '/tv',
  FEATURES.publicidad && '/anunciate',
].filter(Boolean) as string[]

function routeIndex(path: string): number {
  if (path === '/') return 0
  const i = ROUTES.findIndex(r => r !== '/' && path.startsWith(r))
  return i === -1 ? -1 : i
}

interface SwipeLayoutProps {
  children: ReactNode
}

export function SwipeLayout({ children }: SwipeLayoutProps) {
  const router = useRouter()
  const pathname = usePathname()
  const prevRef = useRef(pathname)
  const [dir, setDir] = useState(0)

  // Detecta dirección para animar hacia donde corresponde
  useEffect(() => {
    const pi = routeIndex(prevRef.current)
    const ci = routeIndex(pathname)
    if (pi !== -1 && ci !== -1 && pi !== ci) setDir(ci > pi ? 1 : -1)
    prevRef.current = pathname
  }, [pathname])

  // Swipe horizontal — ignora inputs, sliders y scroll horizontal
  useEffect(() => {
    // No activar swipe en admin/studio
    if (pathname.startsWith('/admin') || pathname.startsWith('/studio') || pathname.startsWith('/bbx')) return

    let x0 = 0, y0 = 0, target: EventTarget | null = null

    function onStart(e: TouchEvent) {
      // Ignorar multi-touch (gestos de 2+ dedos van al AdminAccessButton)
      if (e.touches.length > 1) { x0 = 0; return }
      x0 = e.touches[0].clientX
      y0 = e.touches[0].clientY
      target = e.target
    }

    function onEnd(e: TouchEvent) {
      if (!x0) return  // fue multi-touch, ignorar
      const dx = e.changedTouches[0].clientX - x0
      const dy = e.changedTouches[0].clientY - y0

      // Mínimo 55px, más horizontal que vertical, no en inputs/sliders
      if (Math.abs(dx) < 55) return
      if (Math.abs(dy) > Math.abs(dx) * 0.7) return
      if (target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement) return

      const curr = routeIndex(pathname)
      if (curr === -1) return

      // Swipe izquierda → siguiente sección
      if (dx < 0 && curr < ROUTES.length - 1) {
        router.push(ROUTES[curr + 1])
        window.scrollTo({ top: 0, behavior: 'instant' })
      }
      // Swipe derecha → sección anterior
      if (dx > 0 && curr > 0) {
        router.push(ROUTES[curr - 1])
        window.scrollTo({ top: 0, behavior: 'instant' })
      }
    }

    document.addEventListener('touchstart', onStart, { passive: true })
    document.addEventListener('touchend', onEnd, { passive: true })
    return () => {
      document.removeEventListener('touchstart', onStart)
      document.removeEventListener('touchend', onEnd)
    }
  }, [pathname, router])

  // No animar rutas de admin/studio
  const isApp = !pathname.startsWith('/admin') && !pathname.startsWith('/studio') && !pathname.startsWith('/bbx')

  if (!isApp) return <>{children}</>

  return (
    <>
      <AnimatePresence initial={false} mode="popLayout" custom={dir}>
        <motion.div
          key={pathname}
          custom={dir}
          variants={{
            enter: (d: number) => ({ x: d >= 0 ? '100%' : '-100%', opacity: 0.6 }),
            center: { x: 0, opacity: 1 },
            exit:  (d: number) => ({ x: d >= 0 ? '-40%' : '40%', opacity: 0 }),
          }}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ type: 'spring', stiffness: 380, damping: 36, mass: 0.75 }}
          style={{ willChange: 'transform' }}
        >
          {children}
        </motion.div>
      </AnimatePresence>

      {/* Dots indicador de posición — solo mobile, solo en secciones */}
      <SwipeDots pathname={pathname} />
    </>
  )
}

function SwipeDots({ pathname }: { pathname: string }) {
  const curr = routeIndex(pathname)
  if (curr === -1 || pathname.startsWith('/admin') || pathname.startsWith('/studio')) return null

  return (
    <div
      className="fixed z-[99] md:hidden flex items-center gap-1.5 pointer-events-none"
      style={{
        bottom: 'calc(64px + env(safe-area-inset-bottom, 0px) + 6px)',
        left: '50%',
        transform: 'translateX(-50%)',
      }}
    >
      {ROUTES.map((_, i) => (
        <motion.div
          key={i}
          animate={{
            width: i === curr ? 16 : 5,
            opacity: i === curr ? 1 : 0.3,
          }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          className="h-1 rounded-full bg-white"
        />
      ))}
    </div>
  )
}
