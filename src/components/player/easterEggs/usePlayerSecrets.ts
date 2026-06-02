'use client'

import { useCallback, useRef, useState } from 'react'

const HOLD_LOGO_MS = 750

export type PlayerGameMode = 'none' | 'catch'

export function usePlayerSecrets() {
  const [logoDigital, setLogoDigital] = useState(false)
  const [gameMode, setGameMode] = useState<PlayerGameMode>('none')
  const [sheetOpen, setSheetOpen] = useState(false)
  const [logoHold, setLogoHold] = useState(0)
  const [catchScore, setCatchScore] = useState(0)
  const [hintFlash, setHintFlash] = useState<string | null>(null)

  const logoTimer = useRef<ReturnType<typeof setInterval> | null>(null)
  const logoHeld = useRef(false)
  const logoTapRef = useRef(0)
  const justActivatedDigital = useRef(false)

  const flashHint = useCallback((msg: string) => {
    setHintFlash(msg)
    window.setTimeout(() => setHintFlash(null), 2400)
  }, [])

  const clearLogoHold = useCallback(() => {
    if (logoTimer.current) clearInterval(logoTimer.current)
    logoTimer.current = null
    logoHeld.current = false
    setLogoHold(0)
  }, [])

  const activateDigital = useCallback(() => {
    clearLogoHold()
    setLogoDigital(true)
    setSheetOpen(false)
    justActivatedDigital.current = true
    window.setTimeout(() => { justActivatedDigital.current = false }, 700)
    if (navigator.vibrate) navigator.vibrate([12, 40, 20])
    flashHint('MODO PULSO · SISTEMA')
  }, [clearLogoHold, flashHint])

  const activateCatch = useCallback(() => {
    setGameMode('catch')
    setCatchScore(0)
    setSheetOpen(false)
    if (navigator.vibrate) navigator.vibrate([8, 16, 8])
    flashHint('ATRAPA EL RITMO · TOCA LAS PISTAS')
  }, [flashHint])

  const startLogoHold = useCallback(() => {
    if (logoDigital) return
    clearLogoHold()
    logoHeld.current = true
    const start = Date.now()
    logoTimer.current = setInterval(() => {
      if (!logoHeld.current) return
      const p = Math.min(1, (Date.now() - start) / HOLD_LOGO_MS)
      setLogoHold(p)
      if (p >= 1) activateDigital()
    }, 16)
  }, [logoDigital, clearLogoHold, activateDigital])

  const endLogoHold = useCallback(() => {
    logoHeld.current = false
    clearLogoHold()
  }, [clearLogoHold])

  const onLogoTouchEnd = useCallback(() => {
    endLogoHold()
    if (justActivatedDigital.current) return
    const now = Date.now()
    if (now - logoTapRef.current < 380 && !logoDigital) {
      activateDigital()
      logoTapRef.current = 0
      return
    }
    logoTapRef.current = now
  }, [logoDigital, activateDigital, endLogoHold])

  const onLogoTap = useCallback(() => {
    if (logoDigital) {
      setLogoDigital(false)
      flashHint('LOGO NORMAL')
    }
  }, [logoDigital, flashHint])

  const exitCatch = useCallback(() => {
    setGameMode('none')
    setCatchScore(0)
  }, [])

  return {
    logoDigital,
    gameMode,
    sheetOpen,
    setSheetOpen,
    logoHold,
    catchScore,
    setCatchScore,
    hintFlash,
    startLogoHold,
    endLogoHold,
    onLogoTouchEnd,
    onLogoTap,
    activateDigital,
    activateCatch,
    exitCatch,
  }
}
