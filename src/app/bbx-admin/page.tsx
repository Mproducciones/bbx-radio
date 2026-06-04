'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Shield } from 'lucide-react'
import { AdminPageBackground, AdminGhostButton } from '@/components/admin/adminUi'
import { AdminLoginScreen } from '@/components/admin/AdminLoginScreen'
import { BillingPanel } from '@/components/admin/BillingPanel'

type PageState = 'login' | 'dashboard'

export default function BbxAdminPage() {
  const router = useRouter()
  const [pageState, setPageState] = useState<PageState>('login')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loginState, setLoginState] = useState<'idle' | 'loading' | 'error'>('idle')
  const [loginError, setLoginError] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/admin/me', { credentials: 'include' })
      .then(r => r.json())
      .then(d => {
        if (d.superAdmin) setPageState('dashboard')
        else if (d.radioAdmin) router.replace('/admin')
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
        body: JSON.stringify({ username, password, scope: 'bbx' }),
        credentials: 'include',
      })
      if (!res.ok) {
        setLoginState('error')
        setLoginError('Credenciales de super admin inválidas')
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
    setPageState('login')
    setUsername('')
    setPassword('')
  }

  if (pageState === 'login') {
    return (
      <AdminLoginScreen
        eyebrow="BBX · Super admin"
        title="Suscripciones"
        subtitle="Gestión de pagos de todas las radios"
        accentBar="bbx"
        footer="Acceso restringido · No compartir este enlace"
      >
        <form onSubmit={onLogin} className="flex flex-col gap-4 p-6">
          <label className="flex flex-col gap-1.5">
            <span className="admin-eyebrow">Usuario BBX</span>
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
            <p className="text-red-400 text-xs text-center bg-red-500/10 rounded-lg py-2 border border-red-500/20">
              {loginError}
            </p>
          )}
          <button type="submit" disabled={loginState === 'loading'} className="admin-btn-primary mt-1">
            {loginState === 'loading' ? 'Verificando…' : 'Entrar a suscripciones'}
          </button>
        </form>
      </AdminLoginScreen>
    )
  }

  return (
    <div className="relative min-h-screen admin-mesh">
      <AdminPageBackground />

      <header className="sticky top-0 z-50 admin-topbar">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div
              className="admin-brand-mark shrink-0"
              style={{ background: 'linear-gradient(135deg, #00D9A0, #40B9BF)' }}
            >
              <div className="admin-brand-mark__inner flex items-center justify-center font-display text-sm text-[#00D9A0]">
                BBX
              </div>
            </div>
            <div className="min-w-0">
              <p className="text-white font-bold text-sm leading-none truncate flex items-center gap-1.5">
                BBX Radio System
                <span
                  className="inline-flex items-center gap-0.5 text-[9px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded-full"
                  style={{ background: 'rgba(0,217,160,0.12)', color: '#00D9A0', border: '1px solid rgba(0,217,160,0.28)' }}
                >
                  <Shield className="w-3 h-3" aria-hidden />
                  Super admin
                </span>
              </p>
              <p className="text-white/45 text-xs mt-0.5 truncate">Suscripciones · todas las radios</p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <AdminGhostButton href="/">Ver app</AdminGhostButton>
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

      <main className="max-w-3xl mx-auto px-4 py-6 pb-12">
        <BillingPanel />
        <p className="mt-10 text-center text-white/20 text-[10px] tracking-[0.18em] uppercase">
          BBX Radio System · Panel de suscripciones
        </p>
      </main>
    </div>
  )
}
