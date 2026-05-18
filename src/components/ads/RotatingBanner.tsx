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

interface RotatingBannerProps {
  interval?: number // segundos entre cambios de banner
  position?: 'top' | 'middle' | 'bottom'
  refreshInterval?: number // segundos entre actualizaciones de anuncios
}

export function RotatingBanner({ interval = 5, position = 'top', refreshInterval = 5 }: RotatingBannerProps) {
  const [ads, setAds] = useState<Ad[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

  // Función para cargar anuncios
  const fetchAds = async () => {
    try {
      // Mapear posición a tipo de banner
      const tipoMap = {
        top: 'banner-top',
        middle: 'banner-middle',
        bottom: 'banner-bottom',
      }

      const tipo = tipoMap[position]
      const response = await fetch(`/api/ads?tipo=${encodeURIComponent(tipo)}`)

      if (response.ok) {
        const data = await response.json()
        setAds(data)
      }
    } catch (error) {
      // Error silencioso en producción
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    // Cargar anuncios iniciales
    fetchAds()

    // Actualizar anuncios periódicamente sin interrumpir el reproductor
    const refreshTimer = setInterval(() => {
      fetchAds()
    }, refreshInterval * 1000)

    return () => clearInterval(refreshTimer)
  }, [refreshInterval])

  useEffect(() => {
    if (ads.length <= 1) return

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % ads.length)
    }, interval * 1000)

    return () => clearInterval(timer)
  }, [ads.length, interval])

  if (isLoading || ads.length === 0) {
    return null
  }

  const currentAd = ads[currentIndex]
  
  if (!currentAd) {
    return null
  }
  
  const imageUrl = currentAd.imagenUrl || (currentAd.imagen ? urlFor(currentAd.imagen).url() : '')

  const bannerStyles = {
    top: 'w-full max-w-4xl mx-auto mb-4',
    middle: 'w-full max-w-4xl mx-auto my-8',
    bottom: 'w-full max-w-4xl mx-auto mt-4',
  }

  return (
    <div className={bannerStyles[position]}>
      <a
        href={currentAd.enlace || '#'}
        target={currentAd.enlace ? '_blank' : undefined}
        rel={currentAd.enlace ? 'noopener noreferrer' : undefined}
        className="block relative overflow-hidden rounded-xl shadow-lg w-full bg-[var(--color-ink-800)]"
      >
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={currentAd.nombre}
            className="w-full h-auto object-cover transition-opacity duration-500"
            style={{ maxHeight: '200px', minHeight: '100px' }}
            onError={(e) => {
              e.currentTarget.style.display = 'none'
            }}
          />
        ) : (
          <div className="w-full h-32 flex items-center justify-center bg-gradient-to-r from-[var(--color-mag-800)] to-[var(--color-pur-800)]">
            <span className="text-white text-sm font-medium">{currentAd.nombre}</span>
          </div>
        )}
        <div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded">
          Anuncio
        </div>
      </a>
    </div>
  )
}
