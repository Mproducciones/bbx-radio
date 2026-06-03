'use client'

import { useEffect, type RefObject } from 'react'

function animateElements(nodes: Element[], startDelay: number, staggerMs: number) {
  const timers: number[] = []
  const reduced =
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

  nodes.forEach((el, i) => {
    const node = el as HTMLElement
    if (reduced) {
      node.style.opacity = '1'
      node.style.transform = 'none'
      return
    }

    node.style.opacity = '0'
    node.style.transform = 'translateY(14px)'

    timers.push(
      window.setTimeout(() => {
        node.style.transition = 'opacity 0.55s ease-out, transform 0.55s ease-out'
        node.style.opacity = '1'
        node.style.transform = 'translateY(0)'
      }, startDelay + i * staggerMs),
    )
  })

  return () => timers.forEach(t => window.clearTimeout(t))
}

/** Entrada escalonada (CSS, sin CDN — compatible con CSP). */
export function usePageAnimations(rootRef: RefObject<HTMLElement | null>, enabled = true) {
  useEffect(() => {
    if (!enabled || !rootRef.current) return

    const root = rootRef.current
    const fades = [...root.querySelectorAll('[data-animate="fade"]')]
    const tiles = [...root.querySelectorAll('[data-animate="tile"]')]
    const cta = root.querySelector('[data-animate="cta"]')

    const cleanFade = animateElements(fades, 0, 70)
    const cleanTile = animateElements(tiles, 160, 55)
    const cleanCta = cta ? animateElements([cta], 380, 0) : () => {}

    return () => {
      cleanFade()
      cleanTile()
      cleanCta()
    }
  }, [enabled, rootRef])
}
