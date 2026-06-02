'use client'

import { usePathname } from 'next/navigation'
import { useRadioPlayerContext } from '@/hooks/RadioPlayerContext'
import { AtmosphereCanvas } from '@/components/player/AtmosphereCanvas'
import { useAlbumColors } from '@/hooks/useAlbumColors'

const EXCLUDED = ['/admin', '/studio', '/bbx', '/anunciate']

export function AtmosphereWrapper() {
  const pathname = usePathname()
  const { analyser, isPlaying } = useRadioPlayerContext()
  const colors = useAlbumColors()

  if (EXCLUDED.some(p => pathname.startsWith(p))) return null

  const anchor = pathname === '/' ? 'player' : 'center'

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
