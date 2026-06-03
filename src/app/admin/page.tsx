'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { AdminPageBackground } from '@/components/admin/adminUi'
import { AdminSidebarNav, AdminMobileNav, type AdminSection, ADMIN_SECTIONS } from '@/components/admin/AdminNav'
import { AdminSectionContent } from '@/components/admin/AdminSectionContent'

type PageState = 'login' | 'dashboard'

export default function AdminPage() {
  const router = useRouter()
  const [pageState, setPageState] = useState<PageState>('login')
  const [section, setSection] = useState<AdminSection>('overview')
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

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    if (params.get('billing') === 'success') setSection('billing')
  }, [pageState])

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

  const sectionMeta = ADMIN_SECTIONS.find(s => s.id === section)

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

      <header
        className="sticky top-0 z-50 backdrop-blur-xl"
        style={{ background: 'rgba(7,7,14,0.85)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}
      >
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
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
              <p className="text-white/40 text-xs mt-0.5 truncate">
                {sectionMeta?.label ?? 'Panel de control'}
              </p>
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

      <AdminMobileNav active={section} onChange={setSection} />

      <div className="max-w-7xl mx-auto px-4 py-5 pb-10 flex gap-6 lg:gap-8">
        <AdminSidebarNav active={section} onChange={setSection} />

        <main className="flex-1 min-w-0">
          <AdminSectionContent section={section} />
          <p className="mt-10 text-center text-white/15 text-xs">Powered by BBX Radio System</p>
        </main>
      </div>
    </div>
  )
}
