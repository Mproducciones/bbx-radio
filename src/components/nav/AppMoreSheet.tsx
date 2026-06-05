'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { SheetPortal } from '@/components/shared/SheetPortal'
import { FEATURES } from '@/lib/plan'
import { RADIO } from '@/lib/radioConfig'

interface AppMoreSheetProps {
  open: boolean
  onClose: () => void
}

/** Publicidad y patrocinadores — TV tiene botón propio en el menú inferior. */
export function AppMoreSheet({ open, onClose }: AppMoreSheetProps) {
  const pathname = usePathname()

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!FEATURES.publicidad) return null

  return (
    <SheetPortal>
      <AnimatePresence>
        {open && (
          <>
            <motion.button
              type="button"
              aria-label="Cerrar menú"
              className="nav-more-sheet__backdrop fixed inset-x-0 top-0 z-[1090] bg-black/70 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
            />
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label="Publicidad y más"
              className="nav-more-sheet fixed z-[1091] left-0 right-0 mx-auto w-full max-w-lg"
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 320 }}
            >
              <div className="nav-more-sheet__handle" aria-hidden />
              <header className="nav-more-sheet__header">
                <h2 className="nav-more-sheet__title">Publicidad</h2>
                <button type="button" onClick={onClose} className="nav-more-sheet__close" aria-label="Cerrar">
                  ✕
                </button>
              </header>
              <nav className="nav-more-sheet__list">
                <Link
                  href="/anunciate"
                  onClick={onClose}
                  className={`nav-more-sheet__item nav-more-sheet__item--featured ${pathname.startsWith('/anunciate') ? 'is-active' : ''}`}
                >
                  <span className="nav-more-sheet__icon" aria-hidden>📣</span>
                  <span className="min-w-0 flex-1">
                    <span className="nav-more-sheet__label">Anunciate aquí</span>
                    <span className="nav-more-sheet__desc">
                      Promociona tu negocio en {RADIO.frequency} y en la app · planes desde $80.000
                    </span>
                  </span>
                </Link>
                <Link
                  href="/patrocinadores"
                  onClick={onClose}
                  className={`nav-more-sheet__item ${pathname.startsWith('/patrocinadores') ? 'is-active' : ''}`}
                >
                  <span className="nav-more-sheet__icon" aria-hidden>⭐</span>
                  <span className="min-w-0 flex-1">
                    <span className="nav-more-sheet__label">Patrocinadores</span>
                    <span className="nav-more-sheet__desc">Marcas que ya anuncian en la radio</span>
                  </span>
                </Link>
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </SheetPortal>
  )
}

export function useAppMoreActive(pathname: string): boolean {
  return pathname.startsWith('/anunciate') || pathname.startsWith('/patrocinadores')
}
