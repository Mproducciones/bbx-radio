'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { EnVivoBootOverlay } from './EnVivoBootOverlay'
import { bootMorphStore, resetBootMorphStore } from '@/lib/player/bootMorphStore'
import { preloadWelcomeLogos } from '@/lib/animations/welcomeCanvas'

export type EnVivoBootPhase = 'intro' | 'done'

const BOOT_KEY = 'pulso_envivo_boot_v19'

interface EnVivoBootContextValue {
  phase: EnVivoBootPhase
  artSrc: string
  labelArtSrc: string
  handoffRotationRad: number
  setLabelArtSrc: (src: string) => void
}

const EnVivoBootContext = createContext<EnVivoBootContextValue>({
  phase: 'done',
  artSrc: '/icons/icon-512.png',
  labelArtSrc: '/icons/icon-512.png',
  handoffRotationRad: 0,
  setLabelArtSrc: () => {},
})

export function useEnVivoBoot() {
  return useContext(EnVivoBootContext)
}

export function useEnVivoIntroActive() {
  const { phase } = useEnVivoBoot()
  return phase === 'intro'
}

interface EnVivoBootMotionProps {
  children: ReactNode
  artSrc: string
  labelArtSrc?: string
  primary: string
}

export function EnVivoBootMotion({
  children,
  artSrc,
  labelArtSrc: labelArtSrcProp = '/icons/icon-512.png',
  primary,
}: EnVivoBootMotionProps) {
  const [phase, setPhase] = useState<EnVivoBootPhase>('intro')
  const [labelArtSrc, setLabelArtSrcState] = useState(labelArtSrcProp)
  const [handoffRotationRad, setHandoffRotationRad] = useState(0)

  const setLabelArtSrc = useCallback((src: string) => {
    setLabelArtSrcState(src)
  }, [])

  useEffect(() => {
    preloadWelcomeLogos(artSrc, labelArtSrcProp, '/icons/icon-512.png')
    const params = new URLSearchParams(window.location.search)
    const forceBoot = params.has('boot')
    const skipBoot = params.has('skipBoot')

    if (skipBoot) {
      sessionStorage.setItem(BOOT_KEY, '1')
      setPhase('done')
      resetBootMorphStore()
      return
    }

    if (forceBoot) {
      sessionStorage.removeItem(BOOT_KEY)
      setPhase('intro')
      return
    }

    if (sessionStorage.getItem(BOOT_KEY)) {
      setPhase('done')
      resetBootMorphStore()
      return
    }

    setPhase('intro')
  }, [])

  useEffect(() => {
    const root = document.documentElement
    if (phase === 'intro') {
      root.classList.add('envivo-boot-active')
    } else {
      root.classList.remove('envivo-boot-active')
    }
    return () => root.classList.remove('envivo-boot-active')
  }, [phase])

  const completeIntro = useCallback(() => {
    setHandoffRotationRad(bootMorphStore.vinylRotationRad)
    sessionStorage.setItem(BOOT_KEY, '1')
    resetBootMorphStore()
    setPhase('done')
  }, [])

  const contextValue = useMemo(
    () => ({
      phase,
      artSrc,
      labelArtSrc,
      handoffRotationRad,
      setLabelArtSrc,
    }),
    [phase, artSrc, labelArtSrc, handoffRotationRad, setLabelArtSrc],
  )

  return (
    <EnVivoBootContext.Provider value={contextValue}>
      {phase === 'intro' && (
        <EnVivoBootOverlay
          artSrc={artSrc}
          labelArtSrc={labelArtSrc}
          primary={primary}
          onDone={completeIntro}
        />
      )}
      <div
        className="envivo-boot envivo-stage-inner relative flex flex-col flex-1 min-h-0 min-w-0 w-full max-md:pointer-events-none"
        aria-hidden={phase === 'intro'}
      >
        {children}
      </div>
    </EnVivoBootContext.Provider>
  )
}
