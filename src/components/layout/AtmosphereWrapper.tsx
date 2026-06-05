'use client'

import { usePathname } from 'next/navigation'
import { useRadioPlayerContext } from '@/hooks/RadioPlayerContext'
import { AtmosphereCanvas } from '@/components/player/AtmosphereCanvas'
import { useAlbumColors } from '@/hooks/useAlbumColors'

export function AtmosphereWrapper() {
  const pathname = usePathname()
  const { analyser, isPlaying } = useRadioPlayerContext()
  const colors = useAlbumColors()

  /* Visualizador solo en En Vivo — evita glow vacío en otras rutas */
  if (pathname !== '/') return null

  const anchor = 'player' as const

  return (
    <AtmosphereCanvas
      analyser={analyser}
      isPlaying={isPlaying}
      primaryColor={colors.primary}
      secondaryColor={colors.secondary}
      anchor={anchor}
    />
  )
}
