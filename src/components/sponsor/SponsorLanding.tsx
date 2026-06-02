'use client'

import { useEffect, useState } from 'react'
import { RADIO } from '@/lib/radioConfig'

const PLANES = [
  {
    nombre: 'Básico',
    precio: '80.000',
    color: '#40B9BF',
    features: ['4 spots al día', 'Banner en la app'],
  },
  {
    nombre: 'Premium',
    precio: '150.000',
    color: '#db8918',
    popular: true,
    features: ['8 spots horario peak', 'Banner destacado'],
  },
  {
    nombre: 'Empresarial',
    precio: '250.000',
    color: '#7D59B5',
    features: ['12 spots · todos los horarios', 'Patrocinio de programa'],
  },
]

const WA = '56950291592'

function waLink(plan?: string) {
  const text = plan
    ? `Hola, me interesa el plan ${plan} en ${RADIO.name}`
    : `Hola, quiero anunciar mi negocio en ${RADIO.name}`
  return `https://wa.me/${WA}?text=${encodeURIComponent(text)}`
}

export function SponsorLanding() {
  const [listeners, setListeners] = useState<number | null>(null)

  useEffect(() => {
    fetch('/api/listeners/count')
      .then(r => r.json())
      .then(d => setListeners(d.count))
      .catch(() => {})
  }, [])

  return (
    <div className="flex flex-col gap-4 pb-2">
      {/* Cabecera — opaca, sin competir con la atmósfera */}
      <div
        className="rounded-2xl px-5 py-5 text-center"
        style={{
          background: '#0c0c14',
          border: '1px solid rgba(219,137,24,0.25)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
        }}
      >
        <h1 className="font-display text-3xl text-white leading-none tracking-wide">
          Anuncia aquí
        </h1>
        <p className="text-white/70 text-sm mt-2 font-medium">
          {RADIO.name} · {RADIO.city}
        </p>

        <div
          className="mt-4 grid grid-cols-3 gap-2 rounded-xl p-3"
          style={{ background: 'rgba(255,255,255,0.04)' }}
        >
          {[
            { v: '+15K', l: 'Alcance' },
            { v: listeners != null ? String(listeners) : '—', l: 'En vivo' },
            { v: '20+', l: 'Años' },
          ].map(s => (
            <div key={s.l} className="text-center">
              <p className="font-display text-xl text-[#db8918] leading-none">{s.v}</p>
              <p className="text-white/50 text-xs mt-1 font-semibold">{s.l}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Planes */}
      <div className="flex flex-col gap-3">
        {PLANES.map(plan => (
          <div
            key={plan.nombre}
            className="rounded-2xl p-4 relative"
            style={{
              background: '#0c0c14',
              border: `1px solid ${plan.color}${plan.popular ? '55' : '30'}`,
              boxShadow: plan.popular ? `0 0 24px ${plan.color}18` : undefined,
            }}
          >
            {plan.popular && (
              <span
                className="absolute top-0 right-0 text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-bl-xl rounded-tr-2xl"
                style={{ background: plan.color, color: '#07070e' }}
              >
                Recomendado
              </span>
            )}

            <div className="flex items-baseline justify-between gap-3 mb-3">
              <p className="font-display text-2xl text-white leading-none">{plan.nombre}</p>
              <p className="text-right shrink-0">
                <span className="text-white font-bold text-lg">${plan.precio}</span>
                <span className="text-white/40 text-sm">/mes</span>
              </p>
            </div>

            <ul className="space-y-1.5 mb-4">
              {plan.features.map(f => (
                <li key={f} className="flex items-center gap-2 text-white/80 text-sm">
                  <span style={{ color: plan.color }}>✓</span>
                  {f}
                </li>
              ))}
            </ul>

            <a
              href={waLink(plan.nombre)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center w-full py-3 rounded-xl text-sm font-bold"
              style={{
                background: plan.popular ? plan.color : `${plan.color}20`,
                color: plan.popular ? '#07070e' : plan.color,
                border: plan.popular ? 'none' : `1px solid ${plan.color}40`,
              }}
            >
              Consultar por WhatsApp
            </a>
          </div>
        ))}
      </div>

      <a
        href={waLink()}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center gap-2 w-full py-3.5 rounded-2xl text-sm font-bold text-white"
        style={{ background: '#128C7E' }}
      >
        Hablar con ventas
      </a>
    </div>
  )
}
