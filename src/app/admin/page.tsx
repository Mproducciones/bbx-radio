'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { LiveListenerCounter } from '@/components/admin/LiveListenerCounter'
import { SaludosPanel } from '@/components/admin/SaludosPanel'
import { AdsPanel } from '@/components/admin/AdsPanel'
import { AnalyticsPanel } from '@/components/admin/AnalyticsPanel'
import { SolicitudesPanel } from '@/components/admin/SolicitudesPanel'
import { ListenerChart } from '@/components/admin/ListenerChart'
import { PollManager } from '@/components/admin/PollManager'

type PageState = 'login' | 'dashboard'

const STUDIO_LINKS = [
  { icon: '📰', label: 'Noticias',      desc: 'Publicar o editar noticias',   href: '/studio' },
  { icon: '📅', label: 'Eventos',       desc: 'Agregar eventos locales',       href: '/studio' },
  { icon: '📢', label: 'Publicidad',    desc: 'Gestionar campañas activas',    href: '/studio' },
  { icon: '🎙️', label: 'Programación', desc: 'Actualizar la parrilla',        href: '/studio' },
  { icon: '▶️', label: 'Replay',        desc: 'Subir episodios pasados',       href: '/studio' },
  { icon: '🎵', label: 'Lanzamientos',  desc: 'Publicar música nueva',         href: '/studio' },
]

export default function AdminPage() {
  const router = useRouter()
  const [pageState, setPageState] = useState<PageState>('login')
  const [username, setUsername]   = useState('')
  const [password, setPassword]   = useState('')
  const [loginState, setLoginState] = useState<'idle' | 'loading' | 'error'>('idle')
  const [loginError, setLoginError] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/admin/me', { credentials: 'include' })
      .then(r => r.json())
      .then(d => { if (d.authorized) setPageState('dashboard') })
      .catch(() => {})
  }, [])

  async function onLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoginState('loading'); setLoginError(null)
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
        credentials: 'include',
      })
      if (!res.ok) { setLoginState('error'); setLoginError('Credenciales inválidas'); return }
      setPageState('dashboard'); setLoginState('idle')
    } catch { setLoginState('error'); setLoginError('No se pudo iniciar sesión') }
  }

  async function onLogout() {
    await fetch('/api/admin/logout', { method: 'POST', credentials: 'include' })
    router.push('/')
  }

  // ── Login ─────────────────────────────────────────────────────────────────
  if (pageState === 'login') {
    return (
      <main className="min-h-screen flex items-center justify-center px-4 bg-[#07070E]">
        <section className="w-full max-w-sm">
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-2xl overflow-hidden mx-auto mb-4">
              <Image src="/icons/icon-512.png" alt="Radio Bienvenida" width={64} height={64} className="w-full h-full object-contain" />
            </div>
            <h1 className="text-white font-display text-3xl leading-none">Radio Bienvenida</h1>
            <p className="text-[#666690] text-sm mt-1">Panel de control</p>
          </div>
          <div className="bg-[#0F0F1A] border border-[#1A1A2E] rounded-2xl p-6">
            <form onSubmit={onLogin} className="flex flex-col gap-4">
              <label className="flex flex-col gap-1.5">
                <span className="text-[#8888AA] text-xs font-medium">Usuario</span>
                <input value={username} onChange={e => setUsername(e.target.value)}
                  autoComplete="username"
                  className="bg-[#07070E] border border-[#1A1A2E] rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-[#db8918] transition-colors"
                  required disabled={loginState === 'loading'} />
              </label>
              <label className="flex flex-col gap-1.5">
                <span className="text-[#8888AA] text-xs font-medium">Contraseña</span>
                <input value={password} onChange={e => setPassword(e.target.value)}
                  type="password" autoComplete="current-password"
                  className="bg-[#07070E] border border-[#1A1A2E] rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-[#db8918] transition-colors"
                  required disabled={loginState === 'loading'} />
              </label>
              {loginState === 'error' && loginError && (
                <p className="text-red-400 text-xs text-center">{loginError}</p>
              )}
              <button type="submit" disabled={loginState === 'loading'}
                className="mt-2 w-full rounded-xl py-3.5 font-bold text-sm text-white disabled:opacity-60 transition-all"
                style={{ background: '#db8918' }}>
                {loginState === 'loading' ? 'Verificando...' : 'Entrar al panel'}
              </button>
            </form>
          </div>
          <p className="text-[#444468] text-[10px] text-center mt-4">Solo personal autorizado · Powered by BBX</p>
        </section>
      </main>
    )
  }

  // ── Dashboard ──────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#07070E]">
      <div className="max-w-6xl mx-auto px-4 py-5">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl overflow-hidden flex-shrink-0">
              <Image src="/icons/icon-512.png" alt="Radio Bienvenida" width={32} height={32} className="w-full h-full object-contain" />
            </div>
            <div>
              <p className="text-white font-bold text-sm leading-none">Radio Bienvenida</p>
              <p className="text-[#666690] text-xs mt-0.5">Panel de control</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <a href="/" className="text-[#666690] text-xs rounded-lg px-3 py-1.5 bg-[#0F0F1A] border border-[#1A1A2E] hover:text-white transition-colors">
              Ver app
            </a>
            <button onClick={onLogout} className="text-white text-xs rounded-lg px-3 py-1.5 bg-red-600/80 hover:bg-red-500 transition-colors">
              Salir
            </button>
          </div>
        </div>

        {/* KPI bar */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="md:col-span-1">
            <LiveListenerCounter />
          </div>
          <div className="md:col-span-2">
            <AnalyticsPanel />
          </div>
        </div>

        {/* Main grid: 2 cols */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

          {/* Columna izquierda — Operación en vivo */}
          <div className="flex flex-col gap-5">
            <div>
              <p className="text-[#666690] text-[10px] font-bold uppercase tracking-widest mb-3">Operación en vivo</p>
              <SaludosPanel />
            </div>
            <AdsPanel />
            <SolicitudesPanel />
            <PollManager />
          </div>

          {/* Columna derecha — Contenido + Análisis */}
          <div className="flex flex-col gap-5">

            {/* Accesos rápidos al CMS */}
            <div>
              <p className="text-[#666690] text-[10px] font-bold uppercase tracking-widest mb-3">Gestionar contenido</p>
              <div className="grid grid-cols-2 gap-2.5">
                {STUDIO_LINKS.map(link => (
                  <a key={link.label} href={link.href}
                    className="flex items-center gap-3 p-3.5 rounded-xl bg-[#0F0F1A] border border-[#1A1A2E] hover:border-[#db8918]/30 hover:bg-[#0F0F1A] transition-all group">
                    <span className="text-xl flex-shrink-0">{link.icon}</span>
                    <div className="min-w-0">
                      <p className="text-white text-xs font-semibold leading-none">{link.label}</p>
                      <p className="text-[#444468] text-[10px] mt-0.5 leading-tight truncate">{link.desc}</p>
                    </div>
                    <svg className="w-3 h-3 text-[#333355] group-hover:text-[#db8918] transition-colors flex-shrink-0 ml-auto" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
                    </svg>
                  </a>
                ))}
              </div>
            </div>

            {/* Gráfico */}
            <div>
              <p className="text-[#666690] text-[10px] font-bold uppercase tracking-widest mb-3">Tendencia de oyentes</p>
              <ListenerChart />
            </div>

            {/* Soporte */}
            <a href="https://wa.me/56922105555" target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-3 w-full rounded-xl px-4 py-3.5 transition-all hover:opacity-90"
              style={{ background: 'linear-gradient(135deg, #128C7E, #0a6b5f)', boxShadow: '0 4px 20px rgba(18,140,126,0.2)' }}>
              <svg className="w-5 h-5 text-white flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              <div>
                <p className="text-white/70 text-xs">¿Necesitas ayuda?</p>
                <p className="text-white font-bold text-sm">Soporte directo · BBX</p>
              </div>
              <svg className="w-4 h-4 text-white/50 ml-auto" viewBox="0 0 24 24" fill="currentColor">
                <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
              </svg>
            </a>

          </div>
        </div>

        <div className="mt-8 text-center text-[#1A1A2E] text-xs pb-4">Powered by BBX Radio System</div>
      </div>
    </div>
  )
}
