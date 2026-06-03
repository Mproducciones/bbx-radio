'use client'

import { useEffect, type RefObject } from 'react'

type AnimeInstance = {
  (params: Record<string, unknown>): { pause: () => void }
  set: (targets: Element | Element[] | NodeListOf<Element>, props: Record<string, unknown>) => void
  stagger: (value: number, opts?: { start?: number }) => number
  remove: (targets: Element | Element[] | NodeListOf<Element> | undefined) => void
}

declare global {
  interface Window {
    anime?: AnimeInstance
  }
}

let animeLoadPromise: Promise<AnimeInstance | null> | null = null

function loadAnime(): Promise<AnimeInstance | null> {
  if (typeof window === 'undefined') return Promise.resolve(null)
  if (window.anime) return Promise.resolve(window.anime)

  if (!animeLoadPromise) {
    animeLoadPromise = new Promise((resolve, reject) => {
      const script = document.createElement('script')
      script.src = 'https://cdn.jsdelivr.net/npm/animejs@3.2.2/lib/anime.min.js'
      script.async = true
      script.onload = () => resolve(window.anime ?? null)
      script.onerror = () => reject(new Error('anime.js failed to load'))
      document.head.appendChild(script)
    })
  }

  return animeLoadPromise
}

/** Entrada escalonada para landing BBX. */
export function useBbxPageAnimations(rootRef: RefObject<HTMLElement | null>, enabled = true) {
  useEffect(() => {
    if (!enabled || !rootRef.current) return

    let cancelled = false

    loadAnime().then(anime => {
      if (cancelled || !anime || !rootRef.current) return

      const root = rootRef.current
      const tiles = root.querySelectorAll('[data-bbx-animate="tile"]')
      const fades = root.querySelectorAll('[data-bbx-animate="fade"]')
      const cta = root.querySelector('[data-bbx-animate="cta"]')
      const all = [...tiles, ...fades, ...(cta ? [cta] : [])]

      anime.set(all, { opacity: 0, translateY: 18 })

      anime({
        targets: fades,
        opacity: [0, 1],
        translateY: [12, 0],
        duration: 600,
        easing: 'easeOutCubic',
        delay: anime.stagger(80, { start: 0 }),
      })

      anime({
        targets: tiles,
        opacity: [0, 1],
        translateY: [20, 0],
        scale: [0.96, 1],
        duration: 680,
        easing: 'easeOutExpo',
        delay: anime.stagger(65, { start: 220 }),
      })

      if (cta) {
        anime({
          targets: cta,
          opacity: [0, 1],
          translateY: [14, 0],
          duration: 600,
          easing: 'easeOutCubic',
          delay: 520,
        })
      }
    })

    return () => {
      cancelled = true
    }
  }, [enabled, rootRef])
}
