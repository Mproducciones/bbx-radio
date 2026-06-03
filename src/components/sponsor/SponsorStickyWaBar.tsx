'use client'

import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { ProWaButton } from '@/components/shared/ProWaButton'

/** CTA WhatsApp fijo — portal en body (fixed dentro de overflow scroll falla en móvil). */
export function SponsorStickyWaBar({ href }: { href: string }) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  if (!mounted) return null

  return createPortal(
    <div
      className="sponsor-sticky-cta md:hidden fixed z-[999] border-t border-white/[0.06] backdrop-blur-xl pt-3"
      style={{
        bottom: 'var(--app-nav-total)',
        left: 'var(--app-shell-pad-x)',
        right: 'var(--app-shell-pad-right)',
        width: 'auto',
        background: 'rgba(7,7,14,0.96)',
        paddingBottom: 'max(0.75rem, env(safe-area-inset-bottom, 0px))',
      }}
    >
      <ProWaButton href={href} compact>
        Cotizar por WhatsApp
      </ProWaButton>
    </div>,
    document.body,
  )
}
