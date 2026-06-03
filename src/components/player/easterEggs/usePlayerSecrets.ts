'use client'

import { useCallback, useRef, useState } from 'react'
import { flushVibrate, queueVibrate, vibrateNow } from '@/lib/haptics'

const HOLD_MELT_MS = 850
const TAP_WINDOW_MS = 550
const BURST_MS = 4200
const TRIPLE_TAP_DELAY_MS = 300

export function usePlayerSecrets(isPlaying: boolean) {
  const [logoDigital, setLogoDigital] = useState(false)
  const [logoBurst, setLogoBurst] = useState(false)
  const [logoHold, setLogoHold] = useState(0)
  const [hintFlash, setHintFlash] = useState<string | null>(null)

  const logoTimer = useRef<ReturnType<typeof setInterval> | null>(null)
  const burstTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const tripleWait = useRef<ReturnType<typeof setTimeout> | null>(null)
  const logoHeld = useRef(false)
  const tapTimes = useRef<number[]>([])
  const justActivatedDigital = useRef(false)

  const flashHint = useCallback((msg: string) => {
    setHintFlash(msg)
    window.setTimeout(() => setHintFlash(null), 2200)
  }, [])

  const clearLogoHold = useCallback(() => {
    if (logoTimer.current) clearInterval(logoTimer.current)
    logoTimer.current = null
    logoHeld.current = false
    setLogoHold(0)
  }, [])

  const clearBurst = useCallback(() => {
    if (burstTimer.current) clearTimeout(burstTimer.current)
    burstTimer.current = null
    setLogoBurst(false)
  }, [])

  const activateDigital = useCallback(() => {
    clearLogoHold()
    clearBurst()
    setLogoDigital(true)
    justActivatedDigital.current = true
    window.setTimeout(() => {
      justActivatedDigital.current = false
    }, 700)
    flashHint('MODO PULSO · SISTEMA')
    queueVibrate([12, 40, 20, 40])
  }, [clearLogoHold, clearBurst, flashHint])

  const activateBurst = useCallback(() => {
    if (logoDigital) return
    clearBurst()
    setLogoBurst(true)
    flashHint('PULSO FM · ACTIVO')
    queueVibrate([6, 24, 10])
    burstTimer.current = setTimeout(clearBurst, BURST_MS)
  }, [logoDigital, clearBurst, flashHint])

  const startLogoHold = useCallback(() => {
    if (logoDigital || logoBurst) return
    clearLogoHold()
    logoHeld.current = true
    const start = Date.now()
    logoTimer.current = setInterval(() => {
      if (!logoHeld.current) return
      const p = Math.min(1, (Date.now() - start) / HOLD_MELT_MS)
      setLogoHold(p)
      if (p >= 1) activateDigital()
    }, 16)
  }, [logoDigital, logoBurst, clearLogoHold, activateDigital])

  const endLogoHold = useCallback(() => {
    logoHeld.current = false
    if (!justActivatedDigital.current && !logoDigital) {
      clearLogoHold()
    }
    flushVibrate()
  }, [clearLogoHold, logoDigital])

  const registerLogoTap = useCallback(() => {
    if (justActivatedDigital.current) return

    const now = Date.now()
    tapTimes.current = tapTimes.current.filter(t => now - t < TAP_WINDOW_MS)
    tapTimes.current.push(now)
    const count = tapTimes.current.length

    if (count >= 3 && isPlaying && !logoDigital) {
      tapTimes.current = []
      activateBurst()
      vibrateNow([8, 16, 8, 16, 24])
      return
    }

    if (tripleWait.current) clearTimeout(tripleWait.current)

    if (count >= 2 && isPlaying && !logoDigital) {
      tripleWait.current = setTimeout(() => {
        if (tapTimes.current.length >= 3) {
          tapTimes.current = []
          activateBurst()
        } else if (tapTimes.current.length === 2) {
          tapTimes.current = []
          activateBurst()
        }
        tripleWait.current = null
      }, TRIPLE_TAP_DELAY_MS)
    }
  }, [logoDigital, isPlaying, activateBurst])

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

  return {
    logoDigital,
    logoBurst,
    logoHold,
    hintFlash,
    startLogoHold,
    endLogoHold,
    onLogoTouchEnd,
    onLogoTap,
  }
}
