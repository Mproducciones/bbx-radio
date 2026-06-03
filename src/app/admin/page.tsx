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
  const [superAdmin, setSuperAdmin] = useState(false)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loginState, setLoginState] = useState<'idle' | 'loading' | 'error'>('idle')
  const [loginError, setLoginError] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/admin/me', { credentials: 'include' })
      .then(r => r.json())
      .then(d => {
        if (d.authorized) setPageState('dashboard')
        setSuperAdmin(!!d.superAdmin)
      })
      .catch(() => {})
  }, [])

  useEffect(() => {
    if (!superAdmin && section === 'billing') setSection('overview')
  }, [superAdmin, section])

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    if (params.get('billing') === 'success' && superAdmin) setSection('billing')
  }, [pageState, superAdmin])

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
      const me = await fetch('/api/admin/me', { credentials: 'include' }).then(r => r.json())
      setSuperAdmin(!!me.superAdmin)
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
      <main className="relative min-h-screen flex items-center justify-center px-4 admin-mesh">
        <AdminPageBackground />
        <section className="w-full max-w-sm relative">
          <div className="text-center mb-8">
            <div className="admin-brand-mark mx-auto mb-5">
              <div className="admin-brand-mark__inner">
                <Image src="/icons/icon-512.png" alt="Radio Bienvenida" width={72} height={72} className="w-full h-full object-contain" />
              </div>
            </div>
            <p className="pro-eyebrow mb-2">Studio · BBX</p>
            <h1 className="text-white font-display text-3xl leading-none tracking-wide">Radio Bienvenida</h1>
            <p className="text-white/45 text-sm mt-2">Panel de control · 93.3 FM</p>
          </div>
          <div className="admin-login-card">
            <div className="admin-login-card__bar" aria-hidden />
            <form onSubmit={onLogin} className="flex flex-col gap-4 p-6">
              <label className="flex flex-col gap-1.5">
                <span className="admin-eyebrow">Usuario</span>
                <input value={username} onChange={e => setUsername(e.target.value)}
                  autoComplete="username"
                  className="admin-input"
                  required disabled={loginState === 'loading'} />
              </label>
              <label className="flex flex-col gap-1.5">
                <span className="admin-eyebrow">Contraseña</span>
                <input value={password} onChange={e => setPassword(e.target.value)}
                  type="password" autoComplete="current-password"
                  className="admin-input"
                  required disabled={loginState === 'loading'} />
              </label>
              {loginState === 'error' && loginError && (
                <p className="text-red-400 text-xs text-center bg-red-500/10 rounded-lg py-2 border border-red-500/20">{loginError}</p>
              )}
              <button type="submit" disabled={loginState === 'loading'} className="admin-btn-primary mt-1">
                {loginState === 'loading' ? 'Verificando…' : 'Entrar al panel'}
              </button>
            </form>
          </div>
          <p className="text-white/20 text-[10px] text-center mt-5 tracking-wide">Solo personal autorizado · Powered by BBX</p>
        </section>
      </main>
    )
  }

  return (
    <div className="relative min-h-screen admin-mesh">
      <AdminPageBackground />

      <header className="sticky top-0 z-50 admin-topbar">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="admin-brand-mark shrink-0">
              <div className="admin-brand-mark__inner">
                <Image src="/icons/icon-512.png" alt="" width={40} height={40} className="w-full h-full object-contain" />
              </div>
            </div>
            <div className="min-w-0">
              <p className="text-white font-bold text-sm leading-none truncate">Radio Bienvenida</p>
              <p className="text-white/45 text-xs mt-0.5 truncate">
                {sectionMeta?.label ?? 'Panel de control'}
                {superAdmin ? ' · Super admin' : ' · Studio'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <a href="/" className="admin-btn-ghost hidden sm:inline-flex items-center gap-1">
              Ver app <span aria-hidden>→</span>
            </a>
            <button
              type="button"
              onClick={onLogout}
              className="text-xs rounded-xl px-3 py-2 font-semibold transition-colors active:scale-95"
              style={{ background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.25)', color: '#f87171' }}
            >
              Salir
            </button>
          </div>
        </div>
      </header>

      <AdminMobileNav active={section} onChange={setSection} superAdmin={superAdmin} />

      <div className="max-w-7xl mx-auto px-4 py-5 pb-10 flex gap-6 lg:gap-8">
        <AdminSidebarNav active={section} onChange={setSection} superAdmin={superAdmin} />

        <main className="flex-1 min-w-0">
          <AdminSectionContent section={section} superAdmin={superAdmin} />
          <p className="mt-10 text-center text-white/20 text-[10px] tracking-[0.18em] uppercase">Powered by BBX Radio System</p>
        </main>
      </div>
    </div>
  )
}
