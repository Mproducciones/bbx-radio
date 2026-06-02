'use client'

import { useEffect, useState, type ReactNode } from 'react'
import { createPortal } from 'react-dom'

/** Renderiza modales/sheets en body para escapar stacking contexts (p. ej. AppMenuScreen z-[1] vs nav z-[1000]). */
export function SheetPortal({ children }: { children: ReactNode }) {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  if (!mounted) return null
  return createPortal(children, document.body)
}
