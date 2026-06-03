'use client'

import type { SponsorPlanId, PlanMockupKind } from '@/lib/sponsorPlans'

export type { PlanMockupKind }

const PLAN_LABEL: Record<SponsorPlanId, string> = {
  basico: 'Plan Básico',
  premium: 'Plan Premium',
  empresarial: 'Plan Empresarial',
}

function PhoneFrame({ children, badge, compact, large }: { children: React.ReactNode; badge?: string; compact?: boolean; large?: boolean }) {
  const maxW = compact ? 'max-w-[260px]' : large ? 'max-w-[min(100%,340px)]' : 'max-w-[min(100%,300px)]'
  return (
    <div className="w-full">
      {badge && (
        <p className="pro-eyebrow mb-2 text-center" style={{ color: 'var(--color-mag-400)' }}>
          {badge}
        </p>
      )}
      <div className={`pro-phone-frame mx-auto w-full ${maxW}`}>
        <div className="rounded-[1.15rem] overflow-hidden bg-ink-900 border border-white/[0.06]">
          <div className="flex items-center justify-between px-3 py-2 bg-black/50 border-b border-white/[0.05]">
            <span className="text-[9px] text-white/45 font-medium tabular-nums">9:41</span>
            <div className="w-14 h-4 rounded-full bg-black/70 border border-white/[0.08]" />
            <span className="text-[9px] text-white/35 tracking-widest">···</span>
          </div>
          {children}
        </div>
      </div>
    </div>
  )
}

function EnVivoScreen({
  accent,
  bannerVariant,
}: {
  accent: string
  bannerVariant: 'standard' | 'hero' | 'exclusive'
}) {
  const isHero = bannerVariant === 'hero'
  const isExclusive = bannerVariant === 'exclusive'

  return (
    <>
      <div className="px-3 py-2.5 border-b border-white/[0.06] flex justify-between items-center bg-white/[0.02]">
        <span className="font-display text-sm text-white tracking-wide">RADIO BIENVENIDA</span>
        <span
          className="text-[9px] font-bold px-2 py-0.5 rounded-full"
          style={{
            color: accent,
            background: `color-mix(in srgb, ${accent} 14%, transparent)`,
            border: `1px solid color-mix(in srgb, ${accent} 35%, transparent)`,
          }}
        >
          93.3 FM
        </span>
      </div>

      <div
        className="relative h-36 flex items-center justify-center"
        style={{ background: 'linear-gradient(180deg, rgba(125,89,181,0.15) 0%, var(--color-ink-900) 72%)' }}
      >
        <img src="/icons/fondo.png" alt="" className="absolute inset-0 w-full h-full object-cover opacity-25 pointer-events-none" />
        <div className="relative w-20 h-20 rounded-full border-2 flex items-center justify-center" style={{ borderColor: `${accent}80`, boxShadow: `0 0 30px ${accent}40` }}>
          <img src="/icons/icon-512.png" alt="" className="w-14 h-14 rounded-full object-contain opacity-90" />
        </div>
        <div className="absolute bottom-2 left-3 right-3 flex items-center gap-2">
          <div className="flex-1 h-1 rounded-full bg-white/10 overflow-hidden">
            <div className="h-full w-1/2 rounded-full" style={{ background: accent }} />
          </div>
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-[#07070e] text-xs font-bold" style={{ background: accent }}>
            ▶
          </div>
        </div>
      </div>

      {/* Banner — posición según plan */}
      <div className="px-3 pb-3 pt-2">
        {isExclusive && (
          <p className="text-[8px] text-center text-[#7D59B5] font-bold uppercase tracking-wider mb-1.5">
            Semana exclusiva · sin rotación
          </p>
        )}
        <div
          className="rounded-xl px-3 py-2.5 flex items-center gap-2.5 relative overflow-hidden"
          style={{
            background: isHero || isExclusive
              ? `color-mix(in srgb, ${accent} 18%, transparent)`
              : 'rgba(255,255,255,0.04)',
            border: `1px solid ${isHero || isExclusive ? `color-mix(in srgb, ${accent} 55%, transparent)` : 'rgba(255,255,255,0.1)'}`,
            boxShadow: isHero
              ? `0 8px 28px -8px color-mix(in srgb, ${accent} 40%, transparent)`
              : isExclusive
                ? `0 6px 22px -8px color-mix(in srgb, ${accent} 32%, transparent)`
                : undefined,
          }}
        >
          {(isHero || isExclusive) && (
            <div className="absolute top-0 right-0 text-[7px] font-black uppercase px-2 py-0.5 rounded-bl-lg" style={{ background: accent, color: '#07070e' }}>
              {isExclusive ? 'Exclusivo' : 'Destacado'}
            </div>
          )}
          <div className="w-10 h-10 rounded-lg shrink-0 flex items-center justify-center text-lg font-bold" style={{ background: `${accent}35`, color: accent }}>
            T
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[11px] font-bold text-white truncate">Tu Negocio · Rancagua</p>
            <p className="text-[9px] text-white/50 truncate">
              {isHero ? '2×1 en almuerzos · Esta semana' : isExclusive ? 'Patrocinador oficial del mes' : 'Tu promoción aquí'}
            </p>
          </div>
          {!isHero && !isExclusive && (
            <span className="text-[7px] text-white/30 shrink-0">Rota</span>
          )}
        </div>
        <p className="text-[8px] text-white/30 text-center mt-1.5">
          {isHero ? 'Banner fijo en pantalla En Vivo' : isExclusive ? 'Solo tu marca esta semana' : 'Banner compartido con otros anuncios'}
        </p>
      </div>
    </>
  )
}

export function PlanMockup({
  kind,
  color,
  planId,
  large = false,
  compact = false,
}: {
  kind: PlanMockupKind
  color: string
  planId: SponsorPlanId
  large?: boolean
  compact?: boolean
}) {
  const accent = color
  const scale = compact ? 0.92 : large ? 1 : 0.95
  const frameCompact = compact && !large

  if (kind === 'banner') {
    return (
      <PhoneFrame badge={PLAN_LABEL[planId]} compact={frameCompact} large={large}>
        <div style={{ transform: `scale(${scale})`, transformOrigin: 'top center' }}>
          <EnVivoScreen accent={accent} bannerVariant="standard" />
        </div>
      </PhoneFrame>
    )
  }

  if (kind === 'banner-hero') {
    return (
      <PhoneFrame badge={compact && !large ? 'Vista en app' : 'Premium · Banner destacado'} compact={frameCompact} large={large}>
        <div style={{ transform: `scale(${scale})`, transformOrigin: 'top center' }}>
          <EnVivoScreen accent={accent} bannerVariant="hero" />
        </div>
      </PhoneFrame>
    )
  }

  if (kind === 'spot') {
    return (
      <PhoneFrame badge="Spot 30s al aire" large={large}>
        <div className="relative">
          <div className="absolute inset-0 opacity-20 pointer-events-none">
            <img src="/sponsor/fm.png" alt="" className="w-full h-full object-cover" />
          </div>
          <div className="relative p-3 space-y-2">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <span className="text-[10px] font-bold text-red-400 uppercase">En vivo · Locutor</span>
          </div>
          <div className="rounded-xl p-3" style={{ background: `${accent}12`, border: `1px solid ${accent}35` }}>
            <p className="text-[9px] text-white/40 uppercase mb-1">Script spot — Plan Básico</p>
            <p className="text-xs text-white leading-relaxed">
              “En{' '}
              <span className="font-bold" style={{ color: accent }}>
                Tu Restaurante
              </span>{' '}
              tenemos 2×1 los martes… Pásate por Av. Freire 1230, Rancagua.”
            </p>
          </div>
          <div className="flex items-end justify-center gap-0.5 h-8">
            {[3, 6, 4, 8, 5, 7, 4, 6, 3].map((h, i) => (
              <div key={i} className="w-1 rounded-full" style={{ height: h * 3, background: accent, opacity: 0.5 + (i % 3) * 0.15 }} />
            ))}
          </div>
          <div className="grid grid-cols-2 gap-1.5">
            {['09:00', '12:00', '15:00', '20:00'].map(t => (
              <div key={t} className="flex justify-between px-2 py-1.5 rounded-lg text-[10px] bg-white/5 border-l-2" style={{ borderColor: accent }}>
                <span className="text-white/80 font-mono">{t}</span>
                <span className="text-white/40">30s</span>
              </div>
            ))}
          </div>
          </div>
        </div>
      </PhoneFrame>
    )
  }

  if (kind === 'peak') {
    return (
      <PhoneFrame badge="Premium · Horario peak" large={large}>
        <div className="p-3">
          <p className="text-[10px] text-white/50 mb-2">Spots cuando hay más oyentes</p>
          <div className="grid grid-cols-3 gap-1 mb-3">
            {[
              { h: '07–10', n: 2, hot: true },
              { h: '10–13', n: 1, hot: false },
              { h: '13–15', n: 2, hot: true },
              { h: '15–18', n: 1, hot: false },
              { h: '18–21', n: 2, hot: true },
              { h: '21–00', n: 0, hot: false },
            ].map(slot => (
              <div
                key={slot.h}
                className="rounded-lg p-1.5 text-center"
                style={{
                  background: slot.hot ? `${accent}25` : 'rgba(255,255,255,0.04)',
                  border: slot.hot ? `1px solid ${accent}50` : '1px solid transparent',
                }}
              >
                <p className="text-[8px] text-white/50">{slot.h}</p>
                <p className="text-sm font-bold" style={{ color: slot.hot ? accent : 'rgba(255,255,255,0.2)' }}>
                  {slot.n > 0 ? `${slot.n}×` : '—'}
                </p>
              </div>
            ))}
          </div>
          <div className="space-y-1">
            {['07:30', '08:15', '13:00', '13:45', '18:00', '18:30'].map(t => (
              <div key={t} className="flex items-center gap-2 px-2 py-1 rounded-md bg-white/[0.03]">
                <span className="text-[9px] font-mono text-white/70 w-10">{t}</span>
                <div className="flex-1 h-1 rounded-full bg-white/10">
                  <div className="h-full w-full rounded-full" style={{ background: accent }} />
                </div>
                <span className="text-[8px] font-bold" style={{ color: accent }}>TU MARCA</span>
              </div>
            ))}
          </div>
        </div>
      </PhoneFrame>
    )
  }

  if (kind === 'stats') {
    return (
      <PhoneFrame badge="Reporte de alcance" large={large}>
        <div className="relative">
          <div className="relative h-44 overflow-hidden">
            <img src="/sponsor/reporte.png" alt="Ejemplo reporte mensual" className="absolute inset-0 w-full h-full object-cover object-top opacity-90" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#07070e] via-[#07070e]/40 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-3">
              <div className="grid grid-cols-3 gap-1.5">
                {[
                  { v: '+15K', l: 'Alcance' },
                  { v: '847', l: 'En vivo' },
                  { v: '12K', l: 'Impresiones' },
                ].map(s => (
                  <div key={s.l} className="rounded-lg py-1.5 text-center backdrop-blur-sm" style={{ background: 'rgba(7,7,14,0.75)', border: `1px solid ${accent}35` }}>
                    <p className="font-display text-sm leading-none" style={{ color: accent }}>{s.v}</p>
                    <p className="text-[6px] text-white/50 mt-0.5">{s.l}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <p className="text-[8px] text-white/35 text-center py-2 px-3">Mismo reporte descargable en panel admin → Reporte mensual</p>
        </div>
      </PhoneFrame>
    )
  }

  if (kind === 'programa') {
    return (
      <PhoneFrame badge="Empresarial · Patrocinio programa" large={large}>
        <div className="relative h-28 flex items-end p-3" style={{ background: `linear-gradient(135deg, ${accent}55 0%, #07070e 80%)` }}>
          <img src="/icons/fondo.png" alt="" className="absolute inset-0 w-full h-full object-cover opacity-20" />
          <div className="relative">
            <p className="text-[8px] text-white/60 uppercase tracking-[0.2em]">Presenta</p>
            <p className="font-display text-2xl text-white leading-none">TU EMPRESA</p>
            <p className="text-[10px] text-white/70 mt-1">Matinal Bienvenida · 07:00 – 10:00</p>
          </div>
        </div>
        <div className="p-3 space-y-2">
          <div className="flex items-center gap-2 text-[10px] text-white/60">
            <span className="px-2 py-0.5 rounded-full" style={{ background: `${accent}25`, color: accent }}>Locutor</span>
            “Arrancamos el día con el auspicio de Tu Empresa…”
          </div>
          <div className="rounded-lg px-2 py-2 flex items-center gap-2 border-l-2" style={{ borderColor: accent, background: `${accent}10` }}>
            <span className="text-lg">📻</span>
            <span className="text-[10px] text-white/70">Cortina de marca al inicio del bloque</span>
          </div>
        </div>
      </PhoneFrame>
    )
  }

  if (kind === 'parrilla') {
    return (
      <PhoneFrame badge="Visible en grilla app" large={large}>
        <div className="px-3 pt-2 pb-1 border-b border-white/5">
          <p className="font-display text-lg text-white">Programación</p>
        </div>
        <div className="p-3">
          <div className="flex gap-1 mb-2">
            {['Lun', 'Mar', 'Mié', 'Jue', 'Vie'].map((d, i) => (
              <span key={d} className="flex-1 text-center text-[8px] py-1 rounded-md font-bold"
                style={{ background: i === 0 ? `${accent}30` : 'rgba(255,255,255,0.05)', color: i === 0 ? accent : 'rgba(255,255,255,0.35)' }}>
                {d}
              </span>
            ))}
          </div>
          {[
            { t: '07:00', n: 'Matinal Bienvenida', pat: true },
            { t: '10:00', n: 'Mix del Día', pat: false },
            { t: '14:00', n: 'Tarde en Rancagua', pat: false },
          ].map(row => (
            <div
              key={row.t}
              className="flex items-center gap-2 px-2 py-2 rounded-lg mb-1.5"
              style={{
                background: row.pat ? `${accent}15` : 'rgba(255,255,255,0.03)',
                borderLeft: row.pat ? `3px solid ${accent}` : '3px solid transparent',
              }}
            >
              <span className="text-[9px] font-mono text-white/50 w-9">{row.t}</span>
              <span className="text-[10px] text-white/80 flex-1">{row.n}</span>
              {row.pat && (
                <span className="text-[7px] font-black uppercase px-1.5 py-0.5 rounded" style={{ background: accent, color: '#07070e' }}>
                  Patrocinio
                </span>
              )}
            </div>
          ))}
        </div>
      </PhoneFrame>
    )
  }

  // integral
  return (
    <PhoneFrame badge="Cobertura 360°" large={large}>
      <div className="p-3 grid grid-cols-1 gap-2">
        {[
          { icon: '📻', title: 'Radio 93.3 FM', desc: '12 spots / día · todos los horarios', bg: `${accent}18` },
          { icon: '📱', title: 'App PWA', desc: 'Banner exclusivo + grilla patrocinada', bg: 'rgba(64,185,191,0.12)' },
          { icon: '📣', title: 'Redes + locutor', desc: '2 piezas gráficas / mes', bg: 'rgba(219,137,24,0.12)' },
        ].map(ch => (
          <div key={ch.title} className="rounded-xl p-3 flex gap-3 items-center" style={{ background: ch.bg }}>
            <span className="text-2xl">{ch.icon}</span>
            <div>
              <p className="text-[11px] font-bold text-white">{ch.title}</p>
              <p className="text-[9px] text-white/50">{ch.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </PhoneFrame>
  )
}

/** Miniatura distinta en cada tarjeta de plan */
export function PlanPreviewThumb({
  planId,
  color,
  compact,
}: {
  planId: SponsorPlanId
  color: string
  compact?: boolean
}) {
  const kind: PlanMockupKind =
    planId === 'basico' ? 'banner' : planId === 'premium' ? 'banner-hero' : 'programa'
  return (
    <div
      className={`mb-3 md:mb-4 rounded-xl overflow-hidden border border-white/8 pointer-events-none ${compact ? 'max-h-[140px]' : ''}`}
      style={{ background: '#0a0a12' }}
    >
      <div className={`origin-top ${compact ? 'scale-[0.58] -mb-14' : 'scale-[0.72] -mb-8 md:-mb-8'}`}>
        <PlanMockup kind={kind} color={color} planId={planId} compact={compact} />
      </div>
    </div>
  )
}
