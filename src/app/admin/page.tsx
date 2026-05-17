'use client'

import { useState } from 'react'
import Link from 'next/link'

type LoginState = 'idle' | 'loading' | 'error' | 'success'

export default function AdminLoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [state, setState] = useState<LoginState>('idle')
  const [error, setError] = useState<string | null>(null)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setState('loading')
    setError(null)

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
        credentials: 'include',
      })

      if (!res.ok) {
        setState('error')
        setError('Credenciales inválidas')
        return
      }

      const data = await res.json()
      
      setState('success')
      // Esperar un momento para que la cookie se establezca
      setTimeout(() => {
        window.location.href = '/studio'
      }, 100)
    } catch (err) {
      setState('error')
      setError('No se pudo iniciar sesión')
    }
  }

  return (
    <main className="min-h-[70vh] flex items-center justify-center px-4">
      <section className="w-full max-w-sm rounded-xl border border-[var(--color-ink-700)] bg-[rgba(0,0,0,0.35)] p-5">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-white font-semibold text-lg">Admin</h1>
          <Link href="/" className="text-[var(--color-ink-400)] hover:text-white text-xs transition-colors">
            ← Volver a la app
          </Link>
        </div>

        <form onSubmit={onSubmit} className="flex flex-col gap-3">
          <label className="flex flex-col gap-1">
            <span className="text-[var(--color-ink-400)] text-xs">Usuario</span>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
              className="bg-[var(--color-ink-900)] border border-[var(--color-ink-700)] rounded-lg px-3 py-2 text-white outline-none focus:border-[var(--color-ink-500)]"
              required
              disabled={state === 'loading'}
            />
          </label>

          <label className="flex flex-col gap-1">
            <span className="text-[var(--color-ink-400)] text-xs">Contraseña</span>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              autoComplete="current-password"
              className="bg-[var(--color-ink-900)] border border-[var(--color-ink-700)] rounded-lg px-3 py-2 text-white outline-none focus:border-[var(--color-ink-500)]"
              required
              disabled={state === 'loading'}
            />
          </label>

          {state === 'error' && error && (
            <p className="text-[rgba(255,80,80,0.95)] text-xs">{error}</p>
          )}

          <button
            type="submit"
            disabled={state === 'loading'}
            className="mt-1 w-full rounded-xl bg-gradient-to-r from-[#0055A4] to-[#E8B400] text-black font-semibold py-2 px-4 hover:opacity-95 disabled:opacity-60"
          >
            {state === 'loading' ? 'Entrando...' : 'Ingresar'}
          </button>

          <p className="text-[var(--color-ink-500)] text-[10px] leading-relaxed mt-2">
            Solo personal autorizado.
          </p>
        </form>
      </section>
    </main>
  )
}
