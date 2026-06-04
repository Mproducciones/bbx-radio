'use client'

import { useState } from 'react'
import { bbxWhatsApp, BBX_CONTACT } from '@/lib/bbxContent'

export function SubscriptionGraceBannerClient({
  reason,
  daysRemaining,
}: {
  reason: string | null
  daysRemaining: number | null
}) {
  const [dismissed, setDismissed] = useState(false)
  const [paying, setPaying] = useState(false)

  if (dismissed) return null

  async function payNow() {
    setPaying(true)
    try {
      const res = await fetch('/api/billing/checkout', { method: 'POST' })
      const data = await res.json()
      if (data.url) window.location.href = data.url
    } finally {
      setPaying(false)
    }
  }

  return (
    <div
      className="fixed top-0 left-0 right-0 z-[300] px-3 py-2 md:py-2.5 flex flex-wrap items-center justify-center gap-2 text-center text-xs md:text-sm"
      style={{
        background: 'linear-gradient(90deg, #7a4a00, #db8918)',
        color: '#07070e',
        paddingTop: 'max(0.5rem, env(safe-area-inset-top, 0px))',
      }}
      role="alert"
    >
      <span className="font-semibold">
        Pago pendiente
        {daysRemaining != null ? ` · ${daysRemaining} día${daysRemaining !== 1 ? 's' : ''} de gracia` : ''}
        {reason ? ` — ${reason}` : ''}
      </span>
      <button
        type="button"
        onClick={payNow}
        disabled={paying}
        className="px-3 py-1 rounded-lg font-bold bg-[#07070e]/90 text-[#db8918] text-xs disabled:opacity-60"
      >
        {paying ? '…' : 'Pagar ahora'}
      </button>
      <a
        href={bbxWhatsApp(`Hola ${BBX_CONTACT.name}, quiero regularizar el pago de mi radio BBX.`)}
        className="underline font-medium opacity-90"
      >
        WhatsApp
      </a>
      <button type="button" onClick={() => setDismissed(true)} className="opacity-60 hover:opacity-100 ml-1" aria-label="Cerrar">
        ✕
      </button>
    </div>
  )
}
