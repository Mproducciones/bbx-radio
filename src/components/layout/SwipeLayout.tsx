'use client'

import { useEffect, useRef, useState, type ReactNode } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { APP_NAV_ROUTES, appNavIndex, isAppScrollRoute } from '@/lib/appNavRoutes'

interface SwipeLayoutProps {
  children: ReactNode
}

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

  useEffect(() => {
    const pi = appNavIndex(prevRef.current)
    const ci = appNavIndex(pathname)
    if (pi !== -1 && ci !== -1 && pi !== ci) setDir(ci > pi ? 1 : -1)
    prevRef.current = pathname
  }, [pathname])

  useEffect(() => {
    if (isAppScrollRoute(pathname)) return

    let x0 = 0, y0 = 0, target: EventTarget | null = null

    function onStart(e: TouchEvent) {
      if (e.touches.length > 1) { x0 = 0; return }
      x0 = e.touches[0].clientX
      y0 = e.touches[0].clientY
      target = e.target
    }

    function onEnd(e: TouchEvent) {
      if (!x0) return
      const dx = e.changedTouches[0].clientX - x0
      const dy = e.changedTouches[0].clientY - y0

      if (Math.abs(dx) < 55) return
      if (Math.abs(dy) > Math.abs(dx) * 0.7) return
      if (target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement) return

      const curr = appNavIndex(pathname)
      if (curr === -1) return

      if (dx < 0 && curr < APP_NAV_ROUTES.length - 1) {
        router.push(APP_NAV_ROUTES[curr + 1])
        window.scrollTo({ top: 0, behavior: 'instant' })
      }
      if (dx > 0 && curr > 0) {
        router.push(APP_NAV_ROUTES[curr - 1])
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

  const isTabShell = !isAppScrollRoute(pathname) && !pathname.startsWith('/admin') && !pathname.startsWith('/studio')

  if (!isTabShell) return <>{children}</>

  const slideVariants = {
    enter: (d: number) => ({ x: d >= 0 ? '100%' : '-100%', opacity: 0.6 }),
    center: { x: 0, opacity: 1 },
    exit: (d: number) => ({ x: d >= 0 ? '-40%' : '40%', opacity: 0 }),
  }

  return (
    <div className="relative flex flex-1 flex-col min-h-0 w-full min-w-0 max-w-full overflow-hidden">
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
  )
}
