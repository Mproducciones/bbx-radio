'use client'

import { useCallback } from 'react'
import { VinylDiscFrame } from './VinylDiscFrame'
import {
  ENVIVO_VINYL_ANCHOR_ID,
  ENVIVO_VINYL_DISC_ID,
  VINYL_DISC_SIZE,
  VINYL_OUTER,
} from '@/lib/player/vinylMetrics'
import type { BootMorphSnapshot } from '@/lib/player/bootMorphStore'
import { useBootMorphDrive, useBootMorphLogoVisible, useBootMorphEqOpacity, useBootMorphPlayerLogoOpacity, useBootMorphVinylScale } from '@/hooks/useBootMorphDrive'
import { useEnVivoBoot, useEnVivoIntroActive } from './EnVivoBootMotion'

interface EnVivoVinylIntroProps {
  primary: string
  secondary: string
  isPlaying: boolean
  isLoading: boolean
  circularBars: React.ReactNode
  dotGrid: React.ReactNode
  interactiveLogo: React.ReactNode
}

/** Vinilo único: logo y ∞ se transforman sin desaparecer → EQ del reproductor. */
export function EnVivoVinylIntro({
  primary,
  secondary,
  isPlaying,
  isLoading,
  circularBars,
  dotGrid,
  interactiveLogo,
}: EnVivoVinylIntroProps) {
  const introActive = useEnVivoIntroActive()
  const { handoffRotationRad } = useEnVivoBoot()
  const showPlayerLogo = useBootMorphLogoVisible()
  const playerEqOpacity = useBootMorphEqOpacity()
  const playerLogoOpacity = useBootMorphPlayerLogoOpacity()
  const vinylScale = useBootMorphVinylScale()

  const applyMorph = useCallback((snap: BootMorphSnapshot) => {
    const anchor = document.getElementById(ENVIVO_VINYL_ANCHOR_ID)
    if (anchor) {
      anchor.style.transformOrigin = 'center center'
      anchor.style.transform = snap.vinylScale < 0.999 ? `scale(${snap.vinylScale})` : ''
    }

    const disc = document.getElementById(ENVIVO_VINYL_DISC_ID)
    if (disc) {
      disc.style.transformOrigin = 'center center'
      if (introActive && snap.vinylScale > 0.01) {
        const deg = (snap.vinylRotationRad * 180) / Math.PI
        disc.style.transform = `rotate(${deg}deg)`
      } else {
        disc.style.transform = ''
      }
    }
  }, [introActive])

  useBootMorphDrive(introActive, applyMorph)

  const showExtras = !introActive || vinylScale > 0.72
  const showLogo = !introActive || showPlayerLogo
  const logoOpacity = introActive ? playerLogoOpacity : 1
  const showEq = !introActive || playerEqOpacity > 0.01

  return (
    <div
      id={ENVIVO_VINYL_ANCHOR_ID}
      className="envivo-vinyl-intro relative shrink-0 flex items-center justify-center overflow-visible origin-center will-change-transform"
      style={{ width: VINYL_OUTER, height: VINYL_OUTER }}
    >
      {showExtras && (
        <>
          <div
            className="absolute inset-0 m-auto rounded-full pointer-events-none"
            style={{
              width: '92%',
              height: '92%',
              background: `radial-gradient(circle, ${primary}38 0%, ${primary}14 42%, ${secondary}06 58%, transparent 72%)`,
              filter: 'blur(20px)',
            }}
            aria-hidden
          />

          <div
            className="absolute inset-0 m-auto rounded-full overflow-hidden opacity-[0.22] pointer-events-none"
            style={{ width: '78%', height: '78%' }}
            aria-hidden
          >
            {dotGrid}
          </div>
        </>
      )}

      <VinylDiscFrame
        size={VINYL_DISC_SIZE}
        isPlaying={isPlaying}
        isLoading={isLoading}
        accent={primary}
        bootMode={introActive}
        handoffRotationRad={handoffRotationRad}
      >
        <div
          className="absolute inset-0"
          style={{
            opacity: showEq ? playerEqOpacity : 0,
            transition: introActive ? 'none' : undefined,
          }}
        >
          {circularBars}
        </div>
        <div
          style={{
            opacity: showLogo ? logoOpacity : 0,
            transition: introActive ? 'none' : undefined,
          }}
        >
          {interactiveLogo}
        </div>
      </VinylDiscFrame>
    </div>
  )
}

export { useEnVivoIntroActive } from './EnVivoBootMotion'
