'use client'

import { useState, useEffect, useRef } from 'react'

export interface Milestone {
  label: string
  emoji: string
  minutes: number
}

const MILESTONES: Milestone[] = [
  { label: '¡15 minutos escuchando!', emoji: '🎵', minutes: 15 },
  { label: '¡1 hora de música!', emoji: '🔥', minutes: 60 },
  { label: '¡Oyente del día!', emoji: '👑', minutes: 180 },
]

export function useListeningMilestone(isPlaying: boolean) {
  const [milestone, setMilestone] = useState<Milestone | null>(null)
  const minutesRef = useRef(0)
  const reachedRef = useRef(new Set<number>())

  useEffect(() => {
    if (!isPlaying) return
    const interval = setInterval(() => {
      minutesRef.current += 1
      const next = MILESTONES.find(
        m => minutesRef.current >= m.minutes && !reachedRef.current.has(m.minutes)
      )
      if (next) {
        reachedRef.current.add(next.minutes)
        setMilestone(next)
        if (typeof navigator !== 'undefined' && navigator.vibrate) {
          navigator.vibrate([20, 60, 20, 60, 20])
        }
        setTimeout(() => setMilestone(null), 5000)
      }
    }, 60_000)
    return () => clearInterval(interval)
  }, [isPlaying])

  return milestone
}
