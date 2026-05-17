'use client'

import { useEffect, useState } from 'react'
import { urlFor } from '@/lib/sanity'

interface Ad {
  _id: string
  nombre: string
  tipo: string
  imagen?: any
  imagenUrl?: string
  enlace?: string
  activo: boolean
  prioridad: number
}

interface InterstitialPopupProps {
  showAfter?: number // segundos antes de mostrar
  refreshInterval?: number // segundos entre actualizaciones
}

export function InterstitialPopup({ showAfter = 3, refreshInterval = 5 }: InterstitialPopupProps) {
  const [ad, setAd] = useState<Ad | null>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const fetchAd = async () => {
    try {
      const query = `*[_type == "publicidad" && activo == true && tipo == "popup_intersticial"] | order(prioridad desc) {
        _id,
        nombre,
        tipo,
        imagen,
        imagenUrl,
        enlace,
        activo,
        prioridad
      }[0]`

      const response = await fetch(`/api/ads?query=${encodeURIComponent(query)}`)

      if (response.ok) {
        const data = await response.json()
        setAd(data)
      }
    } catch (error) {
      // Error silencioso en producción
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchAd()

    const refreshTimer = setInterval(() => {
      fetchAd()
    }, refreshInterval * 1000)

    return () => clearInterval(refreshTimer)
  }, [refreshInterval])

  useEffect(() => {
    if (!ad || isLoading) return

    const showTimer = setTimeout(() => {
      setIsVisible(true)
    }, showAfter * 1000)

    return () => clearTimeout(showTimer)
  }, [ad, isLoading, showAfter])

  if (!ad || !isVisible) return null

  const imageUrl = ad.imagenUrl || (ad.imagen ? urlFor(ad.imagen).url() : '')

  const handleClose = () => {
    setIsVisible(false)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
      <div className="relative w-full max-w-lg bg-[var(--color-ink-900)] rounded-2xl overflow-hidden shadow-2xl">
        <button
          onClick={handleClose}
          className="absolute top-3 right-3 z-10 bg-black/50 hover:bg-black/70 text-white w-8 h-8 rounded-full flex items-center justify-center transition-colors"
        >
          ✕
        </button>
        
        <a
          href={ad.enlace || '#'}
          target={ad.enlace ? '_blank' : undefined}
          rel={ad.enlace ? 'noopener noreferrer' : undefined}
          onClick={handleClose}
          className="block"
        >
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={ad.nombre}
              className="w-full h-auto object-cover"
              style={{ maxHeight: '70vh' }}
              onError={(e) => {
                e.currentTarget.style.display = 'none'
              }}
            />
          ) : (
            <div className="w-full h-64 flex items-center justify-center bg-gradient-to-r from-[var(--color-mag-800)] to-[var(--color-pur-800)]">
              <span className="text-white text-lg font-medium">{ad.nombre}</span>
            </div>
          )}
        </a>

        <div className="absolute bottom-3 left-3 bg-black/60 text-white text-xs px-2 py-1 rounded">
          Publicidad
        </div>
      </div>
    </div>
  )
}
