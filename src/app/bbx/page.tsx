'use client'

import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'

const PLANES = [
  {
    nombre: 'Básico',
    precio: '80.000',
    setup: '100.000',
    color: '#40B9BF',
    descripcion: 'Tu radio en el celular de tu oyente. Presencia digital inmediata.',
    incluye: [
      'App PWA instalable en Android e iOS',
      'Reproductor en vivo con HLS',
      'Programación semanal con "EN VIVO" automático',
      'TV streaming integrado',
      'Página de inicio personalizada con tu marca',
      'Hosting incluido en Vercel',
      'Actualizaciones automáticas',
    ],
    noIncluye: ['Noticias y eventos', 'Replay de programas', 'Publicidad y anunciantes', 'Panel de administración', 'Solicitudes de canciones'],
  },
  {
    nombre: 'Pro',
    precio: '120.000',
    setup: '150.000',
    color: '#db8918',
    popular: true,
    descripcion: 'Todo lo que una radio profesional necesita para crecer y monetizar.',
    incluye: [
      'Todo lo del plan Básico',
      'Noticias, eventos y replay de programas',
      'Solicitudes de canciones en tiempo real',
      'Contador de oyentes en vivo (panel admin)',
      'Sistema de publicidad con banners rotativos',
      'Panel de administración completo',
      'Página de anunciantes con paquetes',
      'Story generator para redes sociales',
      'Soporte por WhatsApp',
    ],
    noIncluye: ['Lanzamientos musicales', 'APK nativa Android', 'Dominio personalizado'],
  },
  {
    nombre: 'Premium',
    precio: '160.000',
    setup: '200.000',
    color: '#7D59B5',
    descripcion: 'Máxima presencia, identidad propia y herramientas exclusivas.',
    incluye: [
      'Todo lo del plan Pro',
      'Sección de lanzamientos musicales',
      'APK Android para distribución directa',
      'Dominio personalizado (ej: app.turadiofm.cl)',
      'Soporte prioritario 7 días a la semana',
      'Capacitación en persona o videollamada',
    ],
    noIncluye: [],
  },
]

const DIFERENCIADORES = [
  { icon: '📊', label: 'Contador de oyentes en vivo', desc: 'Sabes en tiempo real cuántas personas te escuchan ahora mismo' },
  { icon: '🎵', label: 'Solicitudes de canciones', desc: 'Tus oyentes piden canciones directo desde la app, con cola visible' },
  { icon: '📱', label: 'Story Generator', desc: 'Tus oyentes comparten lo que escuchan en Instagram con un tap' },
  { icon: '📺', label: 'TV Streaming integrado', desc: 'Video en vivo de tu canal de TV dentro de la misma app' },
  { icon: '🎨', label: 'Colores dinámicos', desc: 'La app cambia de color con la música — ninguna otra radio tiene esto' },
  { icon: '⚡', label: 'PWA instalable', desc: 'Se instala como app nativa en cualquier celular sin App Store' },
]

export default function BbxPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-[#07070E]">
      <div className="max-w-3xl mx-auto px-4 py-6">

        {/* Botón volver */}
        <div className="flex justify-end mb-6">
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

        {/* Hero */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-[#db8918]/10 border border-[#db8918]/30 rounded-full px-4 py-1.5 mb-5">
            <span className="w-2 h-2 rounded-full bg-[#db8918] animate-pulse" />
            <span className="text-[#db8918] text-xs font-bold tracking-widest uppercase">BBX Radio System</span>
          </div>
          <h1 className="font-display text-4xl md:text-5xl text-white mb-3 leading-tight">
            La app que tu radio<br />se merece
          </h1>
          <p className="text-[#8888AA] text-base max-w-lg mx-auto">
            Apps PWA para radios regionales. Diseño único, features que ninguna otra radio tiene y panel de control propio.
          </p>
          <p className="text-[#666690] text-sm mt-2">desde $120.000 CLP/mes · Sin contrato anual</p>
        </div>

        {/* Diferenciadores */}
        <div className="mb-10">
          <p className="text-[#8888AA] text-xs font-semibold uppercase tracking-wider text-center mb-4">Por qué elegir BBX</p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {DIFERENCIADORES.map(d => (
              <motion.div
                key={d.label}
                whileHover={{ scale: 1.02 }}
                className="rounded-xl p-4 flex flex-col gap-2"
                style={{ background: '#0F0F1A', border: '1px solid #1A1A2E' }}
              >
                <span className="text-2xl">{d.icon}</span>
                <p className="text-white text-xs font-semibold leading-tight">{d.label}</p>
                <p className="text-[#666690] text-[11px] leading-relaxed">{d.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Planes */}
        <p className="text-[#8888AA] text-sm text-center mb-5">Elige el plan para tu radio</p>

        <div className="flex flex-col gap-5">
          {PLANES.map((plan, i) => (
            <motion.div
              key={plan.nombre}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="rounded-2xl border p-5 relative overflow-hidden"
              style={{
                borderColor: plan.popular ? plan.color : plan.color + '40',
                background: plan.popular ? plan.color + '0D' : 'rgba(15,15,26,0.9)',
              }}
            >
              {/* Accent line */}
              <div className="absolute top-0 left-0 right-0 h-0.5" style={{ background: `linear-gradient(90deg, transparent, ${plan.color}, transparent)` }} />

              {plan.popular && (
                <div
                  className="absolute top-0 right-0 text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-bl-xl"
                  style={{ background: plan.color, color: '#000' }}
                >
                  Más elegido
                </div>
              )}

              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-lg font-display tracking-wide mb-0.5" style={{ color: plan.color }}>
                    {plan.nombre}
                  </p>
                  <p className="text-[#8888AA] text-xs max-w-xs">{plan.descripcion}</p>
                </div>
                <div className="text-right flex-shrink-0 ml-4">
                  <p className="text-white font-bold text-2xl leading-none">${plan.precio}</p>
                  <p className="text-[#8888AA] text-xs">/mes</p>
                  <p className="text-[#666690] text-xs mt-1">Setup ${plan.setup}</p>
                </div>
              </div>

              <div className="space-y-1.5">
                {plan.incluye.map(item => (
                  <div key={item} className="flex items-start gap-2 text-xs text-[#CCCCDD]">
                    <span style={{ color: plan.color }} className="flex-shrink-0 mt-0.5 font-bold">✓</span>
                    {item}
                  </div>
                ))}
                {plan.noIncluye.map(item => (
                  <div key={item} className="flex items-start gap-2 text-xs text-[#333355]">
                    <span className="flex-shrink-0 mt-0.5">✗</span>
                    {item}
                  </div>
                ))}
              </div>

              <a
                href="https://wa.me/56922105555"
                className="mt-4 flex items-center justify-center gap-2 w-full py-3 rounded-xl text-sm font-bold transition-all hover:opacity-90"
                style={{
                  background: plan.popular ? plan.color : `${plan.color}20`,
                  color: plan.popular ? '#000' : plan.color,
                  border: plan.popular ? 'none' : `1px solid ${plan.color}50`,
                }}
              >
                Quiero este plan →
              </a>
            </motion.div>
          ))}

          {/* Condiciones */}
          <div className="bg-[#0F0F1A] rounded-xl p-4 text-xs text-[#8888AA] space-y-1.5 border border-[#1A1A2E]">
            <p className="text-white font-semibold mb-2">Condiciones</p>
            <p>• El setup se cobra una sola vez al contratar</p>
            <p>• El primer mes se paga por adelantado junto con el setup</p>
            <p>• Cancelación con 30 días de aviso, sin multa ni letra chica</p>
            <p>• Precio en CLP · transferencia bancaria o WebPay</p>
          </div>

          {/* CTA WhatsApp */}
          <div
            className="rounded-xl p-5 text-center"
            style={{ background: 'linear-gradient(135deg, rgba(18,140,126,0.15), rgba(37,211,102,0.1))', border: '1px solid rgba(18,140,126,0.3)' }}
          >
            <p className="text-white font-bold text-base mb-1">¿Conversamos?</p>
            <p className="text-[#8888AA] text-xs mb-4">Te armo un demo con el nombre de tu radio en menos de 24 horas</p>
            <a
              href="https://wa.me/56922105555"
              className="inline-flex items-center gap-2 bg-[#128C7E] text-white font-bold px-6 py-3 rounded-xl text-sm hover:bg-[#0e7a6d] transition-colors"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              Hablar con Bryan
            </a>
          </div>
        </div>

        <div className="mt-8 text-center text-[#444468] text-xs pb-4">
          BBX Radio System · Apps profesionales para radios · Chile
        </div>
      </div>
    </div>
  )
}
