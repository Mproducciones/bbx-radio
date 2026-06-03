'use client'

import { useEffect, useRef } from 'react'
import { animateOnView } from '@/lib/motion/anime'

export function useAnimeInView(
  params: (index: number) => Record<string, unknown>,
  index = 0,
  options?: IntersectionObserverInit,
) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    el.style.opacity = '0'
    return animateOnView(el, params(index), options)
    // params/options son presets estables del módulo motion
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index])

  return ref
}
