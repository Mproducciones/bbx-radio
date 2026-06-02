'use client'

import type { SponsorPlanId, PlanMockupKind } from '@/lib/sponsorPlans'

export type { PlanMockupKind }

export function PlanMockup({
  kind,
  color,
  planId,
}: {
  kind: PlanMockupKind
  color: string
  planId: SponsorPlanId
}) {
  const accent = color

  if (kind === 'banner' || kind === 'banner-hero') {
    const highlighted = kind === 'banner-hero'
    return (
      <div className="w-full rounded-xl overflow-hidden border border-white/10" style={{ background: '#0a0a12' }}>
        <div className="px-3 py-2 flex items-center justify-between border-b border-white/5">
          <span className="text-[10px] text-white/40 font-semibold">En Vivo · 93.3 FM</span>
          <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
        </div>
        <div className="h-24 relative flex items-center justify-center" style={{ background: 'linear-gradient(180deg,#12091e,#07070e)' }}>
          <div className="w-14 h-14 rounded-full border-2 opacity-40" style={{ borderColor: accent }} />
          <p className="absolute bottom-2 left-3 text-[9px] text-white/30">Reproductor</p>
        </div>
        <div
          className="mx-3 mb-3 rounded-lg px-3 py-2 flex items-center gap-2"
          style={{
            background: highlighted ? `${accent}22` : 'rgba(255,255,255,0.06)',
            border: `1px solid ${highlighted ? accent : 'rgba(255,255,255,0.1)'}`,
            boxShadow: highlighted ? `0 0 20px ${accent}30` : undefined,
          }}
        >
          <div className="w-8 h-8 rounded-md shrink-0" style={{ background: `${accent}40` }} />
          <div className="min-w-0 flex-1">
            <p className="text-[10px] font-bold text-white truncate">Tu negocio aquí</p>
            <p className="text-[8px] text-white/50 truncate">Rancagua · Patrocinador</p>
          </div>
          {highlighted && (
            <span className="text-[7px] font-black uppercase px-1.5 py-0.5 rounded" style={{ background: accent, color: '#07070e' }}>
              Destacado
            </span>
          )}
        </div>
      </div>
    )
  }

  if (kind === 'spot' || kind === 'peak') {
    const slots = kind === 'peak'
      ? ['07:30', '08:15', '13:00', '13:45', '18:00', '18:30']
      : ['09:00', '12:00', '15:00', '20:00']
    return (
      <div className="w-full rounded-xl p-3 border border-white/10" style={{ background: '#0c0c14' }}>
        <p className="text-[10px] font-bold text-white/50 uppercase tracking-wider mb-2">
          {kind === 'peak' ? 'Horario peak' : 'Spots del día'}
        </p>
        <div className="grid grid-cols-2 gap-1.5">
          {slots.map(t => (
            <div
              key={t}
              className="flex items-center gap-2 rounded-lg px-2 py-1.5"
              style={{ background: 'rgba(255,255,255,0.04)', borderLeft: `3px solid ${accent}` }}
            >
              <span className="text-[10px] font-mono text-white/80">{t}</span>
              <span className="text-[8px] text-white/40 ml-auto">30s</span>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (kind === 'stats') {
    return (
      <div className="w-full rounded-xl p-4 border border-white/10 grid grid-cols-3 gap-2 text-center" style={{ background: '#0c0c14' }}>
        {[
          { v: '+15K', l: 'Alcance' },
          { v: 'Live', l: 'En vivo' },
          { v: '20+', l: 'Años FM' },
        ].map(s => (
          <div key={s.l}>
            <p className="font-display text-lg leading-none" style={{ color: accent }}>{s.v}</p>
            <p className="text-[9px] text-white/45 mt-1">{s.l}</p>
          </div>
        ))}
      </div>
    )
  }

  if (kind === 'programa') {
    return (
      <div className="w-full rounded-xl overflow-hidden border border-white/10" style={{ background: '#0c0c14' }}>
        <div className="h-20 flex items-end p-3 relative" style={{ background: `linear-gradient(135deg, ${accent}40, #07070e)` }}>
          <div>
            <p className="text-[8px] text-white/50 uppercase tracking-widest">Presenta</p>
            <p className="text-sm font-display text-white leading-tight">Tu Empresa</p>
            <p className="text-[9px] text-white/60 mt-0.5">Matinal Bienvenida</p>
          </div>
        </div>
        <div className="px-3 py-2 text-[9px] text-white/50 border-t border-white/5">
          Mención del locutor + cortina de marca al inicio del bloque
        </div>
      </div>
    )
  }

  if (kind === 'parrilla') {
    const days = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie']
    return (
      <div className="w-full rounded-xl p-3 border border-white/10" style={{ background: '#0c0c14' }}>
        <p className="text-[10px] font-bold text-white/50 mb-2">Grilla en la app</p>
        <div className="flex gap-1 mb-2">
          {days.map(d => (
            <span key={d} className="flex-1 text-center text-[8px] py-1 rounded text-white/40 bg-white/5">{d}</span>
          ))}
        </div>
        <div className="rounded-lg px-2 py-2 flex items-center gap-2" style={{ borderLeft: `3px solid ${accent}`, background: `${accent}15` }}>
          <span className="text-[9px] text-white/70">10:00 — Mix del Día</span>
          <span className="ml-auto text-[7px] font-bold uppercase px-1 rounded" style={{ color: accent }}>Patrocinio</span>
        </div>
      </div>
    )
  }

  // integral
  return (
    <div className="w-full rounded-xl p-3 border border-white/10 flex gap-2" style={{ background: '#0c0c14' }}>
      {[
        { icon: '📻', label: 'Radio 93.3' },
        { icon: '📱', label: 'App PWA' },
        { icon: '📣', label: 'Redes' },
      ].map(ch => (
        <div key={ch.label} className="flex-1 rounded-lg py-3 text-center" style={{ background: planId === 'empresarial' ? `${accent}18` : 'rgba(255,255,255,0.04)' }}>
          <span className="text-lg">{ch.icon}</span>
          <p className="text-[8px] text-white/60 mt-1 font-semibold">{ch.label}</p>
        </div>
      ))}
    </div>
  )
}
