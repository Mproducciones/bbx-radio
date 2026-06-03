'use client'

import { useEffect, useRef, useState, type ReactNode } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { FEATURES } from '@/lib/plan'

// Orden de las secciones — igual que el bottom nav
const ROUTES = [
  '/',
  '/programacion',
  '/participa',
  '/saludos',
  FEATURES.replay && '/replay',
  '/tv',
  FEATURES.publicidad && '/anunciate',
  FEATURES.publicidad && '/patrocinadores',
  FEATURES.lanzamientos && '/lanzamientos',
].filter(Boolean) as string[]

function routeIndex(path: string): number {
  if (path === '/') return 0
  const i = ROUTES.findIndex(r => r !== '/' && path.startsWith(r))
  return i === -1 ? -1 : i
}

interface SwipeLayoutProps {
  children: ReactNode
}

/** Slide al 100% desborda el viewport en móvil y recorta contenido a la derecha */
function useMobilePageTransition() {
  const [mobile, setMobile] = useState(true)
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)')
    const update = () => setMobile(mq.matches)
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [])
  return mobile
}

const MOBILE_PAGE_VARIANTS = {
  enter: { opacity: 0 },
  center: { opacity: 1, x: 0 },
  exit: { opacity: 0 },
}

export function SwipeLayout({ children }: SwipeLayoutProps) {
  const router = useRouter()
  const pathname = usePathname()
  const prevRef = useRef(pathname)
  const [dir, setDir] = useState(0)
  const mobileTransition = useMobilePageTransition()

  // Detecta dirección para animar hacia donde corresponde
  useEffect(() => {
    const pi = routeIndex(prevRef.current)
    const ci = routeIndex(pathname)
    if (pi !== -1 && ci !== -1 && pi !== ci) setDir(ci > pi ? 1 : -1)
    prevRef.current = pathname
  }, [pathname])

  // Swipe horizontal — ignora inputs, sliders y scroll horizontal
  useEffect(() => {
    // No activar swipe en landings largas ni admin
    if (pathname.startsWith('/admin') || pathname.startsWith('/studio') || pathname.startsWith('/bbx') || pathname.startsWith('/anunciate')) return

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
  const isApp = !pathname.startsWith('/admin') && !pathname.startsWith('/studio') && !pathname.startsWith('/bbx') && !pathname.startsWith('/anunciate')

  if (!isApp) return <>{children}</>

  const slideVariants = {
    enter: (d: number) => ({ x: d >= 0 ? '100%' : '-100%', opacity: 0.6 }),
    center: { x: 0, opacity: 1 },
    exit: (d: number) => ({ x: d >= 0 ? '-40%' : '40%', opacity: 0 }),
  }

  return (
    <>
      <div className="relative flex flex-1 flex-col min-h-0 w-full max-w-full min-w-0 overflow-hidden">
        <AnimatePresence
          initial={false}
          mode={mobileTransition ? 'wait' : 'popLayout'}
          custom={dir}
        >
          <motion.div
            key={pathname}
            custom={dir}
            variants={mobileTransition ? MOBILE_PAGE_VARIANTS : slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={
              mobileTransition
                ? { duration: 0.2, ease: 'easeOut' }
                : { type: 'spring', stiffness: 380, damping: 36, mass: 0.75 }
            }
            className="app-mobile-page md:min-h-0 w-full max-w-full min-w-0 overflow-x-hidden"
            style={{ willChange: mobileTransition ? 'opacity' : 'transform' }}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </div>

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
        bottom: 'calc(var(--app-nav-total) + 6px)',
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
