'use client'

import { useCallback, useRef, useState } from 'react'

const HOLD_MELT_MS = 850
const TAP_WINDOW_MS = 550

export type PlayerGameMode = 'none' | 'catch'

export function usePlayerSecrets(isPlaying: boolean) {
  const [logoDigital, setLogoDigital] = useState(false)
  const [gameMode, setGameMode] = useState<PlayerGameMode>('none')
  const [logoHold, setLogoHold] = useState(0)
  const [catchScore, setCatchScore] = useState(0)

  const logoTimer = useRef<ReturnType<typeof setInterval> | null>(null)
  const logoHeld = useRef(false)
  const tapTimes = useRef<number[]>([])
  const justActivatedDigital = useRef(false)

  const clearLogoHold = useCallback(() => {
    if (logoTimer.current) clearInterval(logoTimer.current)
    logoTimer.current = null
    logoHeld.current = false
    setLogoHold(0)
  }, [])

  const activateDigital = useCallback(() => {
    clearLogoHold()
    setLogoDigital(true)
    justActivatedDigital.current = true
    window.setTimeout(() => { justActivatedDigital.current = false }, 700)
    if (navigator.vibrate) navigator.vibrate([12, 40, 20, 40])
  }, [clearLogoHold])

  const activateCatch = useCallback(() => {
    setLogoDigital(false)
    setGameMode('catch')
    setCatchScore(0)
    if (navigator.vibrate) navigator.vibrate([8, 16, 8, 16, 24])
  }, [])

  const startLogoHold = useCallback(() => {
    if (logoDigital || gameMode === 'catch') return
    clearLogoHold()
    logoHeld.current = true
    const start = Date.now()
    logoTimer.current = setInterval(() => {
      if (!logoHeld.current) return
      const p = Math.min(1, (Date.now() - start) / HOLD_MELT_MS)
      setLogoHold(p)
      if (p >= 1) activateDigital()
    }, 16)
  }, [logoDigital, gameMode, clearLogoHold, activateDigital])

  const endLogoHold = useCallback(() => {
    logoHeld.current = false
    if (!justActivatedDigital.current && !logoDigital) {
      clearLogoHold()
    }
  }, [clearLogoHold, logoDigital])

  const registerLogoTap = useCallback(() => {
    if (justActivatedDigital.current) return

    const now = Date.now()
    tapTimes.current = tapTimes.current.filter(t => now - t < TAP_WINDOW_MS)
    tapTimes.current.push(now)

    if (logoDigital && tapTimes.current.length >= 2 && isPlaying) {
      tapTimes.current = []
      activateCatch()
      return
    }

    if (tapTimes.current.length >= 3 && isPlaying && !logoDigital) {
      tapTimes.current = []
      activateCatch()
    }
  }, [logoDigital, isPlaying, activateCatch])

  const onLogoTouchEnd = useCallback(() => {
    endLogoHold()
    registerLogoTap()
  }, [endLogoHold, registerLogoTap])

  const onLogoTap = useCallback(() => {
    if (logoDigital) {
      setLogoDigital(false)
      tapTimes.current = []
    }
  }, [logoDigital])

  const exitCatch = useCallback(() => {
    setGameMode('none')
    setCatchScore(0)
  }, [])

  return {
    logoDigital,
    gameMode,
    logoHold,
    catchScore,
    setCatchScore,
    startLogoHold,
    endLogoHold,
    onLogoTouchEnd,
    onLogoTap,
    exitCatch,
  }
}
