'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { SheetPortal } from '@/components/shared/SheetPortal'
import { APP_MORE_NAV_ROUTES, isMoreNavRoute } from '@/lib/appNavRoutes'
import { FEATURES } from '@/lib/plan'

const MORE_META: Record<string, { label: string; desc: string; icon: string }> = {
  '/replay': {
    label: 'Archivo',
    desc: 'Programas grabados para escuchar cuando quieras',
    icon: '📻',
  },
  '/tv': {
    label: 'Bienvenida TV',
    desc: 'Señal de televisión en vivo',
    icon: '📺',
  },
  '/anunciate': {
    label: 'Publicidad',
    desc: 'Anuncia tu negocio en la radio y la app',
    icon: '📣',
  },
}

interface NavMoreSheetProps {
  open: boolean
  onClose: () => void
}

export function NavMoreSheet({ open, onClose }: NavMoreSheetProps) {
  const pathname = usePathname()

  useEffect(() => {
    if (!open) {
      delete document.body.dataset.sheetOpen
      return
    }
    document.body.dataset.sheetOpen = 'true'
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => {
      delete document.body.dataset.sheetOpen
      document.body.style.overflow = prev
      window.removeEventListener('keydown', onKey)
    }
  }, [open, onClose])

  const routes = APP_MORE_NAV_ROUTES.filter(href => {
    if (href === '/replay') return FEATURES.replay
    if (href === '/anunciate') return FEATURES.publicidad
    return true
  })

  return (
    <SheetPortal>
      <AnimatePresence>
        {open && (
          <>
            <motion.button
              type="button"
              aria-label="Cerrar menú"
              className="fixed inset-0 z-[1090] bg-black/70 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
            />
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label="Más opciones"
              className="nav-more-sheet fixed z-[1091] left-0 right-0 mx-auto w-full max-w-lg"
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 320 }}
            >
              <div className="nav-more-sheet__handle" aria-hidden />
              <header className="nav-more-sheet__header">
                <h2 className="nav-more-sheet__title">Más</h2>
                <button type="button" onClick={onClose} className="nav-more-sheet__close" aria-label="Cerrar">
                  ✕
                </button>
              </header>
              <nav className="nav-more-sheet__list">
                {routes.map(href => {
                  const meta = MORE_META[href]
                  const active = pathname.startsWith(href)
                  return (
                    <Link
                      key={href}
                      href={href}
                      onClick={onClose}
                      className={`nav-more-sheet__item ${active ? 'is-active' : ''}`}
                    >
                      <span className="nav-more-sheet__icon" aria-hidden>{meta?.icon ?? '•'}</span>
                      <span className="min-w-0 flex-1">
                        <span className="nav-more-sheet__label">{meta?.label ?? href}</span>
                        {meta?.desc && (
                          <span className="nav-more-sheet__desc">{meta.desc}</span>
                        )}
                      </span>
                    </Link>
                  )
                })}
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </SheetPortal>
  )
}

export function useMoreNavActive(pathname: string): boolean {
  return isMoreNavRoute(pathname)
}
