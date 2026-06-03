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
import { NotificacionPanel } from '@/components/admin/NotificacionPanel'
import { ContestsPanel } from '@/components/admin/ContestsPanel'
import { ReportsPanel } from '@/components/admin/ReportsPanel'
import { AdminPageBackground } from '@/components/admin/adminUi'

type PageState = 'login' | 'dashboard'

const STUDIO_LINKS = [
  {
    label: 'Programación',
    desc: 'Parrilla semanal',
    color: '#FF006E',
    href: '/studio',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
        <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z" strokeLinecap="round" />
        <path d="M19 10v2a7 7 0 0 1-14 0v-2" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    label: 'Publicidad',
    desc: 'Campañas y banners',
    color: '#db8918',
    href: '/studio',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
        <path d="M22 12h-4l-3 9L9 3l-3 9H2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    label: 'Replay',
    desc: 'Episodios anteriores',
    color: '#00D9A0',
    href: '/studio',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
        <circle cx="12" cy="12" r="10" />
        <polygon points="10 8 16 12 10 16 10 8" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
]

export default function AdminPage() {
  const router = useRouter()
  const [pageState, setPageState] = useState<PageState>('login')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
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

  if (pageState === 'login') {
    return (
      <main className="relative min-h-screen flex items-center justify-center px-4">
        <AdminPageBackground />
        <section className="w-full max-w-sm relative">
          <div className="text-center mb-8">
            <div
              className="w-[4.5rem] h-[4.5rem] rounded-2xl overflow-hidden mx-auto mb-5 p-1"
              style={{ background: 'linear-gradient(135deg, #db8918, #40B9BF)', boxShadow: '0 12px 40px rgba(219,137,24,0.25)' }}
            >
              <div className="w-full h-full rounded-xl overflow-hidden bg-[#0e0e16]">
                <Image src="/icons/icon-512.png" alt="Radio Bienvenida" width={72} height={72} className="w-full h-full object-contain" />
              </div>
            </div>
            <h1 className="text-white font-display text-3xl leading-none">Radio Bienvenida</h1>
            <p className="text-white/40 text-sm mt-2">Panel de control · 93.3 FM</p>
          </div>
          <div
            className="rounded-2xl overflow-hidden backdrop-blur-md"
            style={{ background: 'rgba(14,14,22,0.95)', border: '1px solid rgba(255,255,255,0.08)', boxShadow: '0 16px 48px rgba(0,0,0,0.4)' }}
          >
            <div className="h-1 w-full" style={{ background: 'linear-gradient(90deg, #db8918, #40B9BF, #7D59B5)' }} />
            <form onSubmit={onLogin} className="flex flex-col gap-4 p-6">
              <label className="flex flex-col gap-1.5">
                <span className="text-white/50 text-xs font-semibold uppercase tracking-wide">Usuario</span>
                <input value={username} onChange={e => setUsername(e.target.value)}
                  autoComplete="username"
                  className="rounded-xl px-4 py-3 text-white text-sm outline-none transition-all focus:ring-2 focus:ring-[#db8918]/40"
                  style={{ background: 'rgba(0,0,0,0.35)', border: '1px solid rgba(255,255,255,0.1)' }}
                  required disabled={loginState === 'loading'} />
              </label>
              <label className="flex flex-col gap-1.5">
                <span className="text-white/50 text-xs font-semibold uppercase tracking-wide">Contraseña</span>
                <input value={password} onChange={e => setPassword(e.target.value)}
                  type="password" autoComplete="current-password"
                  className="rounded-xl px-4 py-3 text-white text-sm outline-none transition-all focus:ring-2 focus:ring-[#db8918]/40"
                  style={{ background: 'rgba(0,0,0,0.35)', border: '1px solid rgba(255,255,255,0.1)' }}
                  required disabled={loginState === 'loading'} />
              </label>
              {loginState === 'error' && loginError && (
                <p className="text-red-400 text-xs text-center bg-red-500/10 rounded-lg py-2">{loginError}</p>
              )}
              <button type="submit" disabled={loginState === 'loading'}
                className="mt-1 w-full rounded-xl py-3.5 font-bold text-sm text-[#07070E] disabled:opacity-60 transition-all active:scale-[0.98]"
                style={{ background: 'linear-gradient(135deg, #db8918, #e8a840)', boxShadow: '0 4px 20px rgba(219,137,24,0.3)' }}>
                {loginState === 'loading' ? 'Verificando...' : 'Entrar al panel'}
              </button>
            </form>
          </div>
          <p className="text-white/20 text-[10px] text-center mt-5">Solo personal autorizado · Powered by BBX</p>
        </section>
      </main>
    )
  }

  return (
    <div className="relative min-h-screen">
      <AdminPageBackground />

      {/* Header sticky */}
      <header
        className="sticky top-0 z-50 backdrop-blur-xl"
        style={{ background: 'rgba(7,7,14,0.85)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}
      >
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div
              className="w-10 h-10 rounded-xl overflow-hidden shrink-0 p-0.5"
              style={{ background: 'linear-gradient(135deg, #db8918, #40B9BF)' }}
            >
              <div className="w-full h-full rounded-[10px] overflow-hidden bg-[#0e0e16]">
                <Image src="/icons/icon-512.png" alt="" width={40} height={40} className="w-full h-full object-contain" />
              </div>
            </div>
            <div className="min-w-0">
              <p className="text-white font-bold text-sm leading-none truncate">Radio Bienvenida</p>
              <p className="text-white/40 text-xs mt-0.5">Panel de control</p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <a href="/"
              className="text-white/60 text-xs rounded-xl px-3 py-2 hover:text-white transition-colors hidden sm:inline-flex"
              style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)' }}>
              Ver app →
            </a>
            <button onClick={onLogout}
              className="text-xs rounded-xl px-3 py-2 font-semibold transition-colors active:scale-95"
              style={{ background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.25)', color: '#f87171' }}>
              Salir
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-5 pb-10">
        {/* KPI hero */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 mb-6">
          <div className="lg:col-span-2">
            <LiveListenerCounter />
          </div>
          <div className="lg:col-span-3">
            <AnalyticsPanel />
          </div>
        </div>

        {/* Main grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <div className="flex flex-col gap-5">
            <section>
              <p className="text-white/35 text-[10px] font-bold uppercase tracking-[0.2em] mb-3">Operación en vivo</p>
              <SaludosPanel />
            </section>
            <AdsPanel />
            <ContestsPanel />
            <SolicitudesPanel />
            <PollManager />
          </div>

          <div className="flex flex-col gap-5">
            <section>
              <p className="text-white/35 text-[10px] font-bold uppercase tracking-[0.2em] mb-3">Comunicaciones</p>
              <NotificacionPanel />
            </section>

            <section>
              <p className="text-white/35 text-[10px] font-bold uppercase tracking-[0.2em] mb-3">Gestionar contenido</p>
              <div className="grid grid-cols-3 gap-2.5">
                {STUDIO_LINKS.map(link => (
                  <a key={link.label} href={link.href}
                    className="group relative flex flex-col items-center gap-2 p-3.5 sm:p-4 rounded-2xl transition-all overflow-hidden active:scale-[0.98]"
                    style={{ background: 'rgba(14,14,22,0.92)', border: `1px solid ${link.color}22`, boxShadow: '0 4px 20px rgba(0,0,0,0.2)' }}
                  >
                    <div
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
                      style={{ background: `radial-gradient(circle at 50% 0%, ${link.color}12, transparent 70%)` }}
                    />
                    <div
                      className="relative w-10 h-10 rounded-xl flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform"
                      style={{ background: `${link.color}16`, color: link.color }}
                    >
                      {link.icon}
                    </div>
                    <div className="text-center relative">
                      <p className="text-white text-[11px] font-bold leading-tight">{link.label}</p>
                      <p className="text-white/35 text-[9px] mt-0.5 leading-tight hidden sm:block">{link.desc}</p>
                    </div>
                  </a>
                ))}
              </div>
            </section>

            <ReportsPanel />

            <section>
              <p className="text-white/35 text-[10px] font-bold uppercase tracking-[0.2em] mb-3">Tendencia de oyentes</p>
              <ListenerChart />
            </section>

            <a href="https://wa.me/56922105555" target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-3 w-full rounded-2xl px-4 py-4 transition-all hover:opacity-95 active:scale-[0.99]"
              style={{ background: 'linear-gradient(135deg, rgba(18,140,126,0.2), rgba(10,107,95,0.15))', border: '1px solid rgba(18,140,126,0.35)', boxShadow: '0 4px 24px rgba(18,140,126,0.12)' }}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: '#128C7E' }}>
                <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
              </div>
              <div className="min-w-0">
                <p className="text-white/50 text-xs">¿Necesitas ayuda?</p>
                <p className="text-white font-bold text-sm">Soporte directo · BBX</p>
              </div>
              <svg className="w-4 h-4 text-white/30 ml-auto shrink-0" viewBox="0 0 24 24" fill="currentColor">
                <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
              </svg>
            </a>
          </div>
        </div>

        <p className="mt-10 text-center text-white/15 text-xs">Powered by BBX Radio System</p>
      </div>
    </div>
  )
}
