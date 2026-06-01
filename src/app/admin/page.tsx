'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { FEATURES } from '@/lib/plan'
import { LiveListenerCounter } from '@/components/admin/LiveListenerCounter'
import { SolicitudesPanel } from '@/components/admin/SolicitudesPanel'
import { SaludosPanel } from '@/components/admin/SaludosPanel'
import { AnalyticsPanel } from '@/components/admin/AnalyticsPanel'
import { PollManager } from '@/components/admin/PollManager'
import { ListenerChart } from '@/components/admin/ListenerChart'

type PageState = 'login' | 'dashboard'

const ALL_MANUAL_SECTIONS = [
  {
    titulo: 'Publicar noticias',
    icono: '📰',
    show: FEATURES.noticias,
    pasos: [
      'En el Studio, haz clic en "Noticias"',
      'Clic en el botón "+" para crear una nueva noticia',
      'Completa: Título, Categoría, Resumen e Imagen',
      'Haz clic en "Publicar" — aparece en la app al instante',
    ],
  },
  {
    titulo: 'Agregar eventos',
    icono: '📅',
    show: FEATURES.eventos,
    pasos: [
      'En el Studio, selecciona "Eventos"',
      'Clic en "+" para crear un nuevo evento',
      'Completa: Nombre, Fecha, Lugar y Descripción',
      'Agrega una imagen (recomendado: 1200×630 px) y publica',
    ],
  },
  {
    titulo: 'Actualizar la programación',
    icono: '🎙️',
    show: true,
    pasos: [
      'En el Studio, ve a "Programas"',
      'Cada programa tiene: Nombre, Conductor, Días y Horario',
      'La app marca automáticamente qué programa está "EN VIVO" ahora',
    ],
  },
  {
    titulo: 'Subir episodios de Replay',
    icono: '▶️',
    show: FEATURES.replay,
    pasos: [
      'En el Studio, ve a "Replay"',
      'Clic en "+" y completa: Título, Programa, Fecha y Duración',
      'Pega la URL de YouTube, SoundCloud o Spotify',
      'Aparece automáticamente en la sección Replay de la app',
    ],
  },
  {
    titulo: 'Gestionar publicidad',
    icono: '📢',
    show: FEATURES.publicidad,
    pasos: [
      'Ve a "Publicidad" para agregar banners que rotan en la app',
      'Ve a "Paquetes Publicitarios" para editar los planes de anuncio',
      'Los cambios se reflejan en la app sin necesidad de redesplegar',
    ],
  },
  {
    titulo: 'Publicar lanzamientos musicales',
    icono: '🎵',
    show: FEATURES.lanzamientos,
    pasos: [
      'En el Studio, ve a "Lanzamiento musical"',
      'Clic en "+" y completa: Título, Artista, Tipo (Single/EP/Álbum) y Fecha',
      'Agrega la portada y los links de Spotify, YouTube o Apple Music',
      'Aparece automáticamente en la sección Lanzamientos de la app',
    ],
  },
]

export default function AdminPage() {
  const router = useRouter()
  const [pageState, setPageState] = useState<PageState>('login')
  const [username, setUsername]   = useState('')
  const [password, setPassword]   = useState('')
  const [loginState, setLoginState] = useState<'idle' | 'loading' | 'error'>('idle')
  const [loginError, setLoginError] = useState<string | null>(null)

  // Si ya tiene sesión, saltar directo al dashboard
  useEffect(() => {
    fetch('/api/admin/me', { credentials: 'include' })
      .then(r => r.json())
      .then(d => { if (d.authorized) setPageState('dashboard') })
      .catch(() => {})
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
    router.push('/')
  }

  // ── Login ─────────────────────────────────────────────────
  if (pageState === 'login') {
    return (
      <main className="min-h-screen flex items-center justify-center px-4 bg-[#07070E]">
        <section className="w-full max-w-sm">
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-2xl overflow-hidden mx-auto mb-4">
              <Image src="/icons/icon-512.png" alt="Radio Bienvenida" width={64} height={64} className="w-full h-full object-contain" />
            </div>
            <h1 className="text-white font-display text-3xl leading-none">Radio Bienvenida</h1>
            <p className="text-[#666690] text-sm mt-1">Panel de administración</p>
          </div>

          <div className="bg-[#0F0F1A] border border-[#1A1A2E] rounded-2xl p-6">
            <form onSubmit={onLogin} className="flex flex-col gap-4">
              <label className="flex flex-col gap-1.5">
                <span className="text-[#8888AA] text-xs font-medium">Usuario</span>
                <input
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  autoComplete="username"
                  className="bg-[#07070E] border border-[#1A1A2E] rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-[#db8918] transition-colors"
                  required
                  disabled={loginState === 'loading'}
                />
              </label>
              <label className="flex flex-col gap-1.5">
                <span className="text-[#8888AA] text-xs font-medium">Contraseña</span>
                <input
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  type="password"
                  autoComplete="current-password"
                  className="bg-[#07070E] border border-[#1A1A2E] rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-[#db8918] transition-colors"
                  required
                  disabled={loginState === 'loading'}
                />
              </label>

              {loginState === 'error' && loginError && (
                <p className="text-red-400 text-xs text-center">{loginError}</p>
              )}

              <button
                type="submit"
                disabled={loginState === 'loading'}
                className="mt-2 w-full rounded-xl py-3.5 px-4 font-bold text-sm text-white transition-all disabled:opacity-60"
                style={{ background: '#db8918' }}
              >
                {loginState === 'loading' ? 'Verificando...' : 'Ingresar'}
              </button>
            </form>
          </div>

          <p className="text-[#444468] text-[10px] text-center mt-4">
            Solo personal autorizado · Powered by BBX
          </p>
        </section>
      </main>
    )
  }

  // ── Dashboard ─────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#07070E]">
      <div className="max-w-6xl mx-auto px-4 py-6">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg overflow-hidden flex-shrink-0">
              <Image src="/icons/icon-512.png" alt="Radio Bienvenida" width={28} height={28} className="w-full h-full object-contain" />
            </div>
            <p className="text-white font-semibold text-base">Panel de administración</p>
          </div>
          <div className="flex items-center gap-2">
            <a
              href="/"
              className="text-[#8888AA] text-xs transition-colors rounded-lg px-3 py-1.5 bg-[#0F0F1A] border border-[#1A1A2E] hover:text-white"
            >
              Ver app
            </a>
            <button
              onClick={onLogout}
              className="text-white text-xs transition-colors rounded-lg px-3 py-1.5 bg-red-600 hover:bg-red-500"
            >
              Salir
            </button>
          </div>
        </div>

        {/* Layout: 1 col mobile → 2 col md → 3 col lg */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">

          {/* Columna izquierda: stats + acciones */}
          <div className="lg:col-span-1 flex flex-col gap-5">

            {/* Contador de oyentes */}
            <LiveListenerCounter />

            {/* Analytics KPIs */}
            <AnalyticsPanel />

            {/* Gráfico de tendencia */}
            <ListenerChart />

            {/* Botón principal — Studio */}
            <a
              href="/studio"
              className="flex items-center justify-between w-full rounded-2xl p-5 transition-all group"
              style={{ background: 'linear-gradient(135deg, #db8918 0%, #a86611 100%)' }}
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"/>
                  </svg>
                </div>
                <div>
                  <p className="text-white font-bold text-base">Gestionar contenido</p>
                  <p className="text-white/70 text-xs mt-0.5">Noticias · Eventos · Programación</p>
                </div>
              </div>
              <svg className="w-5 h-5 text-white/70 group-hover:text-white transition-colors" viewBox="0 0 24 24" fill="currentColor">
                <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
              </svg>
            </a>

            {/* Accesos rápidos */}
            <div className="grid grid-cols-2 gap-3">
              <a href="/studio" className="flex flex-col items-center gap-2 p-4 rounded-xl bg-[#0F0F1A] border border-[#1A1A2E] hover:border-[#db8918]/40 transition-colors text-center">
                <span className="text-2xl">📰</span>
                <span className="text-white text-xs font-medium">Noticias</span>
              </a>
              <a href="/studio" className="flex flex-col items-center gap-2 p-4 rounded-xl bg-[#0F0F1A] border border-[#1A1A2E] hover:border-[#db8918]/40 transition-colors text-center">
                <span className="text-2xl">📅</span>
                <span className="text-white text-xs font-medium">Eventos</span>
              </a>
              <a href="/studio" className="flex flex-col items-center gap-2 p-4 rounded-xl bg-[#0F0F1A] border border-[#1A1A2E] hover:border-[#db8918]/40 transition-colors text-center">
                <span className="text-2xl">📢</span>
                <span className="text-white text-xs font-medium">Publicidad</span>
              </a>
              <a href="/studio" className="flex flex-col items-center gap-2 p-4 rounded-xl bg-[#0F0F1A] border border-[#1A1A2E] hover:border-[#db8918]/40 transition-colors text-center">
                <span className="text-2xl">🎙️</span>
                <span className="text-white text-xs font-medium">Programación</span>
              </a>
            </div>

            {/* Soporte */}
            <a
              href="https://wa.me/56922105555"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 w-full rounded-xl px-4 py-3 transition-all hover:opacity-90"
              style={{ background: '#128C7E', boxShadow: '0 4px 16px rgba(18,140,126,0.2)' }}
            >
              <svg className="w-5 h-5 text-white flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              <div>
                <p className="text-white/70 text-xs">¿Necesitas ayuda?</p>
                <p className="text-white font-semibold text-sm">Soporte directo · BBX</p>
              </div>
            </a>

          </div>

          {/* Columna central: saludos + solicitudes + votación */}
          <div className="lg:col-span-1 flex flex-col gap-5">
            <SaludosPanel />
            <SolicitudesPanel />
            <PollManager />
          </div>

          {/* Columna derecha: manual de uso */}
          <div className="md:col-span-2 lg:col-span-1">
            <p className="text-[#8888AA] text-xs font-semibold uppercase tracking-wider mb-3">Cómo usar tu panel</p>
            <div className="flex flex-col gap-2">
              {ALL_MANUAL_SECTIONS.filter(s => s.show).map(sec => (
                <details key={sec.titulo} className="bg-[#0F0F1A] border border-[#1A1A2E] rounded-xl overflow-hidden group">
                  <summary className="flex items-center gap-3 p-4 cursor-pointer list-none">
                    <span className="text-lg">{sec.icono}</span>
                    <span className="text-white text-sm font-medium flex-1">{sec.titulo}</span>
                    <svg className="w-4 h-4 text-[#444468] group-open:rotate-180 transition-transform" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M7 10l5 5 5-5z"/>
                    </svg>
                  </summary>
                  <div className="px-4 pb-4 space-y-2">
                    {sec.pasos.map((paso, i) => (
                      <div key={i} className="flex items-start gap-2.5">
                        <span className="w-5 h-5 rounded-full bg-[#db8918]/15 text-[#db8918] text-[10px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                          {i + 1}
                        </span>
                        <p className="text-[#CCCCDD] text-xs leading-relaxed">{paso}</p>
                      </div>
                    ))}
                  </div>
                </details>
              ))}
            </div>
          </div>

        </div>

        <div className="mt-8 text-center text-[#444468] text-xs pb-4">
          Powered by BBX
        </div>
      </div>
    </div>
  )
}
