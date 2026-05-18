'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

type PageState = 'checking' | 'login' | 'dashboard'
type DashTab   = 'ventas' | 'manual' | 'setup'

// ── Datos de ventas (antes en /bbx) ──────────────────────────
const VENTAS_SECTIONS = [
  {
    titulo: 'Propuesta de valor en 30 segundos',
    icono: '⚡',
    tipo: 'cita' as const,
    contenido: `"¿Tu radio tiene app? Con BBX tu estación tiene una app profesional instalable en cualquier celular, con reproductor en vivo, programación, noticias y más — sin pagar desarrollo. Pago mensual, sin contrato anual, con soporte incluido."`,
  },
  {
    titulo: 'Proceso de venta',
    icono: '🎯',
    tipo: 'pasos' as const,
    pasos: [
      { paso: '1. Prospección',    desc: 'Busca radios FM locales en Google Maps. Filtra las que no tienen app o tienen un sitio web desactualizado.' },
      { paso: '2. Primer contacto', desc: 'Llama o escribe al WhatsApp de la radio. Preséntate como BBX y ofrece una demo gratis de 15 minutos.' },
      { paso: '3. Demo en vivo',   desc: 'Muéstrales esta app (Radio Bienvenida) como ejemplo real. Deja que la instalen en su celular.' },
      { paso: '4. Propuesta',      desc: 'Envía un PDF con los planes y precios. Recomienda el plan Pro para radios activas.' },
      { paso: '5. Cierre',         desc: 'Cobra el setup y el primer mes. Configura la app con su logo y stream en 48-72 horas.' },
      { paso: '6. Onboarding',     desc: 'Capacita al operador con el manual. Queda disponible por WhatsApp para dudas.' },
    ],
  },
  {
    titulo: 'Objeciones frecuentes',
    icono: '💬',
    tipo: 'objeciones' as const,
    objeciones: [
      { pregunta: '"Ya tenemos página web"',  respuesta: 'Una web no se instala en el celular ni funciona sin internet. Una app PWA sí. Además, ¿cuándo actualizaron el sitio por última vez?' },
      { pregunta: '"Es muy caro"',             respuesta: 'Una app nativa en App Store cuesta $5-15 millones de desarrollo, más $1.000 USD/año en Apple. Acá pagas $60.000/mes y ya está lista.' },
      { pregunta: '"No sabemos manejarlo"',    respuesta: 'El panel es igual de simple que Facebook. Te capacito y quedo disponible por WhatsApp para cualquier duda.' },
      { pregunta: '"Necesito consultarlo"',    respuesta: 'Sin problema, te envío la propuesta escrita. ¿A qué correo te la mando? (siempre cierra con una acción)' },
    ],
  },
  {
    titulo: 'Proyección de ingresos',
    icono: '📈',
    tipo: 'proyeccion' as const,
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
      'En el Studio, haz clic en "📰 Noticias"',
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
      'En el Studio, selecciona "📅 Eventos"',
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
      'En el Studio, ve a "🎙️ Programas"',
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
      'En el Studio, ve a "▶️ Replay"',
      'Clic en "+" para agregar un episodio grabado',
      'Completa: Título, Programa, Fecha de emisión y Duración',
      'Pega la URL de YouTube, SoundCloud o Spotify donde está el episodio',
      'Aparecerá en la sección Replay de la app con los botones correspondientes',
    ],
  },
  {
    titulo: '6. Gestionar publicidad',
    icono: '📢',
    pasos: [
      'Ve a "📢 Publicidad" para agregar banners que rotan en la app',
      'Ve a "💼 Paquetes Publicitarios" para editar los planes de anuncio',
      'Puedes cambiar nombre, precio, características y número de WhatsApp de contacto',
      'Los cambios se reflejan en la app automáticamente sin necesidad de redesplegar',
    ],
  },
  {
    titulo: '7. Verificar el reproductor',
    icono: '🔊',
    pasos: [
      'Abre la app en el celular y presiona el botón Play',
      'Deberías escuchar la señal en vivo de la radio inmediatamente',
      'Si no suena, verifica que el stream esté activo en tu panel de transmisión',
      'Ante cualquier problema, contacta a BBX por WhatsApp',
    ],
  },
]

const SETUP_STEPS = [
  {
    n: 1,
    icono: '🖼️',
    titulo: 'Logo de la radio',
    desc: 'Enviar el logo en formato PNG con fondo transparente. Mínimo 512×512 px. Si tienen versión horizontal y cuadrada, mejor.',
    nota: 'Este logo aparece en la pantalla de inicio, al instalar la app y en la barra de navegación.',
  },
  {
    n: 2,
    icono: '🎨',
    titulo: 'Color principal',
    desc: 'Confirmar el color corporativo de la radio en formato hexadecimal (#RRGGBB) o simplemente decir "el mismo naranja de nuestra web".',
    nota: 'Este color se aplica en todos los botones, íconos activos y acentos de la app.',
  },
  {
    n: 3,
    icono: '📡',
    titulo: 'URL del stream de audio',
    desc: 'Proporcionar el enlace del stream HLS (.m3u8) o el URL de la transmisión en vivo. Lo entrega el proveedor de streaming (Sonic Panel, Centova, etc.).',
    nota: 'Sin esta URL el reproductor no funciona. Verificar que el stream esté activo antes de entregar.',
  },
  {
    n: 4,
    icono: '📱',
    titulo: 'Redes sociales',
    desc: 'Enviar los links completos de Facebook, Instagram, Twitter/X y el número de WhatsApp de contacto con la radio.',
    nota: 'El WhatsApp también se usa como botón de contacto en la sección de publicidad.',
  },
  {
    n: 5,
    icono: '🎙️',
    titulo: 'Programación',
    desc: 'Lista de programas con: nombre del programa, nombre del conductor, días que se emite y horario de inicio y término.',
    nota: 'La app muestra automáticamente qué programa está en vivo en este momento según el horario.',
  },
  {
    n: 6,
    icono: '✅',
    titulo: 'Revisión y lanzamiento',
    desc: 'BBX presenta una demo con los datos del cliente para aprobación. Una vez confirmado, se publica y se entrega el usuario y contraseña del Studio.',
    nota: 'Tiempo estimado de entrega: 48 a 72 horas desde que se reciben todos los materiales.',
  },
]

// ── Componente principal ──────────────────────────────────────
export default function AdminPage() {
  const [pageState, setPageState] = useState<PageState>('checking')
  const [tab, setTab]             = useState<DashTab>('ventas')
  const [username, setUsername]   = useState('')
  const [password, setPassword]   = useState('')
  const [loginState, setLoginState] = useState<'idle' | 'loading' | 'error'>('idle')
  const [loginError, setLoginError] = useState<string | null>(null)

  // Verificar si ya está autenticado al cargar
  useEffect(() => {
    fetch('/api/admin/me', { credentials: 'include' })
      .then(r => r.json())
      .then(d => setPageState(d.authorized ? 'dashboard' : 'login'))
      .catch(() => setPageState('login'))
  }, [])

  async function onLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoginState('loading')
    setLoginError(null)
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
        credentials: 'include',
      })
      if (!res.ok) { setLoginState('error'); setLoginError('Credenciales inválidas'); return }
      setPageState('dashboard')
      setLoginState('idle')
    } catch {
      setLoginState('error')
      setLoginError('No se pudo iniciar sesión')
    }
  }

  async function onLogout() {
    await fetch('/api/admin/logout', { method: 'POST', credentials: 'include' })
    setPageState('login')
    setUsername('')
    setPassword('')
  }

  // ── Cargando ──────────────────────────────────────────────
  if (pageState === 'checking') {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="w-6 h-6 rounded-full border-2 border-[var(--color-mag-400)] border-t-transparent animate-spin" />
      </main>
    )
  }

  // ── Login ─────────────────────────────────────────────────
  if (pageState === 'login') {
    return (
      <main className="min-h-screen flex items-center justify-center px-4">
        <section className="w-full max-w-sm rounded-xl border border-[var(--color-ink-700)] bg-[rgba(0,0,0,0.35)] p-5">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-white font-semibold text-lg">Panel BBX</h1>
            <Link href="/" className="text-[var(--color-ink-400)] hover:text-white text-xs transition-colors">
              ← Volver a la app
            </Link>
          </div>
          <form onSubmit={onLogin} className="flex flex-col gap-3">
            <label className="flex flex-col gap-1">
              <span className="text-[var(--color-ink-400)] text-xs">Usuario</span>
              <input
                value={username}
                onChange={e => setUsername(e.target.value)}
                autoComplete="username"
                className="bg-[var(--color-ink-900)] border border-[var(--color-ink-700)] rounded-lg px-3 py-2 text-white outline-none focus:border-[var(--color-mag-400)]"
                required
                disabled={loginState === 'loading'}
              />
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-[var(--color-ink-400)] text-xs">Contraseña</span>
              <input
                value={password}
                onChange={e => setPassword(e.target.value)}
                type="password"
                autoComplete="current-password"
                className="bg-[var(--color-ink-900)] border border-[var(--color-ink-700)] rounded-lg px-3 py-2 text-white outline-none focus:border-[var(--color-mag-400)]"
                required
                disabled={loginState === 'loading'}
              />
            </label>
            {loginState === 'error' && loginError && (
              <p className="text-red-400 text-xs">{loginError}</p>
            )}
            <button
              type="submit"
              disabled={loginState === 'loading'}
              className="mt-1 w-full rounded-xl bg-[var(--color-mag-400)] hover:bg-[var(--color-mag-600)] text-white font-semibold py-2.5 px-4 transition-colors disabled:opacity-60"
            >
              {loginState === 'loading' ? 'Verificando...' : 'Ingresar al dashboard'}
            </button>

            <p className="text-[var(--color-ink-500)] text-[10px] text-center">
              Solo personal autorizado · BBX
            </p>
          </form>
        </section>
      </main>
    )
  }

  // ── Dashboard ─────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#07070E] px-4 py-6 max-w-2xl mx-auto">

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-[var(--color-mag-400)] text-xs font-bold uppercase tracking-widest mb-0.5">BBX</p>
          <h1 className="text-white font-bold text-xl">Panel interno</h1>
        </div>
        <button
          onClick={onLogout}
          className="text-[#666690] hover:text-white text-xs transition-colors bg-[#0F0F1A] border border-[#1A1A2E] rounded-lg px-3 py-1.5"
        >
          Cerrar sesión
        </button>
      </div>

      {/* Botón a Studio */}
      <a
        href="/studio"
        className="flex items-center justify-between w-full bg-[#0F0F1A] border border-[var(--color-mag-400)]/40 hover:border-[var(--color-mag-400)] rounded-xl p-4 mb-6 transition-colors group"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[var(--color-mag-400)]/15 flex items-center justify-center">
            <svg className="w-5 h-5 text-[var(--color-mag-400)]" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z"/>
            </svg>
          </div>
          <div>
            <p className="text-white font-semibold text-sm">Abrir Studio</p>
            <p className="text-[#8888AA] text-xs">Gestionar noticias, eventos y contenido</p>
          </div>
        </div>
        <svg className="w-4 h-4 text-[#666690] group-hover:text-white transition-colors" viewBox="0 0 24 24" fill="currentColor">
          <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
        </svg>
      </a>

      {/* Tabs */}
      <div className="grid grid-cols-3 gap-1.5 mb-6 bg-[#0F0F1A] rounded-xl p-1">
        {(['ventas', 'manual', 'setup'] as DashTab[]).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`py-2.5 rounded-lg text-xs font-semibold transition-all ${
              tab === t ? 'bg-[var(--color-mag-400)] text-white shadow-lg' : 'text-[#666690] hover:text-white'
            }`}
          >
            {t === 'ventas' ? '🚀 Ventas' : t === 'manual' ? '📖 Manual' : '⚙️ Setup'}
          </button>
        ))}
      </div>

      {/* ── VENTAS ── */}
      {tab === 'ventas' && (
        <div className="flex flex-col gap-5">
          {VENTAS_SECTIONS.map(sec => (
            <div key={sec.titulo} className="bg-[#0F0F1A] border border-[#1A1A2E] rounded-xl overflow-hidden">
              <div className="flex items-center gap-3 p-4 border-b border-[#1A1A2E]">
                <span className="text-2xl">{sec.icono}</span>
                <h3 className="text-white font-semibold text-sm">{sec.titulo}</h3>
              </div>
              <div className="p-4">
                {sec.tipo === 'cita' && (
                  <p className="text-[#CCCCDD] text-sm leading-relaxed italic border-l-2 border-[var(--color-mag-400)] pl-3">
                    {sec.contenido}
                  </p>
                )}
                {sec.tipo === 'pasos' && sec.pasos && (
                  <div className="space-y-3">
                    {sec.pasos.map((p, i) => (
                      <div key={i} className="flex gap-3">
                        <div className="flex-shrink-0">
                          <div className="w-6 h-6 rounded-full bg-[var(--color-mag-400)]/20 flex items-center justify-center">
                            <span className="text-[var(--color-mag-400)] text-xs font-bold">{i + 1}</span>
                          </div>
                          {i < sec.pasos!.length - 1 && <div className="w-px h-3 bg-[#1A1A2E] mx-auto mt-1" />}
                        </div>
                        <div className="pb-2">
                          <p className="text-white text-xs font-semibold">{p.paso}</p>
                          <p className="text-[#8888AA] text-xs mt-0.5 leading-relaxed">{p.desc}</p>
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
                      { radios: 3,  plan: 'Pro', ingreso: '180.000', gastos: '~30.000', neto: '~150.000' },
                      { radios: 5,  plan: 'Pro', ingreso: '300.000', gastos: '~35.000', neto: '~265.000' },
                      { radios: 8,  plan: 'Pro', ingreso: '480.000', gastos: '~50.000', neto: '~430.000' },
                      { radios: 10, plan: 'Mix', ingreso: '650.000', gastos: '~60.000', neto: '~590.000' },
                    ].map((row, i) => (
                      <div key={i} className="flex items-center justify-between bg-[#07070E] rounded-lg px-3 py-2.5">
                        <div>
                          <p className="text-white text-xs font-semibold">{row.radios} radios · Plan {row.plan}</p>
                          <p className="text-[#8888AA] text-xs">Ingresos ${row.ingreso} · Gastos {row.gastos}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-[var(--color-mag-400)] text-sm font-bold">${row.neto}</p>
                          <p className="text-[#8888AA] text-xs">neto/mes</p>
                        </div>
                      </div>
                    ))}
                    <p className="text-[#8888AA] text-xs text-center mt-2 pt-2 border-t border-[#1A1A2E]">
                      + Ingresos de setup: $100.000 por cada radio nueva
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── MANUAL ── */}
      {tab === 'manual' && (
        <div className="flex flex-col gap-4">
          {MANUAL_SECTIONS.map(sec => (
            <div key={sec.titulo} className="bg-[#0F0F1A] border border-[#1A1A2E] rounded-xl overflow-hidden">
              <div className="flex items-center gap-3 p-4 border-b border-[#1A1A2E]">
                <span className="text-2xl">{sec.icono}</span>
                <h3 className="text-white font-semibold text-sm">{sec.titulo}</h3>
              </div>
              <div className="p-4 space-y-2">
                {sec.pasos.map((paso, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <span className="w-5 h-5 rounded-full bg-[var(--color-mag-400)]/20 text-[var(--color-mag-400)] text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
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
              className="inline-flex items-center gap-2 bg-[#128C7E] text-sm font-bold px-5 py-2.5 rounded-xl"
              style={{ color: '#ffffff', textShadow: '0 1px 2px rgba(0,0,0,0.4)' }}
            >
              💬 WhatsApp BBX
            </a>
          </div>
        </div>
      )}

      {/* ── SETUP ── */}
      {tab === 'setup' && (
        <div className="flex flex-col gap-4">
          <div className="bg-[#0F0F1A] rounded-xl p-4 border border-[var(--color-mag-400)]/20">
            <p className="text-white font-semibold text-sm mb-1">📋 Materiales que necesita el cliente</p>
            <p className="text-[#8888AA] text-xs">Todo lo que hay que pedirle al cliente antes de configurar su app.</p>
          </div>

          {SETUP_STEPS.map(step => (
            <div key={step.n} className="bg-[#0F0F1A] border border-[#1A1A2E] rounded-xl overflow-hidden">
              <div className="flex items-center gap-3 p-4 border-b border-[#1A1A2E]">
                <span className="text-xl">{step.icono}</span>
                <div>
                  <p className="text-[10px] text-[#40B9BF] font-bold uppercase tracking-wider">Paso {step.n}</p>
                  <h3 className="text-white font-semibold text-sm">{step.titulo}</h3>
                </div>
              </div>
              <div className="p-4 space-y-3">
                <p className="text-[#CCCCDD] text-xs leading-relaxed">{step.desc}</p>
                <div className="flex items-start gap-2 bg-[#07070E] rounded-lg p-3">
                  <span className="text-[var(--color-mag-400)] flex-shrink-0">💡</span>
                  <p className="text-[#8888AA] text-xs leading-relaxed">{step.nota}</p>
                </div>
              </div>
            </div>
          ))}

          <div className="bg-[var(--color-mag-400)]/10 border border-[var(--color-mag-400)]/30 rounded-xl p-4 text-center">
            <p className="text-[var(--color-mag-400)] font-bold text-sm mb-1">Entrega en 48 a 72 horas</p>
            <p className="text-[#8888AA] text-xs">Una vez recibidos todos los materiales, BBX configura y lanza la app.</p>
          </div>
        </div>
      )}

      <div className="mt-8 text-center text-[#444468] text-xs pb-4">
        BBX Radio System · Panel privado
      </div>
    </div>
  )
}
