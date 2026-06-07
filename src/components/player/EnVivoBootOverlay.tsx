'use client'

import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import {
  WELCOME_BG,
  WELCOME_LOGO_SRC,
  drawDiscRevealRing,
  drawLogoPlaceholder,
  drawWelcomeLogo,
  drawWelcomeParticlesToEqMorph,
  easeInOutCubic,
  easeOutCubic,
  easeOutDelayed,
  easeOutQuint,
  loadWelcomeLogo,
  preloadWelcomeLogos,
} from '@/lib/animations/welcomeCanvas'
import { publishBootMorph, resetBootMorphStore } from '@/lib/player/bootMorphStore'
import {
  VINYL_LABEL,
  getCanvasDpr,
  getEnvivoStageCenter,
  lerp,
  measureVinylAnchor,
  type VinylAnchorMetrics,
} from '@/lib/player/vinylMetrics'

const HOLD_MS = 720
const MORPH_MS = 2800
const VINYL_PRESTART_MS = 80
const SETTLE_MS = 280
const FADE_MS = 320

const EQ_PRIMARY = '#db8918'
const EQ_SECONDARY = '#40B9BF'
/** Cuando el vinilo DOM supera esto, el overlay hace fade (sin clearRect). */
const OVERLAY_FADE_START = 0.38
const ANCHOR_LOCK_MS = 280

/** Logo + ∞ → vinilo + EQ. Sin pantalla negra vacía. */
export function EnVivoBootOverlay({
  artSrc = WELCOME_LOGO_SRC,
  labelArtSrc,
  onDone,
}: {
  artSrc?: string
  labelArtSrc: string
  primary?: string
  onDone: () => void
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [portalReady, setPortalReady] = useState(false)

  useLayoutEffect(() => {
    setPortalReady(true)
  }, [])

  useEffect(() => {
    preloadWelcomeLogos(artSrc, labelArtSrc)
    return () => resetBootMorphStore()
  }, [artSrc, labelArtSrc])

  useEffect(() => {
    if (!portalReady) return

    const reduced =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (reduced) {
      resetBootMorphStore()
      onDone()
      return
    }

    const canvasEl = canvasRef.current
    if (!canvasEl) return

    const ctx2d = canvasEl.getContext('2d')
    if (!ctx2d) return

    const canvas: HTMLCanvasElement = canvasEl
    const ctx: CanvasRenderingContext2D = ctx2d

    let raf = 0
    let cancelled = false
    let cssW = window.innerWidth
    let cssH = window.innerHeight
    let welcomeLogo: HTMLImageElement | null = null

    void loadWelcomeLogo(artSrc).then(img => {
      welcomeLogo = img
    })

    const resize = () => {
      cssW = window.innerWidth
      cssH = window.innerHeight
      const dpr = getCanvasDpr()
      canvas.width = Math.round(cssW * dpr)
      canvas.height = Math.round(cssH * dpr)
      canvas.style.width = `${cssW}px`
      canvas.style.height = `${cssH}px`
    }
    resize()
    window.addEventListener('resize', resize)

    {
      const dpr = getCanvasDpr()
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      const initialCenter = getEnvivoStageCenter()
      drawBackdrop(initialCenter.cx, initialCenter.cy, 1)
      drawLogoPlaceholder(ctx, initialCenter.cx, initialCenter.cy, Math.min(cssW * 0.55, 280), 0, 0.85)
    }

    const startTime = Date.now()
    const holdEnd = HOLD_MS
    const morphEnd = holdEnd + MORPH_MS
    const settleEnd = morphEnd + SETTLE_MS
    const totalMs = settleEnd + FADE_MS

    let lockedAnchor: VinylAnchorMetrics | null = null

    publishBootMorph({
      morphT: 0,
      eqMorphT: 0,
      vinylScale: 0,
      vinylOpacity: 0,
      vinylRotationRad: 0,
      overlayEqOpacity: 1,
      playerEqOpacity: 0,
      showPlayerLogo: false,
      playerLogoOpacity: 0,
      overlayLogoAlpha: 1,
      drawOverlayLogo: true,
      overlayLogo: null,
      bgAlpha: 1,
      overlayOpacity: 1,
      chromeRevealT: 0,
    })

    function drawBackdrop(viewCx: number, viewCy: number, alpha: number) {
      ctx.fillStyle = WELCOME_BG
      ctx.globalAlpha = alpha * 0.92
      ctx.fillRect(0, 0, cssW, cssH)

      const glow = ctx.createRadialGradient(viewCx, viewCy, 0, viewCx, viewCy, cssW * 0.55)
      glow.addColorStop(0, 'rgba(219,137,24,0.14)')
      glow.addColorStop(0.45, 'rgba(64,185,191,0.06)')
      glow.addColorStop(1, 'transparent')
      ctx.fillStyle = glow
      ctx.globalAlpha = alpha
      ctx.fillRect(0, 0, cssW, cssH)
    }

    function drawCenterLogo(
      elapsed: number,
      cx: number,
      cy: number,
      logoSize: number,
      pulse: boolean,
      morphT: number,
      logoAlpha: number,
    ) {
      const alpha = Math.min(1, elapsed / 80 + 0.55) * logoAlpha
      if (welcomeLogo) {
        drawWelcomeLogo(ctx, welcomeLogo, elapsed, cx, cy, logoSize, {
          alpha,
          pulse,
          morphT,
        })
      } else {
        drawLogoPlaceholder(ctx, cx, cy, logoSize, elapsed, alpha)
      }
    }

    function frame() {
      if (cancelled) return

      const elapsed = Date.now() - startTime
      const dpr = getCanvasDpr()
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

      if (elapsed >= ANCHOR_LOCK_MS && !lockedAnchor) {
        lockedAnchor = measureVinylAnchor()
      }

      const stageCenter = getEnvivoStageCenter()
      const viewCx = stageCenter.cx
      const viewCy = stageCenter.cy
      const targetCx = lockedAnchor?.cx ?? viewCx
      const targetCy = lockedAnchor?.cy ?? viewCy
      const targetLabel = lockedAnchor?.labelSize ?? VINYL_LABEL
      const targetOuterR = lockedAnchor?.outerRadius ?? targetLabel * 1.06

      let morphT = 0
      let eqMorphT = 0
      let bgAlpha = 1
      let vinylScale = 0
      let vinylRotationRad = 0
      let showPlayerLogo = false
      let playerLogoOpacity = 0
      let overlayLogoAlpha = 1
      let drawOverlayLogo = true
      let overlayEqOpacity = 1
      let playerEqOpacity = 0
      let logoMorphT = 0
      let discRevealT = 0
      let overlayOpacity = 1
      let particleMorphT = 0
      let chromeRevealT = 0

      const logoStart = Math.min(cssW * 0.55, 280)
      let cx = viewCx
      let cy = viewCy
      let logoSize = logoStart
      let logoPulse = true

      if (elapsed < holdEnd) {
        logoSize = logoStart
        logoPulse = true
        particleMorphT = easeOutCubic(elapsed / holdEnd) * 0.2
        eqMorphT = particleMorphT
        if (elapsed > VINYL_PRESTART_MS) {
          const pre = (elapsed - VINYL_PRESTART_MS) / (holdEnd - VINYL_PRESTART_MS)
          vinylScale = easeOutCubic(pre) * 0.28
          vinylRotationRad = (Math.PI / 28) * pre
          discRevealT = easeOutCubic(pre) * 0.35
        }
      } else if (elapsed < morphEnd) {
        morphT = easeInOutCubic((elapsed - holdEnd) / MORPH_MS)
        logoMorphT = easeOutQuint(morphT)
        particleMorphT = lerp(0.2, 1, easeOutQuint(morphT))
        eqMorphT = particleMorphT

        const travelT = easeOutDelayed(morphT, 0.1)
        const sizeT = easeOutQuint(morphT)

        cx = lerp(viewCx, targetCx, travelT)
        cy = lerp(viewCy, targetCy, travelT)
        logoSize = lerp(logoStart, targetLabel, sizeT)
        logoPulse = morphT < 0.22
        vinylScale = lerp(0.28, 1, easeOutQuint(morphT))
        vinylRotationRad = Math.PI / 28 + (Math.PI / 8) * morphT
        discRevealT = lerp(0.35, 1, easeOutQuint(morphT))

        if (morphT > 0.72) {
          const hand = (morphT - 0.72) / 0.28
          overlayEqOpacity = 1 - easeOutCubic(hand)
          playerEqOpacity = easeOutCubic(hand)
        }

        if (morphT > 0.78) {
          const logoHand = (morphT - 0.78) / 0.2
          overlayLogoAlpha = 1 - easeOutQuint(logoHand)
          playerLogoOpacity = easeOutQuint(logoHand)
        }

        showPlayerLogo = playerLogoOpacity > 0.04
        drawOverlayLogo = overlayLogoAlpha > 0.04
      } else if (elapsed < settleEnd) {
        morphT = 1
        logoMorphT = 1
        eqMorphT = 1
        particleMorphT = 1
        cx = targetCx
        cy = targetCy
        logoSize = targetLabel
        vinylScale = 1
        vinylRotationRad = Math.PI / 8 + ((elapsed - morphEnd) / SETTLE_MS) * 0.04
        discRevealT = 1
        overlayEqOpacity = 0
        playerEqOpacity = 1
        overlayLogoAlpha = 0
        playerLogoOpacity = 1
        showPlayerLogo = true
        drawOverlayLogo = false
        overlayOpacity = 0.06
        bgAlpha = 0.06
      } else {
        morphT = 1
        logoMorphT = 1
        eqMorphT = 1
        particleMorphT = 1
        const t = Math.min(1, (elapsed - settleEnd) / FADE_MS)
        const fade = easeOutCubic(t)
        overlayOpacity = lerp(0.06, 0, fade)
        bgAlpha = overlayOpacity
        vinylScale = 1
        vinylRotationRad = Math.PI / 8 + 0.04 + t * 0.03
        discRevealT = 1
        overlayEqOpacity = 0
        playerEqOpacity = 1
        overlayLogoAlpha = 0
        playerLogoOpacity = 1
        showPlayerLogo = true
        drawOverlayLogo = false
      }

      if (elapsed < settleEnd && vinylScale > OVERLAY_FADE_START) {
        const shellFade = easeOutQuint(
          Math.min(1, (vinylScale - OVERLAY_FADE_START) / (1 - OVERLAY_FADE_START)),
        )
        overlayOpacity = lerp(1, 0.08, shellFade)
        bgAlpha = Math.min(bgAlpha, lerp(1, 0.1, shellFade))
      }

      if (elapsed < holdEnd) {
        chromeRevealT = vinylScale > 0.02 ? easeOutQuint(Math.min(1, vinylScale / 0.35)) : 0
      } else if (elapsed < morphEnd) {
        chromeRevealT = easeOutQuint(Math.min(1, vinylScale / 0.95))
      } else {
        chromeRevealT = 1
      }

      const overlayLogo = drawOverlayLogo ? { cx, cy, size: logoSize, pulse: logoPulse } : null

      publishBootMorph({
        morphT,
        eqMorphT,
        vinylScale,
        vinylOpacity: vinylScale > 0.02 ? 1 : 0,
        vinylRotationRad,
        overlayEqOpacity,
        playerEqOpacity,
        showPlayerLogo,
        playerLogoOpacity,
        overlayLogoAlpha,
        drawOverlayLogo,
        overlayLogo,
        bgAlpha,
        overlayOpacity,
        chromeRevealT,
      })

      canvas.style.opacity = String(Math.max(0, Math.min(1, overlayOpacity)))
      canvas.style.background = 'transparent'

      if (bgAlpha > 0.015) {
        drawBackdrop(viewCx, viewCy, bgAlpha)
      }

      if (overlayOpacity > 0.08 && overlayEqOpacity > 0.02) {
        drawWelcomeParticlesToEqMorph(
          ctx,
          elapsed,
          cssW,
          cssH,
          viewCx,
          viewCy,
          cx,
          cy,
          particleMorphT,
          logoSize / 2,
          EQ_PRIMARY,
          EQ_SECONDARY,
          { opacity: overlayEqOpacity * overlayOpacity },
        )
      }

      if (drawOverlayLogo && overlayLogo && discRevealT > 0.02 && overlayLogoAlpha > 0.02 && overlayOpacity > 0.1) {
        drawDiscRevealRing(
          ctx,
          cx,
          cy,
          logoSize / 2 + 2,
          targetOuterR * vinylScale,
          discRevealT,
          overlayLogoAlpha * bgAlpha,
        )
      }

      if (drawOverlayLogo && overlayLogo) {
        drawCenterLogo(elapsed, cx, cy, logoSize, logoPulse, logoMorphT, overlayLogoAlpha)
      }

      ctx.globalAlpha = 1

      if (elapsed < totalMs) {
        raf = requestAnimationFrame(frame)
      } else {
        onDone()
      }
    }

    raf = requestAnimationFrame(frame)

    return () => {
      cancelled = true
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
    }
  }, [portalReady, artSrc, labelArtSrc, onDone])

  if (!portalReady) return null

  return createPortal(
    <canvas
      ref={canvasRef}
      className="envivo-boot-overlay fixed inset-0 z-[5000] md:hidden touch-none pointer-events-none"
      style={{ background: 'transparent' }}
      aria-hidden
    />,
    document.body,
  )
}
