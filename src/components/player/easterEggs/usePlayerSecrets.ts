'use client'

import { useCallback, useRef, useState } from 'react'

const HOLD_LOGO_MS = 900
const HOLD_WAVE_MS = 650

export function usePlayerSecrets() {
  const [logoDigital, setLogoDigital] = useState(false)
  const [snakeActive, setSnakeActive] = useState(false)
  const [logoHold, setLogoHold] = useState(0)
  const [waveHold, setWaveHold] = useState(0)
  const [snakeScore, setSnakeScore] = useState(0)
  const [hintFlash, setHintFlash] = useState<string | null>(null)

  const logoTimer = useRef<ReturnType<typeof setInterval> | null>(null)
  const waveTimer = useRef<ReturnType<typeof setInterval> | null>(null)
  const waveTapRef = useRef({ count: 0, at: 0 })
  const blockLogoClickUntil = useRef(0)
  const blockWaveTapUntil = useRef(0)

  const flashHint = useCallback((msg: string) => {
    setHintFlash(msg)
    window.setTimeout(() => setHintFlash(null), 2200)
  }, [])

  const clearLogoHold = useCallback(() => {
    if (logoTimer.current) clearInterval(logoTimer.current)
    logoTimer.current = null
    setLogoHold(0)
  }, [])

  const clearWaveHold = useCallback(() => {
    if (waveTimer.current) clearInterval(waveTimer.current)
    waveTimer.current = null
    setWaveHold(0)
  }, [])

  const startLogoHold = useCallback(() => {
    if (logoDigital) return
    clearLogoHold()
    const start = Date.now()
    logoTimer.current = setInterval(() => {
      const p = Math.min(1, (Date.now() - start) / HOLD_LOGO_MS)
      setLogoHold(p)
      if (p >= 1) {
        clearLogoHold()
        setLogoDigital(true)
        blockLogoClickUntil.current = Date.now() + 500
        if (navigator.vibrate) navigator.vibrate([12, 40, 20, 60])
        flashHint('MODO PULSO · SISTEMA')
      }
    }, 16)
  }, [logoDigital, clearLogoHold, flashHint])

  const startWaveHold = useCallback(() => {
    if (snakeActive) return
    clearWaveHold()
    const start = Date.now()
    waveTimer.current = setInterval(() => {
      const p = Math.min(1, (Date.now() - start) / HOLD_WAVE_MS)
      setWaveHold(p)
      if (p >= 1) {
        clearWaveHold()
        setSnakeActive(true)
        setSnakeScore(0)
        blockWaveTapUntil.current = Date.now() + 500
        if (navigator.vibrate) navigator.vibrate([8, 8, 8])
        flashHint('SNAKE FM · DESLIZA ↑↓')
      }
    }, 16)
  }, [snakeActive, clearWaveHold, flashHint])

  const onLogoTap = useCallback(() => {
    if (Date.now() < blockLogoClickUntil.current) return
    if (logoDigital) setLogoDigital(false)
  }, [logoDigital])

  const onWaveTap = useCallback(() => {
    if (Date.now() < blockWaveTapUntil.current) return
    const now = Date.now()
    if (now - waveTapRef.current.at < 400) {
      waveTapRef.current.count += 1
    } else {
      waveTapRef.current.count = 1
    }
    waveTapRef.current.at = now
    if (waveTapRef.current.count >= 3 && !snakeActive) {
      waveTapRef.current.count = 0
      setSnakeActive(true)
      setSnakeScore(0)
      flashHint('SNAKE FM')
    }
  }, [snakeActive, flashHint])

  const exitSnake = useCallback(() => {
    setSnakeActive(false)
    clearWaveHold()
  }, [clearWaveHold])

  const exitDigital = useCallback(() => {
    setLogoDigital(false)
    clearLogoHold()
  }, [clearLogoHold])

  return {
    logoDigital,
    snakeActive,
    logoHold,
    waveHold,
    snakeScore,
    setSnakeScore,
    hintFlash,
    startLogoHold,
    clearLogoHold,
    startWaveHold,
    clearWaveHold,
    onWaveTap,
    onLogoTap,
    exitSnake,
    exitDigital,
  }
}
