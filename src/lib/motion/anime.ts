/** Anime.js v4 — carga lazy + helpers scroll (BBX, landing) */

type AnimeParams = Record<string, unknown>

let animeMod: typeof import('animejs') | null = null

export async function getAnime() {
  if (!animeMod) animeMod = await import('animejs')
  return animeMod
}

/** Anima un nodo al entrar al viewport (una sola vez) */
export function animateOnView(
  target: Element | NodeListOf<Element> | string,
  params: AnimeParams,
  options?: IntersectionObserverInit,
): () => void {
  let done = false
  const el = typeof target === 'string'
    ? document.querySelector(target)
    : target instanceof NodeList ? target[0] : target

  if (!el) return () => {}

  const obs = new IntersectionObserver(([entry]) => {
    if (!entry?.isIntersecting || done) return
    done = true
    void getAnime().then(({ animate }) => animate(target, params))
    obs.disconnect()
  }, { threshold: 0.12, ...options })

  obs.observe(el)
  return () => obs.disconnect()
}

/** Stagger hero / lista dentro de un contenedor */
export async function animateStagger(
  container: HTMLElement,
  selector: string,
  params: Omit<AnimeParams, 'delay'> & { staggerMs?: number },
) {
  const { staggerMs = 80, ...rest } = params
  const { animate, stagger } = await getAnime()
  const nodes = container.querySelectorAll(selector)
  if (!nodes.length) return
  animate(nodes, { ...rest, delay: stagger(staggerMs) })
}

/** Entrada spring para tiles/cards */
export const animeRevealUp = (index = 0): AnimeParams => ({
  translateY: [24, 0],
  opacity: [0, 1],
  duration: 620,
  delay: index * 70,
  ease: 'out(3)',
})

export const animeRevealScale = (index = 0): AnimeParams => ({
  scale: [0.88, 1],
  opacity: [0, 1],
  duration: 520,
  delay: index * 65,
  ease: 'spring(1, 90, 12, 0)',
})

export const animeStatPop = (index = 0): AnimeParams => ({
  scale: [0.7, 1.04, 1],
  opacity: [0, 1],
  duration: 700,
  delay: index * 90,
  ease: 'spring(1, 80, 14, 0)',
})

/** Stagger de hijos al entrar el contenedor al viewport */
export function animateStaggerOnView(
  container: HTMLElement,
  selector: string,
  params: Omit<AnimeParams, 'delay'> & { staggerMs?: number },
  options?: IntersectionObserverInit,
): () => void {
  let done = false
  const obs = new IntersectionObserver(([entry]) => {
    if (!entry?.isIntersecting || done) return
    done = true
    void animateStagger(container, selector, params)
    obs.disconnect()
  }, { threshold: 0.1, ...options })
  obs.observe(container)
  return () => obs.disconnect()
}
