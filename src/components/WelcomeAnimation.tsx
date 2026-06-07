'use client'

import { useEffect, useRef, useState } from 'react'
import {
  WELCOME_BG,
  drawLogoPlaceholder,
  drawWelcomeLogo,
  drawWelcomeParticles,
  loadWelcomeLogo,
  preloadWelcomeLogos,
} from '@/lib/animations/welcomeCanvas'

const SEEN_KEY = 'pulso_welcome_seen'
const EN_VIVO_BOOT_KEY = 'pulso_envivo_boot_v19'

function willPlayEnVivoBoot(): boolean {
  if (typeof window === 'undefined') return false
  if (!window.matchMedia('(max-width: 767px)').matches) return false
  const params = new URLSearchParams(window.location.search)
  if (params.has('skipBoot')) return false
  if (params.has('boot')) return true
  return sessionStorage.getItem(EN_VIVO_BOOT_KEY) !== '1'
}

export function WelcomeAnimation({ onComplete }: { onComplete?: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [playing, setPlaying] = useState(false)

  useEffect(() => {
    if (willPlayEnVivoBoot()) {
      onComplete?.()
      return
    }
    if (sessionStorage.getItem(SEEN_KEY) === '1') {
      onComplete?.()
      return
    }
    preloadWelcomeLogos()
    setPlaying(true)
  }, [onComplete])

  useEffect(() => {
    if (!playing) return
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let raf = 0
    let logoImage: HTMLImageElement | null = null

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const startTime = Date.now()
    const duration = 1000

    void loadWelcomeLogo().then(img => {
      logoImage = img
    })

    function finish() {
      sessionStorage.setItem(SEEN_KEY, '1')
      setPlaying(false)
      onComplete?.()
    }

    function animate() {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)

      ctx!.fillStyle = WELCOME_BG
      ctx!.fillRect(0, 0, canvas!.width, canvas!.height)

      drawWelcomeParticles(ctx!, elapsed, canvas!.width, canvas!.height)

      const logoSize = Math.min(canvas!.width * 0.55, 280)
      const cx = canvas!.width / 2
      const cy = canvas!.height / 2
      const alpha = progress < 0.15 ? progress / 0.15 : progress > 0.85 ? (1 - progress) / 0.15 : 1

      if (logoImage) {
        drawWelcomeLogo(ctx!, logoImage, elapsed, cx, cy, logoSize, { alpha })
      } else {
        drawLogoPlaceholder(ctx!, cx, cy, logoSize, elapsed, alpha)
      }

      if (progress < 1) {
        raf = requestAnimationFrame(animate)
      } else {
        window.setTimeout(finish, 80)
      }
    }

    raf = requestAnimationFrame(animate)

    return () => cancelAnimationFrame(raf)
  }, [onComplete, playing])

  if (!playing) return null

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-50 pointer-events-none"
      style={{ background: WELCOME_BG }}
    />
  )
}
