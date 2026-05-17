'use client'

import { useEffect, useState } from 'react'

type Platform = 'ios' | 'android' | 'other'

function getPlatform(): Platform {
  if (typeof navigator === 'undefined') return 'other'
  const ua = navigator.userAgent
  if (/iphone|ipad|ipod/i.test(ua)) return 'ios'
  if (/android/i.test(ua)) return 'android'
  return 'other'
}

function isInStandaloneMode(): boolean {
  if (typeof window === 'undefined') return false
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    ('standalone' in window.navigator && (window.navigator as any).standalone === true)
  )
}

export function InstallBanner() {
  const [show, setShow] = useState(false)
  const [platform, setPlatform] = useState<Platform>('other')
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)

  useEffect(() => {
    if (isInStandaloneMode()) return
    if (localStorage.getItem('pwa-install-dismissed')) return

    const plat = getPlatform()
    setPlatform(plat)

    if (plat === 'android') {
      const handler = (e: Event) => {
        e.preventDefault()
        setDeferredPrompt(e)
        setShow(true)
      }
      window.addEventListener('beforeinstallprompt', handler)
      return () => window.removeEventListener('beforeinstallprompt', handler)
    }

    if (plat === 'ios') {
      // Mostrar banner de instrucciones en iOS
      setTimeout(() => setShow(true), 3000)
    }
  }, [])

  const handleInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt()
      const { outcome } = await deferredPrompt.userChoice
      if (outcome === 'accepted') setShow(false)
      setDeferredPrompt(null)
    }
  }

  const handleDismiss = () => {
    setShow(false)
    localStorage.setItem('pwa-install-dismissed', '1')
  }

  if (!show) return null

  return (
    <div className="fixed bottom-[72px] left-3 right-3 z-[900] md:hidden">
      <div className="bg-[#0F0F1A] border border-[#db8918]/40 rounded-2xl p-4 shadow-2xl shadow-black/60">
        <div className="flex items-start gap-3">
          {/* Ícono */}
          <div className="w-12 h-12 rounded-xl bg-[#db8918]/10 border border-[#db8918]/20 flex items-center justify-center flex-shrink-0 overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/icons/icon-96.png" alt="Radio Bienvenida" className="w-10 h-10 object-contain" />
          </div>

          <div className="flex-1 min-w-0">
            <p className="text-white font-bold text-sm">Instala la app</p>
            <p className="text-[#666690] text-xs mt-0.5 leading-relaxed">
              {platform === 'ios'
                ? 'Toca el ícono Compartir ↑ y luego "Agregar a inicio"'
                : 'Accede rápido sin abrir el navegador'}
            </p>

            {platform === 'android' && (
              <button
                onClick={handleInstall}
                className="mt-2 bg-[#db8918] text-white text-xs font-bold px-4 py-1.5 rounded-lg"
              >
                Instalar
              </button>
            )}

            {platform === 'ios' && (
              <div className="mt-2 flex items-center gap-1.5 text-xs text-[#db8918]">
                <ShareIcon className="w-4 h-4 flex-shrink-0" />
                <span>→ Agregar a inicio</span>
              </div>
            )}
          </div>

          <button
            onClick={handleDismiss}
            className="text-[#444468] hover:text-white transition-colors p-1 flex-shrink-0"
            aria-label="Cerrar"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}

function ShareIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M16 5l-1.42 1.42-1.59-1.59V16h-1.98V4.83L9.42 6.42 8 5l4-4 4 4zm4 5v11c0 1.1-.9 2-2 2H6c-1.11 0-2-.89-2-2V10c0-1.11.89-2 2-2h3v2H6v11h12V10h-3V8h3c1.1 0 2 .89 2 2z" />
    </svg>
  )
}
