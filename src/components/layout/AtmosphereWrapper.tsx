'use client'

import { useRadioPlayerContext } from '@/hooks/RadioPlayerContext'
import { AtmosphereCanvas } from '@/components/player/AtmosphereCanvas'
import { useAlbumColors } from '@/hooks/useAlbumColors'

export function AtmosphereWrapper() {
  const { analyser, isPlaying } = useRadioPlayerContext()
  const colors = useAlbumColors()
  return (
    <AtmosphereCanvas
      analyser={analyser}
      isPlaying={isPlaying}
      primaryColor={colors.primary}
      secondaryColor={colors.secondary}
    />
  )
}
