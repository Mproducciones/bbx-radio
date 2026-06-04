'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { AdminPageBackground } from '@/components/admin/adminUi'
import { AdminLoginScreen } from '@/components/admin/AdminLoginScreen'
import { AdminSidebarNav, AdminMobileNav, type AdminSection, ADMIN_SECTIONS } from '@/components/admin/AdminNav'
import { AdminSectionContent } from '@/components/admin/AdminSectionContent'
import { adminLoginErrorMessage } from '@/lib/adminLoginErrors'

type PageState = 'login' | 'dashboard'

export default function AdminPage() {
  const router = useRouter()
  const [pageState, setPageState] = useState<PageState>('login')
  const [section, setSection] = useState<AdminSection>('commercial')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loginState, setLoginState] = useState<'idle' | 'loading' | 'error'>('idle')
  const [loginError, setLoginError] = useState<string | null>(null)

  useEffect(() => {
    const q = new URLSearchParams(window.location.search).get('section')
    if (q === 'overview' || q === 'live' || q === 'commercial' || q === 'comms' || q === 'content') {
      setSection(q)
    }
  }, [])

  useEffect(() => {
    fetch('/api/admin/me', { credentials: 'include' })
      .then(r => r.json())
      .then(d => {
        if (d.superAdmin && !d.radioAdmin) {
          router.replace('/bbx-admin')
          return
        }
        if (d.radioAdmin) setPageState('dashboard')
      })
      .catch(() => {})
  }, [router])

  async function onLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoginState('loading')
    setLoginError(null)
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password, scope: 'radio' }),
        credentials: 'include',
      })
      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        setLoginState('error')
        setLoginError(adminLoginErrorMessage(res.status, body))
        return
      }
      const me = await fetch('/api/admin/me', { credentials: 'include' }).then(r => r.json())
      if (me.superAdmin && !me.radioAdmin) {
        router.replace('/bbx-admin')
        return
      }
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

  const sectionMeta = ADMIN_SECTIONS.find(s => s.id === section)

  if (pageState === 'login') {
    return (
      <AdminLoginScreen
        eyebrow="Panel operativo"
        title="Radio Bienvenida"
        subtitle="Publicidad, en vivo y contenido · 93.3 FM"
      >
        <form onSubmit={onLogin} className="flex flex-col gap-5 p-7 sm:p-8">
          <label className="flex flex-col gap-1.5">
            <span className="admin-eyebrow">Usuario</span>
            <input
              value={username}
              onChange={e => setUsername(e.target.value)}
              autoComplete="username"
              className="admin-input"
              required
              disabled={loginState === 'loading'}
            />
          </label>
          <label className="flex flex-col gap-1.5">
            <span className="admin-eyebrow">Contraseña</span>
            <input
              value={password}
              onChange={e => setPassword(e.target.value)}
              type="password"
              autoComplete="current-password"
              className="admin-input"
              required
              disabled={loginState === 'loading'}
            />
          </label>
          {loginState === 'error' && loginError && (
            <p className="text-red-400 text-sm text-center bg-red-500/10 rounded-xl py-3 px-3 border border-red-500/20">
              {loginError}
            </p>
          )}
          <button type="submit" disabled={loginState === 'loading'} className="admin-btn-primary mt-1">
            {loginState === 'loading' ? 'Verificando…' : 'Entrar al panel'}
          </button>
        </form>
      </AdminLoginScreen>
    )
  }

  return (
    <div className="relative min-h-screen admin-mesh">
      <AdminPageBackground />

      <header className="sticky top-0 z-50 admin-topbar">
        <div className="max-w-7xl mx-auto px-4 py-3.5 sm:py-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="admin-brand-mark shrink-0">
              <div className="admin-brand-mark__inner">
                <Image src="/icons/icon-512.png" alt="" width={48} height={48} className="w-full h-full object-contain" />
              </div>
            </div>
            <div className="min-w-0">
              <p className="text-white font-display text-lg sm:text-xl leading-none truncate tracking-wide">Radio Bienvenida</p>
              <p className="text-white/50 text-sm sm:text-base mt-1 truncate">
                {sectionMeta?.label ?? 'Panel'} · 93.3 FM
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2.5 shrink-0">
            <a href="/" className="admin-btn-ghost hidden sm:inline-flex">
              Ver app <span aria-hidden>→</span>
            </a>
            <button type="button" onClick={onLogout} className="admin-btn-danger">
              Salir
            </button>
          </div>
        </div>
      </header>

      <AdminMobileNav active={section} onChange={setSection} />
      <div className="max-w-7xl mx-auto px-4 py-6 sm:py-8 pb-12 flex gap-6 lg:gap-8">
        <AdminSidebarNav active={section} onChange={setSection} />
        <main className="flex-1 min-w-0 admin-section-enter">
          <AdminSectionContent section={section} />
          <p className="mt-10 text-center text-white/25 text-xs tracking-[0.14em] uppercase">
            Powered by BBX Radio System
          </p>
        </main>
      </div>
    </div>
  )
}
