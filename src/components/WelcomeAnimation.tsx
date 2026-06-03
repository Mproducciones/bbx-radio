'use client'

import { useEffect, useRef, useState } from 'react'

const SEEN_KEY = 'pulso_welcome_seen'

export function WelcomeAnimation({ onComplete }: { onComplete?: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [playing, setPlaying] = useState(false)

  useEffect(() => {
    if (sessionStorage.getItem(SEEN_KEY) === '1') {
      onComplete?.()
      return
    }
    setPlaying(true)
  }, [onComplete])

  useEffect(() => {
    if (!playing) return
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const logoImage = new Image()
    logoImage.src = '/LOGO_BIENVENIDA (1)_PhotoGrid.png'

    const startTime = Date.now()
    const duration = 1000

    function finish() {
      sessionStorage.setItem(SEEN_KEY, '1')
      setPlaying(false)
      onComplete?.()
    }

    function animate() {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)

      ctx!.fillStyle = '#07070E'
      ctx!.fillRect(0, 0, canvas!.width, canvas!.height)

      for (let i = 0; i < 50; i++) {
        const x = (Math.sin(elapsed / 1000 + i) * canvas!.width / 3) + canvas!.width / 2
        const y = (Math.cos(elapsed / 800 + i * 0.5) * canvas!.height / 3) + canvas!.height / 2
        const size = 2 + Math.sin(elapsed / 500 + i) * 1.5
        const alpha = 0.3 + Math.sin(elapsed / 600 + i) * 0.2

        ctx!.beginPath()
        ctx!.arc(x, y, size, 0, Math.PI * 2)
        ctx!.fillStyle = `rgba(219, 137, 24, ${alpha})`
        ctx!.fill()
      }

      if (logoImage.complete && logoImage.naturalWidth > 0) {
        const alpha = progress < 0.2 ? progress / 0.2 : progress > 0.8 ? (1 - progress) / 0.2 : 1

        ctx!.save()
        ctx!.translate(canvas!.width / 2, canvas!.height / 2)

        const zoom = 1 + Math.sin(elapsed / 500) * 0.05
        ctx!.scale(zoom, zoom)

        const logoSize = Math.min(canvas!.width * 0.55, 280)
        ctx!.shadowColor = '#db8918'
        ctx!.shadowBlur = 60 * alpha
        ctx!.beginPath()
        ctx!.arc(0, 0, logoSize / 2 + 10, 0, Math.PI * 2)
        ctx!.fillStyle = `rgba(219, 137, 24, ${alpha * 0.12})`
        ctx!.fill()
        ctx!.shadowBlur = 0

        ctx!.globalAlpha = alpha
        ctx!.drawImage(logoImage, -logoSize / 2, -logoSize / 2, logoSize, logoSize)
        ctx!.restore()
      }

      if (progress < 1) {
        requestAnimationFrame(animate)
      } else {
        setTimeout(finish, 100)
      }
    }

    animate()
  }, [onComplete, playing])

  if (!playing) return null

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-50 pointer-events-none"
    />
  )
}
