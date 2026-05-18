'use client'

import { useRouter } from 'next/navigation'

const PLANES = [
  {
    nombre: 'Básico',
    precio: '60.000',
    setup: '80.000',
    color: '#40B9BF',
    descripcion: 'Reproductor en vivo con tu marca. Sin panel de contenido.',
    incluye: [
      'App PWA instalable en Android e iOS',
      'Reproductor en vivo con HLS',
      'Programación semanal',
      'Página de inicio personalizada',
      'Hosting incluido en Vercel',
      'Actualizaciones automáticas',
    ],
    noIncluye: ['Noticias y eventos', 'Página de publicidad', 'Panel de administración', 'APK nativa Android'],
  },
  {
    nombre: 'Pro',
    precio: '80.000',
    setup: '100.000',
    color: '#db8918',
    popular: true,
    descripcion: 'El plan más elegido. Todo lo que una radio profesional necesita.',
    incluye: [
      'Todo lo del plan Básico',
      'CMS para noticias y eventos',
      'Página de publicidad con paquetes',
      'TV streaming integrado',
      'Panel de administración',
      'Soporte por WhatsApp',
    ],
    noIncluye: ['APK nativa Android'],
  },
  {
    nombre: 'Premium',
    precio: '120.000',
    setup: '150.000',
    color: '#7D59B5',
    descripcion: 'Para radios que quieren máxima presencia y control total.',
    incluye: [
      'Todo lo del plan Pro',
      'APK Android (.apk) para distribución',
      'Personalización avanzada de colores y logo',
      'Dominio personalizado incluido',
      'Soporte prioritario 24/7',
      'Capacitación en persona o video',
    ],
    noIncluye: [],
  },
]

export default function BbxPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-[#07070E] px-4 py-6 max-w-2xl mx-auto">

      {/* Botón volver */}
      <div className="flex justify-end mb-2">
        <button
          onClick={() => router.push('/')}
          className="flex items-center gap-2 text-[#666690] hover:text-white transition-colors bg-[#0F0F1A] border border-[#1A1A2E] rounded-xl px-4 py-2 text-sm"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
          </svg>
          Volver a la app
        </button>
      </div>

      {/* Header */}
      <div className="mb-8 text-center">
        <div className="inline-flex items-center gap-2 bg-[#db8918]/10 border border-[#db8918]/30 rounded-full px-4 py-1.5 mb-4">
          <span className="w-2 h-2 rounded-full bg-[#db8918]" style={{ animation: 'var(--animate-live-dot)' }} />
          <span className="text-[#db8918] text-xs font-bold tracking-widest uppercase">BBX Radio System</span>
        </div>
        <h1 className="text-4xl font-bold text-white mb-1" style={{ fontFamily: 'var(--font-display)' }}>
          Aplicaciones para radios
        </h1>
        <p className="text-[#8888AA] text-sm">by Bryan Brito · desde $60.000/mes</p>
      </div>

      {/* Planes */}
      <p className="text-[#8888AA] text-sm text-center mb-5">Precios en CLP · Pago mensual · Sin contrato anual</p>

      <div className="flex flex-col gap-5">
        {PLANES.map(plan => (
          <div
            key={plan.nombre}
            className="rounded-2xl border p-5 relative overflow-hidden"
            style={{
              borderColor: plan.popular ? plan.color : plan.color + '40',
              background: plan.popular ? plan.color + '10' : 'rgba(15,15,26,0.8)',
            }}
          >
            {plan.popular && (
              <div
                className="absolute top-0 right-0 text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-bl-xl text-black"
                style={{ background: plan.color }}
              >
                Más vendido
              </div>
            )}
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider mb-0.5" style={{ color: plan.color }}>
                  {plan.nombre}
                </p>
                <p className="text-[#8888AA] text-xs">{plan.descripcion}</p>
              </div>
              <div className="text-right flex-shrink-0 ml-4">
                <p className="text-white font-bold text-2xl">${plan.precio}</p>
                <p className="text-[#8888AA] text-xs">/mes</p>
                <p className="text-[#8888AA] text-xs mt-1">Setup ${plan.setup}</p>
              </div>
            </div>
            <div className="space-y-1.5">
              {plan.incluye.map(item => (
                <div key={item} className="flex items-start gap-2 text-xs text-[#CCCCDD]">
                  <span style={{ color: plan.color }} className="flex-shrink-0 mt-0.5">✓</span>
                  {item}
                </div>
              ))}
              {plan.noIncluye.map(item => (
                <div key={item} className="flex items-start gap-2 text-xs text-[#444468]">
                  <span className="flex-shrink-0 mt-0.5">✗</span>
                  {item}
                </div>
              ))}
            </div>
          </div>
        ))}

        <div className="bg-[#1A1A2E] rounded-xl p-4 text-xs text-[#8888AA] space-y-1">
          <p className="text-white font-semibold mb-2">📌 Condiciones</p>
          <p>• El setup se cobra una sola vez al contratar</p>
          <p>• El primer mes se paga por adelantado junto con el setup</p>
          <p>• Cancelación con 30 días de aviso, sin multa</p>
          <p>• Precio en CLP, transferencia bancaria o WebPay</p>
        </div>

        <div className="bg-[#128C7E]/10 border border-[#128C7E]/30 rounded-xl p-4 text-center">
          <p className="text-white font-semibold text-sm mb-1">¿Te interesa?</p>
          <p className="text-[#8888AA] text-xs mb-3">Conversamos y armamos un plan para tu radio</p>
          <a
            href="https://wa.me/5692225555"
            className="inline-flex items-center gap-2 bg-[#128C7E] text-sm font-bold px-5 py-2.5 rounded-xl"
            style={{ color: '#ffffff', textShadow: '0 1px 2px rgba(0,0,0,0.4)' }}
          >
            💬 Contactar por WhatsApp
          </a>
        </div>
      </div>

      <div className="mt-8 text-center text-[#444468] text-xs pb-4">
        BBX Radio System · Aplicaciones profesionales para radios
      </div>
    </div>
  )
}
