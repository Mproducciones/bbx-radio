'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

interface Package {
  nombre: string
  precio: number
  periodo: string
  caracteristicas: string[]
}

interface PackagesData {
  titulo: string
  subtitulo: string
  paqueteBasico: Package
  paquetePremium: Package
  paqueteEmpresarial: Package
  whatsapp: string
}

const PLANES_DEFAULT = [
  {
    nombre: 'Básico',
    precio: '80.000',
    periodo: 'mes',
    color: '#40B9BF',
    features: ['4 spots diarios en la programación', 'Banner en la app (posición inferior)', 'Mención en redes sociales'],
  },
  {
    nombre: 'Premium',
    precio: '150.000',
    periodo: 'mes',
    color: '#db8918',
    popular: true,
    features: ['8 spots diarios en horario peak', 'Banner destacado en la app (posición top)', 'Post semanal en redes sociales', 'Promoción especial de lanzamiento'],
  },
  {
    nombre: 'Empresarial',
    precio: '250.000',
    periodo: 'mes',
    color: '#7D59B5',
    features: ['12 spots diarios en todos los horarios', 'Banner exclusivo en la app', 'Campaña completa en redes', 'Patrocinio de segmento de programa', 'Producción de cuñas incluida'],
  },
]

export function SponsorLanding() {
  const [data, setData]   = useState<PackagesData | null>(null)
  const [listeners, setListeners] = useState<number | null>(null)
  const phone = data?.whatsapp ?? '56950291592'

  useEffect(() => {
    fetch('/api/packages').then(r => r.ok ? r.json() : null).then(d => d && setData(d)).catch(() => {})
    fetch('/api/listeners/count').then(r => r.json()).then(d => setListeners(d.count)).catch(() => {})
  }, [])

  return (
    <div className="flex flex-col gap-8">

      {/* Hero */}
      <div
        className="relative overflow-hidden rounded-2xl p-6 text-center"
        style={{
          background: 'rgba(219,137,24,0.06)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          border: '1px solid rgba(219,137,24,0.2)',
        }}
      >
        <div className="absolute top-0 left-0 right-0 h-0.5" style={{ background: 'linear-gradient(90deg, transparent, #db8918, transparent)' }} />
        <p className="text-[#db8918] text-xs font-black uppercase tracking-widest mb-3">Radio Bienvenida 93.3 FM</p>
        <h1 className="font-display text-4xl text-white leading-none mb-3">
          {data?.titulo ?? 'Llega a tu cliente en Rancagua'}
        </h1>
        <p className="text-white/50 text-sm max-w-sm mx-auto">
          {data?.subtitulo ?? 'La radio líder en O\'Higgins. Tu negocio en los oídos de miles de oyentes cada día.'}
        </p>

        {/* Live listener count */}
        {listeners !== null && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 mt-4 px-4 py-2 rounded-full"
            style={{ background: 'rgba(0,217,160,0.12)', border: '1px solid rgba(0,217,160,0.25)' }}
          >
            <span className="w-2 h-2 rounded-full bg-[#00D9A0] animate-pulse" />
            <span className="text-[#00D9A0] font-bold text-sm">{listeners} personas</span>
            <span className="text-white/50 text-xs">escuchando ahora mismo</span>
          </motion.div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mt-6">
          {[
            { label: 'Alcance diario', value: '+15K', color: '#db8918' },
            { label: 'Región', value: "O'Higgins", color: '#40B9BF' },
            { label: 'Años en el aire', value: '20+', color: '#7D59B5' },
          ].map(s => (
            <div key={s.label} className="rounded-xl py-3 px-2" style={{ background: 'rgba(255,255,255,0.04)' }}>
              <p
                className="font-display leading-none"
                style={{ color: s.color, fontSize: s.value.length > 6 ? '1rem' : '1.5rem' }}
              >
                {s.value}
              </p>
              <p className="text-white/40 text-[10px] mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Planes */}
      <div>
        <p className="text-white/30 text-xs font-semibold uppercase tracking-wider mb-4">Elige tu plan</p>
        <div className="flex flex-col gap-3">
          {PLANES_DEFAULT.map((plan, i) => (
            <motion.div
              key={plan.nombre}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="relative overflow-hidden rounded-2xl p-5"
              style={{
                background: plan.popular ? `${plan.color}08` : 'rgba(15,15,26,0.65)',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                border: `1px solid ${plan.color}${plan.popular ? '40' : '20'}`,
              }}
            >
              <div className="absolute top-0 left-0 right-0 h-0.5" style={{ background: `linear-gradient(90deg, ${plan.color}, transparent)` }} />
              {plan.popular && (
                <div className="absolute top-0 right-0 text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-bl-xl"
                  style={{ background: plan.color, color: '#07070E' }}>
                  Más elegido
                </div>
              )}

              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-xs font-black uppercase tracking-widest" style={{ color: plan.color }}>{plan.nombre}</p>
                </div>
                <div className="text-right">
                  <p className="text-white font-bold text-2xl leading-none">${plan.precio}</p>
                  <p className="text-white/30 text-xs">/{plan.periodo}</p>
                </div>
              </div>

              <div className="space-y-2">
                {plan.features.map(f => (
                  <div key={f} className="flex items-start gap-2.5">
                    <span className="text-sm flex-shrink-0 mt-0.5" style={{ color: plan.color }}>✓</span>
                    <p className="text-white/60 text-xs leading-relaxed">{f}</p>
                  </div>
                ))}
              </div>

              <a
                href={`https://wa.me/${phone.replace(/\D/g, '')}?text=${encodeURIComponent(`Hola, me interesa el plan ${plan.nombre} de publicidad en Radio Bienvenida`)}`}
                target="_blank" rel="noopener noreferrer"
                className="mt-4 flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-sm font-bold transition-all hover:opacity-90"
                style={{
                  background: plan.popular ? plan.color : `${plan.color}18`,
                  color: plan.popular ? '#07070E' : plan.color,
                  border: plan.popular ? 'none' : `1px solid ${plan.color}30`,
                }}
              >
                Elegir plan →
              </a>
            </motion.div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div
        className="relative overflow-hidden rounded-2xl p-6 text-center"
        style={{ background: 'rgba(18,140,126,0.08)', border: '1px solid rgba(18,140,126,0.25)' }}
      >
        <p className="text-white font-bold text-lg mb-1">¿Hablamos?</p>
        <p className="text-white/40 text-sm mb-4">Te armamos un plan a medida para tu negocio. Sin compromiso.</p>
        <a
          href={`https://wa.me/${phone.replace(/\D/g, '')}`}
          target="_blank" rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-[#128C7E] text-white font-bold px-6 py-3 rounded-xl text-sm hover:bg-[#0e7a6d] transition-colors"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
          Contactar por WhatsApp
        </a>
      </div>
    </div>
  )
}
