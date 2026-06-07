import { RADIO_FONT_STACK } from '@/lib/fonts/radioFonts'

export const WELCOME_BG = '#07070E'
export const WELCOME_LOGO_SRC = '/LOGO_BIENVENIDA (1)_PhotoGrid.png'
export const WELCOME_LOGO_FALLBACK = '/icons/icon-512.png'

export const WELCOME_ORANGE = '219, 137, 24'
export const WELCOME_CYAN = '64, 185, 191'

export function easeOutCubic(t: number): number {
  return 1 - (1 - t) ** 3
}

export function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2
}

export function easeOutQuint(t: number): number {
  return 1 - (1 - t) ** 5
}

/** Retraso suave: 0 hasta `start`, luego ease out. */
export function easeOutDelayed(t: number, start: number): number {
  if (t <= start) return 0
  return easeOutCubic((t - start) / (1 - start))
}

export function loadWelcomeLogo(src = WELCOME_LOGO_SRC): Promise<HTMLImageElement> {
  const cached = logoCache.get(src)
  if (cached) return cached

  const pending = new Promise<HTMLImageElement>(resolve => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = () => {
      const fallback = new Image()
      fallback.onload = () => resolve(fallback)
      fallback.onerror = () => resolve(fallback)
      fallback.src = WELCOME_LOGO_FALLBACK
    }
    img.src = src
  })

  logoCache.set(src, pending)
  return pending
}

const logoCache = new Map<string, Promise<HTMLImageElement>>()

export function preloadWelcomeLogos(...sources: string[]) {
  for (const src of sources) void loadWelcomeLogo(src)
}

export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t
}

/** Puntos en trayectoria ∞ (lemniscata) → barras radiales EQ del vinilo. */
export function drawInfinityToEqMorph(
  ctx: CanvasRenderingContext2D,
  elapsed: number,
  cx: number,
  cy: number,
  morphT: number,
  logoRadius: number,
  primary: string,
  secondary: string,
  opts?: { opacity?: number; barCount?: number },
) {
  const opacity = opts?.opacity ?? 1
  if (opacity <= 0.01) return

  const NB = opts?.barCount ?? 52
  const r0 = logoRadius + 4
  const tSec = elapsed / 1000
  const mt = easeOutCubic(Math.max(0, Math.min(1, morphT)))

  ctx.save()

  for (let i = 0; i < NB; i++) {
    const angle = (i / NB) * Math.PI * 2 - Math.PI / 2
    const barSx = cx + Math.cos(angle) * r0
    const barSy = cy + Math.sin(angle) * r0

    const phase = (i / NB) * Math.PI * 2
    const it = elapsed / 850 + phase
    const denom = 1 + Math.sin(it) ** 2
    const amp = logoRadius * 2.1 * (1 - mt * 0.92)
    const ix = cx + (amp * Math.cos(it)) / denom
    const iy = cy + (amp * Math.sin(it) * Math.cos(it)) / denom

    const px = lerp(ix, barSx, mt)
    const py = lerp(iy, barSy, mt)

    const pulse = 0.5 + 0.5 * Math.sin(tSec * 2.6 + i * 0.38)
    const barLen = (8 + pulse * 28) * mt
    const ex = cx + Math.cos(angle) * (r0 + barLen)
    const ey = cy + Math.sin(angle) * (r0 + barLen)

    const color = i % 2 === 0 ? primary : secondary
    const lineMix = Math.max(0, (mt - 0.38) / 0.62)

    if (lineMix < 0.45) {
      const dotR = lerp(5, 2.5, mt) * (0.65 + pulse * 0.35)
      ctx.beginPath()
      ctx.arc(px, py, dotR, 0, Math.PI * 2)
      ctx.fillStyle = color
      ctx.globalAlpha = opacity * (0.55 + pulse * 0.35) * (1 - lineMix * 0.85)
      ctx.fill()
    }

    if (lineMix > 0.08) {
      const drawLen = barLen * easeOutCubic(lineMix)
      ctx.beginPath()
      ctx.moveTo(barSx, barSy)
      ctx.lineTo(
        cx + Math.cos(angle) * (r0 + drawLen),
        cy + Math.sin(angle) * (r0 + drawLen),
      )
      ctx.strokeStyle = color
      ctx.lineWidth = lerp(2, 2.5, lineMix)
      ctx.lineCap = 'round'
      ctx.globalAlpha = opacity * (0.45 + Math.min(0.5, drawLen / 42)) * lineMix
      ctx.stroke()
    }
  }

  ctx.restore()
}

/** Partículas flotantes del welcome → barras radiales EQ del vinilo (52, igual que CircularBars). */
export function drawWelcomeParticlesToEqMorph(
  ctx: CanvasRenderingContext2D,
  elapsed: number,
  screenW: number,
  screenH: number,
  viewCx: number,
  viewCy: number,
  cx: number,
  cy: number,
  morphT: number,
  logoRadius: number,
  primary: string,
  secondary: string,
  opts?: { opacity?: number; barCount?: number },
) {
  const opacity = opts?.opacity ?? 1
  if (opacity <= 0.01) return

  const NB = opts?.barCount ?? 52
  const r0 = logoRadius + 4
  const tSec = elapsed / 1000
  const mt = easeOutQuint(Math.max(0, Math.min(1, morphT)))

  ctx.save()

  for (let i = 0; i < NB; i++) {
    const angle = (i / NB) * Math.PI * 2 - Math.PI / 2
    const barSx = cx + Math.cos(angle) * r0
    const barSy = cy + Math.sin(angle) * r0

    const stagger = (i / NB) * 0.12
    const localT = mt <= stagger ? 0 : easeOutCubic((mt - stagger) / (1 - stagger))

    const orbitTight = lerp(1, 0.06, easeOutQuint(localT))
    const orbitCx = lerp(viewCx, cx, easeOutQuint(localT))
    const orbitCy = lerp(viewCy, cy, easeOutQuint(localT))
    const spreadX = (screenW / 3) * orbitTight
    const spreadY = (screenH / 3) * orbitTight

    const fx = Math.sin(elapsed / 1000 + i) * spreadX + orbitCx
    const fy = Math.cos(elapsed / 800 + i * 0.5) * spreadY + orbitCy

    const px = lerp(fx, barSx, easeOutQuint(localT))
    const py = lerp(fy, barSy, easeOutQuint(localT))

    const pulse = 0.5 + 0.5 * Math.sin(tSec * 2.6 + i * 0.38)
    const color = i % 2 === 0 ? primary : secondary

    const barMix = Math.max(0, (localT - 0.52) / 0.48)
    const barLen = (10 + pulse * 28) * easeOutCubic(barMix)
    const dotPhase = 1 - easeOutQuint(Math.max(0, (localT - 0.42) / 0.58))

    if (dotPhase > 0.04) {
      const dotR = lerp(2 + Math.sin(elapsed / 500 + i) * 1.5, 2.2, localT) * (0.7 + pulse * 0.3)
      ctx.beginPath()
      ctx.arc(px, py, dotR * dotPhase, 0, Math.PI * 2)
      ctx.fillStyle = color
      ctx.globalAlpha = opacity * (0.35 + pulse * 0.45) * dotPhase
      ctx.fill()
    }

    if (barMix > 0.06) {
      const drawLen = barLen * easeOutCubic(barMix)
      ctx.beginPath()
      ctx.moveTo(barSx, barSy)
      ctx.lineTo(
        cx + Math.cos(angle) * (r0 + drawLen),
        cy + Math.sin(angle) * (r0 + drawLen),
      )
      ctx.strokeStyle = color
      ctx.lineWidth = lerp(2, 2.5, barMix)
      ctx.lineCap = 'round'
      ctx.globalAlpha = opacity * (0.45 + Math.min(0.5, drawLen / 48)) * barMix
      ctx.stroke()
    }
  }

  ctx.restore()
}

/** Partículas flotantes — mismo estilo que WelcomeAnimation (sin morph). */
export function drawWelcomeParticles(
  ctx: CanvasRenderingContext2D,
  elapsed: number,
  width: number,
  height: number,
  opts?: { opacity?: number; count?: number; orbitTightness?: number },
) {
  const opacity = opts?.opacity ?? 1
  const count = opts?.count ?? 50
  const tight = opts?.orbitTightness ?? 1

  for (let i = 0; i < count; i++) {
    const spreadX = (width / 3) * tight
    const spreadY = (height / 3) * tight
    const x = Math.sin(elapsed / 1000 + i) * spreadX + width / 2
    const y = Math.cos(elapsed / 800 + i * 0.5) * spreadY + height / 2
    const size = 2 + Math.sin(elapsed / 500 + i) * 1.5
    const alpha = (0.3 + Math.sin(elapsed / 600 + i) * 0.2) * opacity
    const isCyan = i % 3 === 0

    ctx.beginPath()
    ctx.arc(x, y, size, 0, Math.PI * 2)
    ctx.fillStyle = `rgba(${isCyan ? WELCOME_CYAN : WELCOME_ORANGE}, ${alpha})`
    ctx.fill()
  }
}

/** Placeholder ámbar mientras carga el logo — evita pantalla negra vacía. */
export function drawLogoPlaceholder(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  size: number,
  elapsed: number,
  alpha: number,
) {
  if (alpha <= 0) return
  ctx.save()
  ctx.translate(cx, cy)
  const pulse = 1 + Math.sin(elapsed / 500) * 0.04
  ctx.scale(pulse, pulse)

  ctx.shadowColor = '#db8918'
  ctx.shadowBlur = 48 * alpha
  ctx.beginPath()
  ctx.arc(0, 0, size / 2 + 8, 0, Math.PI * 2)
  ctx.fillStyle = `rgba(219, 137, 24, ${alpha * 0.2})`
  ctx.fill()
  ctx.shadowBlur = 0

  const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, size / 2)
  grad.addColorStop(0, `rgba(219, 137, 24, ${alpha * 0.95})`)
  grad.addColorStop(1, `rgba(181, 107, 15, ${alpha * 0.85})`)
  ctx.beginPath()
  ctx.arc(0, 0, size / 2, 0, Math.PI * 2)
  ctx.fillStyle = grad
  ctx.fill()

  ctx.fillStyle = `rgba(255, 255, 255, ${alpha * 0.9})`
  ctx.font = `bold ${Math.round(size * 0.22)}px ${RADIO_FONT_STACK}`
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText('93.3', 0, 1)

  ctx.restore()
}

/** Anillo vinilo emergente alrededor del logo (morph continuo hacia el disco). */
export function drawDiscRevealRing(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  innerRadius: number,
  outerRadius: number,
  revealT: number,
  alpha: number,
) {
  if (revealT <= 0.01 || alpha <= 0.01 || outerRadius <= innerRadius) return

  const t = easeOutQuint(Math.max(0, Math.min(1, revealT)))
  const ringOuter = lerp(innerRadius + 6, outerRadius, t)

  ctx.save()
  ctx.translate(cx, cy)

  ctx.beginPath()
  ctx.arc(0, 0, ringOuter, 0, Math.PI * 2)
  ctx.arc(0, 0, innerRadius + 2, 0, Math.PI * 2, true)
  ctx.closePath()

  const grad = ctx.createRadialGradient(0, 0, innerRadius, 0, 0, ringOuter)
  grad.addColorStop(0, `rgba(12, 12, 18, ${alpha * 0.95 * t})`)
  grad.addColorStop(0.55, `rgba(8, 8, 14, ${alpha * 0.88 * t})`)
  grad.addColorStop(1, `rgba(6, 6, 10, ${alpha * 0.72 * t})`)
  ctx.fillStyle = grad
  ctx.fill()

  for (let r = innerRadius + 8; r < ringOuter - 2; r += 2.4) {
    const grooveT = (r - innerRadius) / (ringOuter - innerRadius)
    ctx.beginPath()
    ctx.arc(0, 0, r, 0, Math.PI * 2)
    ctx.strokeStyle = `rgba(255,255,255,${alpha * (0.008 + 0.022 * (1 - grooveT * 0.4)) * t})`
    ctx.lineWidth = 0.75
    ctx.stroke()
  }

  ctx.beginPath()
  ctx.arc(0, 0, ringOuter - 0.5, 0, Math.PI * 2)
  ctx.strokeStyle = `rgba(255,255,255,${alpha * 0.07 * t})`
  ctx.lineWidth = 1
  ctx.stroke()

  ctx.restore()
}

/** Logo central con halo → etiqueta de vinilo (morphT 0 welcome, 1 label). */
export function drawWelcomeLogo(
  ctx: CanvasRenderingContext2D,
  logoImage: HTMLImageElement,
  elapsed: number,
  cx: number,
  cy: number,
  logoSize: number,
  opts?: { alpha?: number; pulse?: boolean; morphT?: number },
) {
  if (!logoImage.complete || logoImage.naturalWidth <= 0) return

  const alpha = opts?.alpha ?? 1
  const pulse = opts?.pulse ?? true
  const morphT = Math.max(0, Math.min(1, opts?.morphT ?? 0))
  const radius = logoSize / 2

  ctx.save()
  ctx.translate(cx, cy)

  if (pulse && morphT < 0.85) {
    const pulseAmp = 0.05 * (1 - easeOutQuint(morphT))
    const zoom = 1 + Math.sin(elapsed / 500) * pulseAmp
    ctx.scale(zoom, zoom)
  }

  const glowAlpha = alpha * (1 - morphT * 0.75)
  if (glowAlpha > 0.02) {
    ctx.shadowColor = '#db8918'
    ctx.shadowBlur = lerp(60, 18, easeOutQuint(morphT)) * glowAlpha
    ctx.beginPath()
    ctx.arc(0, 0, radius + lerp(10, 4, morphT), 0, Math.PI * 2)
    ctx.fillStyle = `rgba(219, 137, 24, ${glowAlpha * lerp(0.12, 0.04, morphT)})`
    ctx.fill()
    ctx.shadowBlur = 0
  }

  if (morphT > 0.08) {
    const rimT = easeOutQuint((morphT - 0.08) / 0.92)
    ctx.beginPath()
    ctx.arc(0, 0, radius + 1, 0, Math.PI * 2)
    ctx.strokeStyle = `rgba(255,255,255,${alpha * 0.06 * rimT})`
    ctx.lineWidth = 1
    ctx.stroke()

    ctx.beginPath()
    ctx.arc(0, 0, radius * lerp(1, 0.82, rimT), 0, Math.PI * 2)
    ctx.strokeStyle = `rgba(0,0,0,${alpha * 0.35 * rimT})`
    ctx.lineWidth = lerp(0, 3, rimT)
    ctx.stroke()
  }

  ctx.save()
  ctx.beginPath()
  ctx.arc(0, 0, radius - 0.5, 0, Math.PI * 2)
  ctx.clip()
  ctx.globalAlpha = alpha
  ctx.drawImage(logoImage, -radius, -radius, logoSize, logoSize)
  ctx.restore()

  if (morphT > 0.35) {
    const insetT = easeOutQuint((morphT - 0.35) / 0.65)
    ctx.beginPath()
    ctx.arc(0, 0, radius * lerp(1, 0.84, insetT), 0, Math.PI * 2)
    ctx.strokeStyle = `rgba(255,255,255,${alpha * 0.05 * insetT})`
    ctx.lineWidth = 1
    ctx.stroke()
  }

  ctx.restore()
}

/** Surco vinilo en canvas — textura compartida boot + reproductor. */
export function drawVinylDisc(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  radius: number,
  rotation: number,
  opacity: number,
) {
  if (radius <= 0 || opacity <= 0) return

  ctx.save()
  ctx.translate(cx, cy)
  ctx.rotate(rotation)
  ctx.globalAlpha = opacity

  const grad = ctx.createRadialGradient(0, 0, radius * 0.06, 0, 0, radius)
  grad.addColorStop(0, '#050508')
  grad.addColorStop(0.34, '#0c0c12')
  grad.addColorStop(0.72, '#09090f')
  grad.addColorStop(1, '#08080e')

  ctx.beginPath()
  ctx.arc(0, 0, radius, 0, Math.PI * 2)
  ctx.fillStyle = grad
  ctx.fill()

  const grooveStart = radius * 0.26
  const grooveEnd = radius - 1.5
  for (let r = grooveStart; r < grooveEnd; r += 2.15) {
    const t = (r - grooveStart) / (grooveEnd - grooveStart)
    const alpha = 0.014 + (0.032 * (1 - t * 0.35))
    ctx.beginPath()
    ctx.arc(0, 0, r, 0, Math.PI * 2)
    ctx.strokeStyle = `rgba(255,255,255,${alpha})`
    ctx.lineWidth = 1
    ctx.stroke()
  }

  for (let r = grooveStart + 1.1; r < grooveEnd; r += 4.3) {
    ctx.beginPath()
    ctx.arc(0, 0, r, 0, Math.PI * 2)
    ctx.strokeStyle = 'rgba(255,255,255,0.012)'
    ctx.lineWidth = 0.5
    ctx.stroke()
  }

  ctx.beginPath()
  ctx.arc(0, 0, radius * 0.97, -0.42, 0.82)
  ctx.strokeStyle = 'rgba(255,255,255,0.085)'
  ctx.lineWidth = 2.8
  ctx.stroke()

  ctx.beginPath()
  ctx.arc(0, 0, radius * 0.97, 0.95, 1.85)
  ctx.strokeStyle = 'rgba(255,255,255,0.025)'
  ctx.lineWidth = 1.2
  ctx.stroke()

  ctx.beginPath()
  ctx.arc(0, 0, radius - 0.5, 0, Math.PI * 2)
  ctx.strokeStyle = 'rgba(255,255,255,0.065)'
  ctx.lineWidth = 1
  ctx.stroke()

  ctx.beginPath()
  ctx.arc(0, 0, radius * 0.34, 0, Math.PI * 2)
  ctx.strokeStyle = 'rgba(255,255,255,0.04)'
  ctx.lineWidth = 0.75
  ctx.stroke()

  ctx.restore()
}

/** Pinta vinilo en un canvas cuadrado (DPR incluido). */
export function paintVinylDiscCanvas(
  canvas: HTMLCanvasElement,
  diameter: number,
  rotation = 0,
): boolean {
  const dpr = Math.min(window.devicePixelRatio || 1, 2)
  canvas.width = Math.round(diameter * dpr)
  canvas.height = Math.round(diameter * dpr)
  canvas.style.width = `${diameter}px`
  canvas.style.height = `${diameter}px`

  const ctx = canvas.getContext('2d')
  if (!ctx) return false

  ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
  ctx.clearRect(0, 0, diameter, diameter)
  drawVinylDisc(ctx, diameter / 2, diameter / 2, diameter / 2 - 1, rotation, 1)
  return true
}
