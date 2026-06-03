'use client'

import { useState } from 'react'

export function SuspendedPayActions({ billingEmail }: { billingEmail: string | null }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function payWithStripe() {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/billing/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: billingEmail ?? undefined }),
      })
      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
        return
      }
      setError(data.error ?? 'No disponible. Usa WhatsApp.')
    } catch {
      setError('Error de conexión')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mt-6 w-full max-w-sm">
      <button
        type="button"
        onClick={payWithStripe}
        disabled={loading}
        className="w-full py-3 px-5 rounded-xl font-bold text-sm text-white disabled:opacity-50"
        style={{ background: 'linear-gradient(135deg, #635bff, #7B2FFF)' }}
      >
        {loading ? 'Redirigiendo…' : 'Pagar con tarjeta (automático)'}
      </button>
      {error && <p className="text-red-400/90 text-xs mt-2">{error}</p>}
      <p className="text-white/30 text-[10px] mt-2">
        Transferencia o efectivo: confirma con BBX y reactivamos en minutos.
      </p>
    </div>
  )
}
