'use client'

import { useEffect, useRef } from 'react'

interface MediastreamEmbedProps {
  streamId: string
  playerId: string
}

export function MediastreamEmbed({ streamId, playerId }: MediastreamEmbedProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const scriptRef = useRef<HTMLScriptElement | null>(null)

  useEffect(() => {
    if (!containerRef.current) return

    // Remove any previous script
    if (scriptRef.current) {
      scriptRef.current.remove()
      scriptRef.current = null
    }

    // Set Mediastream data attributes
    containerRef.current.setAttribute('data-msp', '')
    containerRef.current.setAttribute('data-type', 'live')
    containerRef.current.setAttribute('data-id', streamId)
    containerRef.current.setAttribute('data-player', playerId)

    // Inject Mediastream script
    const script = document.createElement('script')
    script.type = 'text/javascript'
    script.src = 'https://player.cdn.mdstrm.com/lightning_player/api.js'
    script.async = true
    containerRef.current.appendChild(script)
    scriptRef.current = script

    return () => {
      script.remove()
    }
  }, [streamId, playerId])

  return (
    <div
      ref={containerRef}
      className="relative w-full rounded-xl overflow-hidden bg-black"
      style={{ paddingTop: '56.25%', minHeight: '200px' }}
    >
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="flex flex-col items-center gap-2 text-[var(--color-ink-400)]">
          <span className="text-2xl">📺</span>
          <p className="text-xs">Cargando Bienvenida TV...</p>
        </div>
      </div>
    </div>
  )
}
