/**
 * Animación de bienvenida
 * 
 * Pantalla negra con luces de colores volando y logo animado.
 * Dura 2 segundos antes de entrar a la app.
 */

'use client'

import { useEffect, useRef, useState } from 'react'

export function WelcomeAnimation({ onComplete }: { onComplete?: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    // Logo
    const logoImage = new Image()
    logoImage.src = '/LOGO_BIENVENIDA (1)_PhotoGrid.png'

    const startTime = Date.now()
    const duration = 1000

    function animate() {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)

      // Fondo negro
      ctx!.fillStyle = '#07070E'
      ctx!.fillRect(0, 0, canvas!.width, canvas!.height)

      // Puntos de colores animados (luces volando)
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

      if (logoImage.complete) {
        const alpha = progress < 0.2 ? progress / 0.2 : progress > 0.8 ? (1 - progress) / 0.2 : 1

        ctx!.save()
        ctx!.translate(canvas!.width / 2, canvas!.height / 2)

        // Zoom in - zoom out simple
        const zoom = 1 + Math.sin(elapsed / 500) * 0.15
        ctx!.scale(zoom, zoom)

        // Glow
        ctx!.shadowColor = '#db8918'
        ctx!.shadowBlur = 40 * alpha
        ctx!.beginPath()
        ctx!.arc(0, 0, 80, 0, Math.PI * 2)
        ctx!.fillStyle = `rgba(219, 137, 24, ${alpha * 0.15})`
        ctx!.fill()
        ctx!.shadowBlur = 0

        // Logo
        ctx!.globalAlpha = alpha
        const logoSize = 80
        ctx!.drawImage(logoImage, -logoSize / 2, -logoSize / 2, logoSize, logoSize)
        ctx!.restore()
      }

      if (progress < 1) {
        requestAnimationFrame(animate)
      } else {
        setTimeout(() => {
          setIsVisible(false)
          if (onComplete) onComplete()
        }, 100)
      }
    }

    animate()
  }, [onComplete])

  if (!isVisible) return null

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-[5] pointer-events-none"
    />
  )
}