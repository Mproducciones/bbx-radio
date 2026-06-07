'use client'

import { useEffect, useSyncExternalStore } from 'react'
import {
  bootMorphStore,
  BOOT_MORPH_IDLE,
  getBootMorphFrame,
  subscribeBootMorph,
  type BootMorphSnapshot,
} from '@/lib/player/bootMorphStore'

function getSnapshot() {
  return bootMorphStore
}

export function useBootMorphDrive(introActive: boolean, apply: (snap: BootMorphSnapshot) => void) {
  useSyncExternalStore(subscribeBootMorph, getSnapshot, getSnapshot)

  useEffect(() => {
    if (!introActive) {
      apply(BOOT_MORPH_IDLE)
      return
    }

    let raf = 0
    function tick() {
      apply(bootMorphStore)
      raf = requestAnimationFrame(tick)
    }
    tick()
    return () => cancelAnimationFrame(raf)
  }, [introActive, apply])
}

export function useBootMorphLogoVisible() {
  return useSyncExternalStore(
    subscribeBootMorph,
    () => bootMorphStore.showPlayerLogo,
    () => true,
  )
}

export function useBootMorphEqOpacity() {
  return useSyncExternalStore(
    subscribeBootMorph,
    () => bootMorphStore.playerEqOpacity,
    () => 1,
  )
}

export function useBootMorphPlayerLogoOpacity() {
  return useSyncExternalStore(
    subscribeBootMorph,
    () => bootMorphStore.playerLogoOpacity,
    () => 1,
  )
}

export function useBootMorphOverlayOpacity() {
  return useSyncExternalStore(
    subscribeBootMorph,
    () => bootMorphStore.overlayOpacity,
    () => 0,
  )
}

export function useBootMorphVinylScale() {
  return useSyncExternalStore(
    subscribeBootMorph,
    () => bootMorphStore.vinylScale,
    () => 1,
  )
}

/** Fuerza re-render cada frame del boot (store muta in-place). */
export function useBootMorphTick() {
  return useSyncExternalStore(
    subscribeBootMorph,
    () => getBootMorphFrame(),
    () => 0,
  )
}

export function useBootMorphChromeReveal() {
  return useSyncExternalStore(
    subscribeBootMorph,
    () => bootMorphStore.chromeRevealT,
    () => 1,
  )
}
