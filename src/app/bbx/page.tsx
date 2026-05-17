'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

type Tab = 'planes' | 'manual'

const PLANES = [
  {
    nombre: 'Básico',
    precio: '35.000',
    setup: '80.000',
    color: '#40B9BF',
    descripcion: 'Ideal para radios pequeñas que quieren presencia digital.',
    incluye: [
      'App PWA instalable en Android e iOS',
      'Reproductor en vivo con HLS',
      'Programación semanal',
      'Página de inicio personalizada',
      'Hosting incluido en Vercel',
      'Actualizaciones automáticas',
    ],
    noIncluye: ['CMS de noticias y eventos', 'Página de publicidad', 'APK nativa Android'],
  },
  {
    nombre: 'Pro',
    precio: '60.000',
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
    precio: '90.000',
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

const MANUAL_SECTIONS = [
  {
    titulo: '1. Acceder al panel de administración',
    icono: '🔐',
    pasos: [
      'Ve a tu-app.vercel.app/admin en el navegador o celular',
      'Ingresa tu usuario y contraseña (te los entrega BBX al inicio)',
      'Desde el dashboard puedes ir al Studio o ver información del sistema',
      'En el Studio gestionas todo el contenido de la app',
    ],
  },
  {
    titulo: '2. Publicar noticias',
    icono: '📰',
    pasos: [
      'En el Studio, haz clic en "Noticias"',
      'Clic en el botón "+" para crear una nueva noticia',
      'Completa: Título, Categoría, Resumen e Imagen',
      'Haz clic en "Publicar" para que aparezca en la app',
      'Puedes editar o eliminar cualquier noticia cuando quieras',
    ],
  },
  {
    titulo: '3. Agregar eventos',
    icono: '📅',
    pasos: [
      'En el Studio, selecciona "Eventos"',
      'Clic en "+" para crear un nuevo evento',
      'Completa: Nombre, Fecha, Lugar y Descripción',
      'Agrega una imagen del evento (recomendado: 1200×630 px)',
      'Publica y aparecerá automáticamente en la sección Eventos de la app',
    ],
  },
  {
    titulo: '4. Actualizar la programación',
    icono: '🎙️',
    pasos: [
      'En el Studio, ve a "Programas"',
      'Cada programa tiene: Nombre, Conductor, Días y Horario',
      'Para agregar un programa nuevo, clic en "+"',
      'Los días se seleccionan: lun, mar, mié, jue, vie, sáb, dom',
      'La app marca automáticamente qué programa está "EN VIVO" ahora',
    ],
  },
  {
    titulo: '5. Subir episodios de Replay',
    icono: '▶️',
    pasos: [
      'En el Studio, ve a "Replay"',
      'Clic en "+" para agregar un episodio grabado',
      'Completa: Título, Programa, Fecha de emisión y Duración',
      'Pega la URL de YouTube, SoundCloud o Spotify donde está el episodio',
      'El episodio aparecerá en la sección Replay de la app con los botones de reproducción',
    ],
  },
  {
    titulo: '6. Gestionar publicidad',
    icono: '📢',
    pasos: [
      'Ve a "Publicidad" para agregar banners que rotan en la app',
      'Ve a "Paquetes Publicitarios" para editar los planes que se muestran en Anúnciate',
      'Puedes cambiar nombre, precio, características y número de WhatsApp de contacto',
      'Los cambios se reflejan en la app automáticamente',
    ],
  },
  {
    titulo: '7. Verificar que el reproductor funciona',
    icono: '🔊',
    pasos: [
      'Abre la app en tu celular y presiona el botón Play',
      'Deberías escuchar la señal en vivo de la radio',
      'Si no suena, verifica que tu stream esté activo en tu panel de transmisión',
      'Ante cualquier problema, contacta a BBX por WhatsApp',
    ],
  },
]

export default function BbxPage() {
  const [tab, setTab] = useState<Tab>('planes')
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
        <p className="text-[#8888AA] text-sm">by Bryan Brito · desde $35.000/mes</p>
      </div>

      {/* Tabs */}
      <div className="grid grid-cols-2 gap-2 mb-8 bg-[#0F0F1A] rounded-xl p-1">
        {(['planes', 'manual'] as Tab[]).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`py-2.5 rounded-lg text-sm font-semibold transition-all ${
              tab === t ? 'bg-[#db8918] text-white shadow-lg' : 'text-[#666690] hover:text-white'
            }`}
          >
            {t === 'planes' ? '💰 Planes' : '📖 Manual'}
          </button>
        ))}
      </div>

      {/* ── PLANES ── */}
      {tab === 'planes' && (
        <div className="flex flex-col gap-5">
          <p className="text-[#8888AA] text-sm text-center">Precios en CLP · Pago mensual · Sin contrato anual</p>

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
        </div>
      )}

      {/* ── MANUAL ── */}
      {tab === 'manual' && (
        <div className="flex flex-col gap-4">
          <div className="bg-[#0F0F1A] rounded-xl p-4 border border-[#db8918]/20">
            <p className="text-white font-semibold text-sm mb-1">Manual de uso</p>
            <p className="text-[#8888AA] text-xs">
              Guía para que el operador de la radio gestione el contenido de su app desde el Studio.
            </p>
          </div>

          {MANUAL_SECTIONS.map(sec => (
            <div key={sec.titulo} className="bg-[#0F0F1A] border border-[#1A1A2E] rounded-xl overflow-hidden">
              <div className="flex items-center gap-3 p-4 border-b border-[#1A1A2E]">
                <span className="text-2xl">{sec.icono}</span>
                <h3 className="text-white font-semibold text-sm">{sec.titulo}</h3>
              </div>
              <div className="p-4 space-y-2">
                {sec.pasos.map((paso, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <span className="w-5 h-5 rounded-full bg-[#db8918]/20 text-[#db8918] text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                      {i + 1}
                    </span>
                    <p className="text-[#CCCCDD] text-xs leading-relaxed">{paso}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}

          <div className="bg-[#128C7E]/10 border border-[#128C7E]/30 rounded-xl p-4 text-center">
            <p className="text-white font-semibold text-sm mb-1">¿Tienes dudas?</p>
            <p className="text-[#8888AA] text-xs mb-3">Contacta directamente a BBX</p>
            <a
              href="https://wa.me/56950291592"
              className="inline-flex items-center gap-2 bg-[#128C7E] text-white text-sm font-bold px-5 py-2.5 rounded-xl"
              style={{ color: '#ffffff', textShadow: '0 1px 2px rgba(0,0,0,0.4)' }}
            >
              💬 WhatsApp BBX
            </a>
          </div>
        </div>
      )}

      <div className="mt-8 text-center text-[#444468] text-xs pb-4">
        BBX Radio System · Aplicaciones para radios
      </div>
    </div>
  )
}
