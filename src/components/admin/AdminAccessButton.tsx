'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'

/**
 * Componente invisible que detecta presión sostenida con 2 dedos
 * para mostrar un login modal de administrador.
 * 
 * Útil en móvil para acceder al panel sin tener que escribir la URL /studio
 */
export function AdminAccessButton() {
  const router = useRouter()
  const [showModal, setShowModal] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const touchTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const touchCountRef = useRef(0)

  // Detectar presión sostenida con 2 dedos
  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length >= 2) {
        touchCountRef.current = e.touches.length
        touchTimerRef.current = setTimeout(() => {
          if (touchCountRef.current >= 2) {
            setShowModal(true)
          }
        }, 1500) // 1.5 segundos sostenido
      }
    }

    const handleTouchEnd = () => {
      if (touchTimerRef.current) {
        clearTimeout(touchTimerRef.current)
        touchTimerRef.current = null
      }
      touchCountRef.current = 0
    }

    document.addEventListener('touchstart', handleTouchStart, { passive: true })
    document.addEventListener('touchend', handleTouchEnd, { passive: true })
    document.addEventListener('touchcancel', handleTouchEnd, { passive: true })

    return () => {
      document.removeEventListener('touchstart', handleTouchStart)
      document.removeEventListener('touchend', handleTouchEnd)
      document.removeEventListener('touchcancel', handleTouchEnd)
      if (touchTimerRef.current) clearTimeout(touchTimerRef.current)
    }
  }, [])

  const handleLogin = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: email, password }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Error al iniciar sesión')
        return
      }

      setShowModal(false)
      setEmail('')
      setPassword('')
      // Redirigir directo al panel de Sanity Studio
      router.push('/studio')
    } catch {
      setError('Error de conexión')
    } finally {
      setLoading(false)
    }
  }, [email, password, router])

  if (!showModal) return null

  return (
    <div
      className="fixed inset-0 z-[500] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
      onClick={() => setShowModal(false)}
    >
      <div
        className="w-full max-w-sm bg-[var(--color-ink-800)] rounded-2xl border border-[var(--color-ink-600)] p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="text-center mb-5">
          <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-[var(--color-mag-400)]/20 flex items-center justify-center">
            <svg className="w-6 h-6 text-[var(--color-mag-400)]" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 1a11 11 0 1 0 0 22A11 11 0 0 0 12 1zm0 20a9 9 0 1 1 0-18 9 9 0 0 1 0 18zm-1-5h2v2h-2v-2zm0-10h2v8h-2V6z" />
            </svg>
          </div>
          <h2 className="text-white font-semibold text-lg">Acceso Administrativo</h2>
          <p className="text-[var(--color-ink-400)] text-xs mt-1">
            Panel de administración de Radio Bienvenida
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <div>
            <label className="text-[var(--color-ink-300)] text-xs font-medium block mb-1">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@demo.com"
              className="pulso-input text-sm"
              autoComplete="email"
              required
              disabled={loading}
            />
          </div>

          <div>
            <label className="text-[var(--color-ink-300)] text-xs font-medium block mb-1">
              Contraseña
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••"
              className="pulso-input text-sm"
              autoComplete="current-password"
              required
              disabled={loading}
            />
          </div>

          {error && (
            <p className="text-[var(--color-pulso-error)] text-xs text-center">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="pulso-btn pulso-btn-primary w-full justify-center mt-2"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Ingresando...
              </span>
            ) : (
              'Ingresar'
            )}
          </button>
        </form>

      </div>
    </div>
  )
}