'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import { SPONSOR_LIVE } from '@/lib/sponsorContent'

const ITEM_META: Record<string, { icon: string; color: string }> = {
  'Banner en En Vivo':    { icon: '📱', color: '#40B9BF' },
  'Sorteo patrocinado':   { icon: '🎁', color: '#7D59B5' },
  'Reporte mensual':      { icon: '📊', color: '#00D9A0' },
  'Patrocinadores':       { icon: '🏪', color: '#db8918' },
  'Spots FM 93.3':        { icon: '📻', color: '#FF006E' },
}

const STATUS_STYLE: Record<string, { bg: string; text: string }> = {
  'En app':     { bg: 'rgba(64,185,191,0.15)',  text: '#40B9BF' },
  'Panel admin': { bg: 'rgba(0,217,160,0.15)',  text: '#00D9A0' },
  'Cabina':     { bg: 'rgba(219,137,24,0.15)',  text: '#db8918' },
}

export function SponsorLiveSection() {
  const listRef = useRef<HTMLUListElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = headerRef.current
    if (!el) return
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        import('animejs').then(({ animate }) => {
          animate(el, { translateY: [10, 0], opacity: [0, 1], duration: 440, ease: 'out(3)' })
        })
        obs.disconnect()
      }
    }, { threshold: 0.4 })
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  useEffect(() => {
    const el = listRef.current
    if (!el) return
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        import('animejs').then(({ animate, stagger }) => {
          animate(el.querySelectorAll('[data-live-item]'), {
            translateX: [-20, 0],
            opacity: [0, 1],
            duration: 450,
            delay: stagger(70),
            ease: 'out(3)',
          })
        })
        obs.disconnect()
      }
    }, { threshold: 0.2 })
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  return (
    <section id="probar" className="mb-6 border-t border-white/8 pt-5 scroll-mt-14">
      <div ref={headerRef} className="mb-4 opacity-0">
        <h2 className="text-base font-semibold text-white">Prueba en vivo</h2>
        <p className="text-white/55 text-sm mt-1 leading-relaxed">
          Tocá cada función para verla en la app. Los spots FM se activan al contratar.
        </p>
      </div>

      <ul ref={listRef} className="space-y-2">
        {SPONSOR_LIVE.map(item => {
          const meta = ITEM_META[item.label] ?? { icon: '✦', color: '#db8918' }
          const statusStyle = STATUS_STYLE[item.status] ?? { bg: 'rgba(255,255,255,0.08)', text: 'rgba(255,255,255,0.5)' }
          const isLink = !!item.href

          const inner = (
            <div className="flex items-center gap-3 p-3.5">
              {/* Icon */}
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center text-lg shrink-0"
                style={{ background: `${meta.color}15`, border: `1px solid ${meta.color}25` }}
              >
                {meta.icon}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-0.5">
                  <span className="text-sm font-semibold text-white/90">{item.label}</span>
                  <span
                    className="text-[9px] font-black uppercase px-2 py-0.5 rounded-full"
                    style={{ background: statusStyle.bg, color: statusStyle.text }}
                  >
                    {item.status}
                  </span>
                </div>
                <p className="text-xs text-white/45 leading-snug">{item.note}</p>
              </div>

              {/* Arrow */}
              {isLink && (
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke={meta.color} strokeWidth={2} strokeOpacity={0.6}>
                  <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              )}
              {!isLink && (
                <span className="text-[10px] font-semibold shrink-0 px-2 py-1 rounded-lg"
                  style={{ background: 'rgba(125,89,181,0.12)', color: '#7D59B5' }}>
                  Al contratar
                </span>
              )}
            </div>
          )

          return (
            <li
              key={item.label}
              data-live-item
              className="opacity-0 rounded-2xl overflow-hidden transition-colors"
              style={{
                background: 'rgba(255,255,255,0.03)',
                border: `1px solid ${meta.color}18`,
              }}
            >
              {isLink ? (
                <Link href={item.href!} className="block active:bg-white/[0.04] hover:bg-white/[0.03]">
                  {inner}
                </Link>
              ) : (
                <div className="opacity-55">{inner}</div>
              )}
            </li>
          )
        })}
      </ul>
    </section>
  )
}
