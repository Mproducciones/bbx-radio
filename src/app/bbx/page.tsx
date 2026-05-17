'use client'

import { useState } from 'react'

type Tab = 'planes' | 'manual' | 'ventas'

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
      'Ve a tu-dominio.vercel.app/studio en el navegador',
      'Ingresa tu usuario y contraseña (te los entrega BBX al inicio)',
      'Desde el panel puedes gestionar todo el contenido',
      'Para cerrar sesión, usa el botón "Cerrar sesión" — te llevará de vuelta a la app',
    ],
  },
  {
    titulo: '2. Publicar noticias',
    icono: '📰',
    pasos: [
      'En el panel, haz clic en "Noticias"',
      'Clic en el botón "+" para crear una nueva noticia',
      'Completa: Título, Categoría, Extracto, Contenido e Imagen',
      'Haz clic en "Publicar" para que aparezca en la app',
      'Puedes editar o eliminar cualquier noticia cuando quieras',
    ],
  },
  {
    titulo: '3. Agregar eventos',
    icono: '📅',
    pasos: [
      'En el panel, selecciona "Eventos"',
      'Clic en "+" para crear un nuevo evento',
      'Completa: Nombre, Fecha, Lugar y Descripción',
      'Agrega una imagen del evento (recomendado: 1200x630px)',
      'Publica y aparecerá automáticamente en la sección Eventos de la app',
    ],
  },
  {
    titulo: '4. Actualizar la programación',
    icono: '🎙️',
    pasos: [
      'En el panel, ve a "Programación"',
      'Cada programa tiene: Nombre, Conductor, Días y Horario',
      'Para agregar un programa nuevo, clic en "+"',
      'Los días se seleccionan: lun, mar, mié, jue, vie, sáb, dom',
      'La app marca automáticamente qué programa está "EN VIVO" ahora',
    ],
  },
  {
    titulo: '5. Gestionar paquetes de publicidad',
    icono: '📢',
    pasos: [
      'Ve a "Paquetes Publicitarios" en el panel',
      'Puedes editar los 3 planes: Básico, Premium y Empresarial',
      'Cambia nombre, precio, período y características de cada plan',
      'El número de WhatsApp para contacto también se edita aquí',
      'Los cambios se ven en la sección "Anúnciate" de la app',
    ],
  },
  {
    titulo: '6. Verificar que el reproductor funciona',
    icono: '▶️',
    pasos: [
      'Abre la app en tu celular',
      'Presiona el botón Play en el reproductor',
      'Deberías escuchar la señal en vivo de la radio',
      'Si no suena, verifica que tu stream esté activo en tu panel de transmisión',
      'Ante cualquier problema, contacta a BBX por WhatsApp',
    ],
  },
]

const VENTAS_SECTIONS = [
  {
    titulo: 'Propuesta de valor en 30 segundos',
    icono: '⚡',
    contenido: `"¿Tu radio tiene app? Con BBX tu estación tiene una app profesional instalable en cualquier celular, con reproductor en vivo, programación, noticias y más — sin pagar desarrollo. Pago mensual, sin contrato anual, con soporte incluido."`,
    tipo: 'cita',
  },
  {
    titulo: 'Proceso de venta',
    icono: '🎯',
    pasos: [
      { paso: '1. Prospección', desc: 'Busca radios FM locales en Google Maps. Filtra las que no tienen app o tienen un sitio web desactualizado.' },
      { paso: '2. Primer contacto', desc: 'Llama o escribe al WhatsApp de la radio. Preséntate como BBX y ofrece una demo gratis de 15 minutos.' },
      { paso: '3. Demo en vivo', desc: 'Muéstrales esta app (Radio Bienvenida) como ejemplo real. Deja que la instalen en su celular.' },
      { paso: '4. Propuesta', desc: 'Envía un PDF con los planes y precios. Recomienda el plan Pro para radios activas.' },
      { paso: '5. Cierre', desc: 'Cobra el setup y el primer mes. Configura la app con su logo y stream en 48-72 horas.' },
      { paso: '6. Onboarding', desc: 'Capacita al operador con este manual. Queda disponible por WhatsApp para dudas.' },
    ],
    tipo: 'pasos',
  },
  {
    titulo: 'Objeciones frecuentes',
    icono: '💬',
    objeciones: [
      {
        pregunta: '"Ya tenemos página web"',
        respuesta: 'Una web no se instala en el celular ni funciona sin internet. Una app PWA sí. Además, ¿cuándo actualizaron el sitio por última vez?',
      },
      {
        pregunta: '"Es muy caro"',
        respuesta: 'Una app nativa en App Store cuesta $5-15 millones de pesos de desarrollo, más $1.000 USD/año en Apple. Acá pagas $60.000/mes y ya está lista.',
      },
      {
        pregunta: '"No sabemos manejarlo"',
        respuesta: 'El panel es igual de simple que Facebook. Te capacito y quedo disponible por WhatsApp para cualquier duda.',
      },
      {
        pregunta: '"Necesito consultarlo"',
        respuesta: 'Sin problema, te envío la propuesta escrita. ¿A qué correo te la mando? (siempre cierra con una acción)',
      },
    ],
    tipo: 'objeciones',
  },
  {
    titulo: 'Proyección de ingresos',
    icono: '📈',
    tipo: 'proyeccion',
  },
]

export default function BbxPage() {
  const [tab, setTab] = useState<Tab>('planes')

  return (
    <div className="min-h-screen bg-[#07070E] px-4 py-6 max-w-2xl mx-auto">
      {/* Header BBX */}
      <div className="mb-8 text-center">
        <div className="inline-flex items-center gap-2 bg-[#db8918]/10 border border-[#db8918]/30 rounded-full px-4 py-1.5 mb-4">
          <span className="w-2 h-2 rounded-full bg-[#db8918]" style={{ animation: 'var(--animate-live-dot)' }} />
          <span className="text-[#db8918] text-xs font-bold tracking-widest uppercase">BBX — Panel interno</span>
        </div>
        <h1 className="text-4xl font-bold text-white mb-1" style={{ fontFamily: 'var(--font-display)' }}>
          BBX Radio System
        </h1>
        <p className="text-[#666690] text-sm">Aplicaciones web para radios · by Bryan Brito</p>
      </div>

      {/* Tabs */}
      <div className="grid grid-cols-3 gap-2 mb-8 bg-[#0F0F1A] rounded-xl p-1">
        {(['planes', 'manual', 'ventas'] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`py-2.5 rounded-lg text-sm font-semibold transition-all capitalize ${
              tab === t
                ? 'bg-[#db8918] text-white shadow-lg'
                : 'text-[#666690] hover:text-white'
            }`}
          >
            {t === 'planes' ? '💰 Planes' : t === 'manual' ? '📖 Manual' : '🚀 Ventas'}
          </button>
        ))}
      </div>

      {/* ── PLANES ── */}
      {tab === 'planes' && (
        <div className="flex flex-col gap-5">
          <p className="text-[#8888AA] text-sm text-center">Precios en CLP · Pago mensual · Sin contrato anual</p>
          {PLANES.map((plan) => (
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
                  <p className="text-[#444468] text-xs">/mes</p>
                  <p className="text-[#666690] text-xs mt-1">Setup ${plan.setup}</p>
                </div>
              </div>
              <div className="space-y-1.5">
                {plan.incluye.map((item) => (
                  <div key={item} className="flex items-start gap-2 text-xs text-[#CCCCDD]">
                    <span style={{ color: plan.color }} className="flex-shrink-0 mt-0.5">✓</span>
                    {item}
                  </div>
                ))}
                {plan.noIncluye.map((item) => (
                  <div key={item} className="flex items-start gap-2 text-xs text-[#444468]">
                    <span className="flex-shrink-0 mt-0.5">✗</span>
                    {item}
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* Nota */}
          <div className="bg-[#1A1A2E] rounded-xl p-4 text-xs text-[#666690] space-y-1">
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
            <p className="text-white font-semibold text-sm mb-1">Manual de Usuario</p>
            <p className="text-[#666690] text-xs">
              Guía para que el operador de la radio gestione el contenido de su app.
              Comparte este enlace con tu cliente: <span className="text-[#40B9BF]">tu-app.vercel.app/bbx</span>
            </p>
          </div>
          {MANUAL_SECTIONS.map((sec) => (
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
            <p className="text-[#666690] text-xs mb-3">Contáctate directamente con BBX</p>
            <a
              href="https://wa.me/56950291592"
              className="inline-flex items-center gap-2 bg-[#128C7E] text-white text-sm font-bold px-5 py-2.5 rounded-xl"
              style={{ textShadow: '0 1px 2px rgba(0,0,0,0.4)' }}
            >
              💬 WhatsApp BBX
            </a>
          </div>
        </div>
      )}

      {/* ── VENTAS ── */}
      {tab === 'ventas' && (
        <div className="flex flex-col gap-5">
          {VENTAS_SECTIONS.map((sec) => (
            <div key={sec.titulo} className="bg-[#0F0F1A] border border-[#1A1A2E] rounded-xl overflow-hidden">
              <div className="flex items-center gap-3 p-4 border-b border-[#1A1A2E]">
                <span className="text-2xl">{sec.icono}</span>
                <h3 className="text-white font-semibold text-sm">{sec.titulo}</h3>
              </div>
              <div className="p-4">
                {sec.tipo === 'cita' && (
                  <p className="text-[#CCCCDD] text-sm leading-relaxed italic border-l-2 border-[#db8918] pl-3">
                    {sec.contenido}
                  </p>
                )}
                {sec.tipo === 'pasos' && sec.pasos && (
                  <div className="space-y-3">
                    {sec.pasos.map((p, i) => (
                      <div key={i} className="flex gap-3">
                        <div className="flex-shrink-0">
                          <div className="w-6 h-6 rounded-full bg-[#db8918]/20 flex items-center justify-center">
                            <span className="text-[#db8918] text-xs font-bold">{i + 1}</span>
                          </div>
                          {i < sec.pasos!.length - 1 && (
                            <div className="w-px h-3 bg-[#1A1A2E] mx-auto mt-1" />
                          )}
                        </div>
                        <div className="pb-2">
                          <p className="text-white text-xs font-semibold">{p.paso}</p>
                          <p className="text-[#666690] text-xs mt-0.5 leading-relaxed">{p.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                {sec.tipo === 'objeciones' && sec.objeciones && (
                  <div className="space-y-3">
                    {sec.objeciones.map((o, i) => (
                      <div key={i} className="bg-[#07070E] rounded-lg p-3">
                        <p className="text-[#AAAABB] text-xs font-semibold mb-1">❓ {o.pregunta}</p>
                        <p className="text-[#40B9BF] text-xs leading-relaxed">💡 {o.respuesta}</p>
                      </div>
                    ))}
                  </div>
                )}
                {sec.tipo === 'proyeccion' && (
                  <div className="space-y-2">
                    {[
                      { radios: 3, plan: 'Pro', ingreso: '180.000', gastos: '~30.000', neto: '~150.000' },
                      { radios: 5, plan: 'Pro', ingreso: '300.000', gastos: '~35.000', neto: '~265.000' },
                      { radios: 8, plan: 'Pro', ingreso: '480.000', gastos: '~50.000', neto: '~430.000' },
                      { radios: 10, plan: 'Mix', ingreso: '650.000', gastos: '~60.000', neto: '~590.000' },
                    ].map((row, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between bg-[#07070E] rounded-lg px-3 py-2.5"
                      >
                        <div>
                          <p className="text-white text-xs font-semibold">{row.radios} radios · Plan {row.plan}</p>
                          <p className="text-[#444468] text-xs">Ingresos ${row.ingreso} · Gastos {row.gastos}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-[#db8918] text-sm font-bold">${row.neto}</p>
                          <p className="text-[#444468] text-xs">neto/mes</p>
                        </div>
                      </div>
                    ))}
                    <p className="text-[#444468] text-xs text-center mt-2 pt-2 border-t border-[#1A1A2E]">
                      + Ingresos de setup: $100.000 por cada radio nueva
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-8 text-center text-[#2D2D4A] text-xs pb-4">
        BBX Radio System · Solo visible para administradores
      </div>
    </div>
  )
}
