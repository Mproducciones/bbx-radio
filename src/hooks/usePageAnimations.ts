'use client'

import { useEffect, type RefObject } from 'react'

type AnimeInstance = {
  (params: Record<string, unknown>): { pause: () => void }
  set: (targets: Element | Element[] | NodeListOf<Element>, props: Record<string, unknown>) => void
  stagger: (value: number, opts?: { start?: number }) => number
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

/** Entrada escalonada con data-animate="tile" | "fade" | "cta" */
export function usePageAnimations(rootRef: RefObject<HTMLElement | null>, enabled = true) {
  useEffect(() => {
    if (!enabled || !rootRef.current) return

    let cancelled = false

    loadAnime().then(anime => {
      if (cancelled || !anime || !rootRef.current) return

      const root = rootRef.current
      const tiles = root.querySelectorAll('[data-animate="tile"]')
      const fades = root.querySelectorAll('[data-animate="fade"]')
      const cta = root.querySelector('[data-animate="cta"]')
      const all = [...tiles, ...fades, ...(cta ? [cta] : [])]

      anime.set(all, { opacity: 0, translateY: 16 })

      anime({
        targets: fades,
        opacity: [0, 1],
        translateY: [12, 0],
        duration: 560,
        easing: 'easeOutCubic',
        delay: anime.stagger(70, { start: 0 }),
      })

      anime({
        targets: tiles,
        opacity: [0, 1],
        translateY: [18, 0],
        scale: [0.97, 1],
        duration: 640,
        easing: 'easeOutExpo',
        delay: anime.stagger(55, { start: 180 }),
      })

      if (cta) {
        anime({
          targets: cta,
          opacity: [0, 1],
          translateY: [12, 0],
          duration: 520,
          easing: 'easeOutCubic',
          delay: 400,
        })
      }
    })

    return () => {
      cancelled = true
    }
  }, [enabled, rootRef])
}
