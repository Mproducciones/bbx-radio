'use client'

import { useEffect, useState } from 'react'

export function LoadingScreen() {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false)
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  if (!isVisible) return null

  return (
    <div className="fixed inset-0 z-[5] flex items-center justify-center bg-[#07070E]">
      <div className="flex flex-col items-center gap-6">
        <div className="relative">
          <div className="absolute inset-0 bg-[#db8918] rounded-full blur-xl opacity-50 animate-pulse" />
          <div className="relative w-24 h-24 bg-gradient-to-br from-[#db8918] to-[#b56b0f] rounded-full flex items-center justify-center shadow-2xl">
            <span className="font-display text-4xl text-white font-bold">93.3</span>
          </div>
        </div>
        <div className="flex flex-col items-center gap-2">
          <h1 className="font-display text-2xl text-white">Radio Bienvenida</h1>
          <p className="text-[var(--color-ink-400)] text-sm">Cargando...</p>
        </div>
        <div className="w-48 h-1 bg-[var(--color-ink-800)] rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-[#db8918] to-[#b56b0f]" style={{ animation: 'loading 2s ease-in-out' }} />
        </div>
      </div>
      <style>{`
        @keyframes loading {
          0% { width: 0%; }
          100% { width: 100%; }
        }
      `}</style>
    </div>
  )
}
