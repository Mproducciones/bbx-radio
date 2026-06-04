'use client'

import type { BbxPlanId, BbxMockupKind } from '@/lib/bbxContent'

function PhoneShell({ children, badge, compact, large }: { children: React.ReactNode; badge?: string; compact?: boolean; large?: boolean }) {
  return (
    <div className="w-full">
      {badge && (
        <p className="text-[9px] font-bold uppercase tracking-wider mb-1.5 text-center text-white/45">{badge}</p>
      )}
      <div
        className={`mx-auto w-full rounded-[1.4rem] p-1.5 ${compact ? 'max-w-[240px]' : large ? 'max-w-[min(100%,320px)]' : 'max-w-[min(100%,280px)]'}`}
        style={{
          background: 'linear-gradient(145deg,#2a2a38,#12121c)',
          boxShadow: compact ? '0 6px 20px rgba(0,0,0,0.35)' : '0 12px 32px rgba(0,0,0,0.45)',
          border: '1px solid rgba(255,255,255,0.08)',
        }}
      >
        <div className="rounded-[1rem] overflow-hidden bg-[#07070e] border border-white/5">
          <div className="flex items-center justify-between px-2.5 py-1 bg-black/40">
            <span className="text-[7px] text-white/35">9:41</span>
            <div className="w-10 h-2.5 rounded-full bg-black/80" />
            <span className="text-[7px] text-white/35">●●●</span>
          </div>
          {children}
        </div>
      </div>
    </div>
  )
}

export function BbxPlanMockup({
  kind,
  color,
  planId,
  compact,
  large,
}: {
  kind: BbxMockupKind
  color: string
  planId: BbxPlanId
  compact?: boolean
  large?: boolean
}) {
  const accent = color
  const frameCompact = compact && !large

  if (kind === 'pwa') {
    return (
      <PhoneShell badge={compact ? undefined : 'Plan Esencial'} compact={frameCompact} large={large}>
        <div className="p-3 space-y-2">
          <div className="rounded-xl p-3 text-center" style={{ background: `${accent}12`, border: `1px dashed ${accent}50` }}>
            <p className="text-2xl mb-1">📲</p>
            <p className="text-[11px] font-bold text-white">Añadir a inicio</p>
            <p className="text-[9px] text-white/45 mt-0.5">Sin App Store · iOS y Android</p>
          </div>
          <div className="grid grid-cols-4 gap-2 px-1">
            {[...Array(4)].map((_, i) => (
              <div key={i} className={`aspect-square rounded-xl flex items-center justify-center text-[8px] font-bold ${i === 0 ? '' : 'opacity-40'}`}
                style={{ background: i === 0 ? `${accent}30` : 'rgba(255,255,255,0.05)', color: i === 0 ? accent : 'rgba(255,255,255,0.3)' }}>
                {i === 0 ? 'FM' : '·'}
              </div>
            ))}
          </div>
          <p className="text-[8px] text-center text-white/35">Icono de tu radio en la pantalla del oyente</p>
        </div>
      </PhoneShell>
    )
  }

  if (kind === 'player') {
    return (
      <PhoneShell badge={compact ? undefined : 'Reproductor en vivo'} compact={frameCompact} large={large}>
        <div className="px-2.5 py-1.5 flex justify-between items-center border-b border-white/5">
          <span className="font-display text-xs text-white">TU RADIO</span>
          <span className="text-[8px] font-bold px-1.5 py-0.5 rounded" style={{ color: accent, background: `${accent}18` }}>LIVE</span>
        </div>
        <div className="relative h-28 flex items-center justify-center" style={{ background: 'linear-gradient(180deg,#1a1028,#07070e)' }}>
          <div className="w-16 h-16 rounded-full border-2 flex items-center justify-center" style={{ borderColor: `${accent}70`, boxShadow: `0 0 20px ${accent}30` }}>
            <span className="font-display text-lg" style={{ color: accent }}>FM</span>
          </div>
          <div className="absolute bottom-1.5 left-2 right-2 flex gap-1.5 items-center">
            <div className="flex-1 h-0.5 rounded-full bg-white/10"><div className="h-full w-1/2 rounded-full" style={{ background: accent }} /></div>
            <div className="w-6 h-6 rounded-full flex items-center justify-center text-[8px] font-bold text-[#07070e]" style={{ background: accent }}>▶</div>
          </div>
        </div>
        <div className="flex justify-around py-2 border-t border-white/5">
          {['En vivo', 'Grilla', 'Participa'].map((l, i) => (
            <span key={l} className="text-[7px] font-semibold" style={{ color: i === 0 ? accent : 'rgba(255,255,255,0.3)' }}>{l}</span>
          ))}
        </div>
      </PhoneShell>
    )
  }

  if (kind === 'saludos') {
    return (
      <PhoneShell badge={compact ? undefined : 'Saludos al aire'} compact={frameCompact} large={large}>
        <div className="p-3">
          <p className="text-[10px] font-bold text-white mb-2">Saludos al Aire</p>
          <div className="rounded-lg p-2 mb-2 bg-white/[0.04] border border-white/6">
            <p className="text-[8px] text-white/35 mb-1">Para quién</p>
            <p className="text-[10px] text-white/70">Mi mamá en Rancagua ♥</p>
          </div>
          <div className="rounded-lg p-2 mb-2 bg-white/[0.04] border border-white/6">
            <p className="text-[8px] text-white/35 mb-1">Mensaje</p>
            <p className="text-[10px] text-white/70">Feliz cumpleaños…</p>
          </div>
          <div className="w-full py-2 rounded-lg text-center text-[10px] font-bold text-[#07070e]" style={{ background: accent }}>Enviar al locutor</div>
          <p className="text-[8px] text-center text-white/30 mt-2">Llega en tiempo real a cabina</p>
        </div>
      </PhoneShell>
    )
  }

  if (kind === 'banners') {
    return (
      <PhoneShell badge={compact ? undefined : 'Plan Pro · Banners'} compact={frameCompact} large={large}>
        <div className="px-2.5 py-1.5 border-b border-white/5"><span className="text-xs font-display text-white">En Vivo</span></div>
        <div className="h-20 flex items-center justify-center bg-gradient-to-b from-[#1a1028] to-[#07070e]">
          <div className="w-12 h-12 rounded-full border-2 flex items-center justify-center" style={{ borderColor: accent }}><span className="text-[10px] font-bold" style={{ color: accent }}>▶</span></div>
        </div>
        <div className="p-2 space-y-1.5">
          {['Restaurante El Sol', 'Clínica Dental'].map((name, i) => (
            <div key={name} className="rounded-lg px-2 py-1.5 flex items-center gap-2"
              style={{ background: i === 0 ? `${accent}18` : 'rgba(255,255,255,0.04)', border: i === 0 ? `1px solid ${accent}40` : '1px solid rgba(255,255,255,0.06)' }}>
              <div className="w-7 h-7 rounded-md shrink-0" style={{ background: `${accent}35` }} />
              <div className="min-w-0">
                <p className="text-[9px] font-bold text-white truncate">{name}</p>
                <p className="text-[7px] text-white/40">{i === 0 ? 'Banner activo · 2.4K imp.' : 'Rotación'}</p>
              </div>
            </div>
          ))}
        </div>
      </PhoneShell>
    )
  }

  if (kind === 'sorteos') {
    return (
      <PhoneShell badge={compact ? undefined : 'Sorteos + leads'} compact={frameCompact} large={large}>
        <div className="p-3">
          <div className="rounded-xl p-3 text-center mb-2" style={{ background: `linear-gradient(135deg,${accent}30,#07070e)` }}>
            <p className="text-[8px] uppercase tracking-wider text-white/50">Patrocinado por</p>
            <p className="font-display text-lg text-white">TU MARCA</p>
            <p className="text-[10px] text-white/70 mt-1">Sorteo fin de semana</p>
          </div>
          <div className="space-y-1.5">
            <div className="rounded-lg px-2 py-1.5 bg-white/[0.04] text-[9px] text-white/50">WhatsApp · +56 9 …</div>
            <div className="w-full py-2 rounded-lg text-center text-[10px] font-bold" style={{ background: accent, color: '#07070e' }}>Participar</div>
          </div>
          <p className="text-[8px] text-center text-[#00D9A0] mt-2 font-semibold">+127 registros capturados</p>
        </div>
      </PhoneShell>
    )
  }

  if (kind === 'analytics') {
    return (
      <PhoneShell badge={compact ? undefined : 'Analytics'} compact={frameCompact} large={large}>
        <div className="p-3">
          <p className="text-[9px] text-white/40 mb-2">Panel · tiempo real</p>
          <div className="grid grid-cols-2 gap-1.5 mb-2">
            {[{ v: '847', l: 'Oyentes' }, { v: '+12%', l: 'vs ayer' }].map(s => (
              <div key={s.l} className="rounded-lg py-2 text-center bg-white/[0.04]">
                <p className="font-display text-lg leading-none" style={{ color: accent }}>{s.v}</p>
                <p className="text-[7px] text-white/35">{s.l}</p>
              </div>
            ))}
          </div>
          <div className="rounded-lg p-2 bg-white/[0.03]">
            <p className="text-[7px] text-white/35 mb-1">Sesiones / día</p>
            <div className="flex items-end gap-0.5 h-10">
              {[35, 50, 42, 65, 58, 72, 68].map((h, i) => (
                <div key={i} className="flex-1 rounded-t-sm" style={{ height: `${h}%`, background: i === 5 ? accent : `${accent}50` }} />
              ))}
            </div>
          </div>
        </div>
      </PhoneShell>
    )
  }

  if (kind === 'dominio') {
    return (
      <PhoneShell badge={compact ? undefined : 'Plan Premium'} compact={frameCompact} large={large}>
        <div className="p-3">
          <div className="rounded-lg overflow-hidden border border-white/10">
            <div className="flex items-center gap-1.5 px-2 py-1.5 bg-white/[0.06]">
              <span className="text-[8px]">🔒</span>
              <span className="text-[9px] font-mono truncate" style={{ color: accent }}>radio.tumarca.cl</span>
            </div>
            <div className="h-24 flex flex-col items-center justify-center bg-gradient-to-b from-[#1a1028] to-[#07070e]">
              <p className="font-display text-xl text-white">TU RADIO</p>
              <p className="text-[9px] text-white/45 mt-1">App oficial · dominio propio</p>
            </div>
          </div>
          <p className="text-[8px] text-center text-white/35 mt-2">Sin subdominio genérico</p>
        </div>
      </PhoneShell>
    )
  }

  if (kind === 'playstore') {
    return (
      <PhoneShell badge={compact ? undefined : 'Google Play'} compact={frameCompact} large={large}>
        <div className="p-3">
          <div className="flex gap-2 items-start">
            <div className="w-12 h-12 rounded-xl shrink-0 flex items-center justify-center font-display text-sm font-bold" style={{ background: `${accent}35`, color: accent }}>FM</div>
            <div>
              <p className="text-[11px] font-bold text-white">Tu Radio FM</p>
              <p className="text-[8px] text-[#00D9A0]">BBX Radio System</p>
              <p className="text-[8px] text-white/40 mt-0.5">★★★★☆ · 500+ descargas</p>
            </div>
          </div>
          <div className="mt-2 w-full py-2 rounded-lg text-center text-[10px] font-bold text-white" style={{ background: '#01875f' }}>Instalar</div>
          <p className="text-[8px] text-white/35 mt-2 leading-relaxed">APK publicada en Play Store con tu icono y nombre.</p>
        </div>
      </PhoneShell>
    )
  }

  // marca
  return (
    <PhoneShell badge={compact ? undefined : 'White-label'} compact={frameCompact} large={large}>
      <div className="p-3 space-y-2">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm" style={{ background: `${accent}30`, color: accent }}>T</div>
          <div>
            <p className="text-[10px] font-bold text-white">Colores · logo · tipografía</p>
            <p className="text-[8px] text-white/40">100% marca de la emisora</p>
          </div>
        </div>
        <div className="flex gap-1">
          {[accent, '#db8918', '#40B9BF', '#07070e'].map(c => (
            <div key={c} className="flex-1 h-6 rounded-md" style={{ background: c, border: '1px solid rgba(255,255,255,0.1)' }} />
          ))}
        </div>
        <div className="rounded-lg px-2 py-2 text-[9px] text-white/55 bg-white/[0.03]">
          Sin menciones BBX visibles para el oyente final
        </div>
      </div>
    </PhoneShell>
  )
}

const PREVIEW_KIND: Record<BbxPlanId, BbxMockupKind> = {
  esencial: 'player',
  pro: 'banners',
  premium: 'dominio',
}

export function BbxPlanPreviewThumb({ planId, color }: { planId: BbxPlanId; color: string }) {
  return (
    <div className="mb-3 rounded-lg overflow-hidden border border-white/6 pointer-events-none max-h-[120px]" style={{ background: '#0a0a12' }}>
      <div className="scale-[0.55] origin-top -mb-16">
        <BbxPlanMockup kind={PREVIEW_KIND[planId]} color={color} planId={planId} compact />
      </div>
    </div>
  )
}
