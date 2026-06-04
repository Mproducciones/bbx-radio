'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  AD_PLACEMENTS,
  AD_PLAN_RULES,
  AD_TIPO_LABELS,
  type AdBannerTipo,
  type AdPlanRule,
} from '@/lib/adPlanRules'
import type { SponsorPlanId } from '@/lib/sponsorPlans'
import { studioStructurePath } from '@/lib/studioStructure'
import { AdminCard, AdminCardHeader, AdminGhostButton, AdminIcons } from './adminUi'

const STUDIO_PUBLICIDAD = studioStructurePath('publicidad')
const PLAN_COLORS: Record<SponsorPlanId, string> = {
  basico: '#40B9BF',
  premium: '#db8918',
  empresarial: '#7D59B5',
}

function PlanTab({ rule, active, onClick }: { rule: AdPlanRule; active: boolean; onClick: () => void }) {
  const color = PLAN_COLORS[rule.id]
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex-1 min-w-[5.5rem] rounded-xl px-2.5 py-2 text-left transition-colors relative"
      style={{
        border: active ? `1.5px solid ${color}66` : '1px solid rgba(255,255,255,0.08)',
        background: active ? `${color}14` : 'rgba(255,255,255,0.03)',
      }}
    >
      <p className="text-[10px] font-black uppercase tracking-wide" style={{ color }}>
        {rule.nombre}
      </p>
      <p className="text-white/50 text-[9px] mt-0.5">{rule.precioReferencia}</p>
    </button>
  )
}

export function AdPlansGuidePanel() {
  const [plan, setPlan] = useState<SponsorPlanId>('basico')
  const rule = AD_PLAN_RULES.find(r => r.id === plan)!

  return (
    <AdminCard accent="#db8918">
      <AdminCardHeader
        title="Planes y dónde se ve la publicidad"
        icon={<AdminIcons.megaphone />}
        action={<AdminGhostButton href={STUDIO_PUBLICIDAD}>Abrir Studio</AdminGhostButton>}
      />

      <div className="px-4 pb-4 space-y-4">
        <p className="text-[11px] text-white/45 leading-relaxed">
          La app <strong className="text-white/70">no enlaza automáticamente</strong> el plan de venta con Sanity.
          Al cerrar un cliente, creá la campaña en Studio con el <strong className="text-white/70">tipo de banner</strong> y{' '}
          <strong className="text-white/70">prioridad</strong> que corresponden al plan. Los spots FM se programan en cabina.
        </p>

        <div className="flex gap-2">
          {AD_PLAN_RULES.map(r => (
            <PlanTab key={r.id} rule={r} active={plan === r.id} onClick={() => setPlan(r.id)} />
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={plan}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="space-y-3"
          >
            <div
              className="rounded-xl p-3 text-[10px] space-y-2"
              style={{ background: `${PLAN_COLORS[plan]}10`, border: `1px solid ${PLAN_COLORS[plan]}30` }}
            >
              <p className="text-white/80 font-semibold">FM · {rule.spotsFm}</p>
              <div>
                <p className="text-white/40 uppercase tracking-wider text-[9px] mb-1">En la app (Studio)</p>
                <ul className="text-white/55 space-y-1 list-disc list-inside">
                  {rule.gestionApp.map(line => (
                    <li key={line}>{line}</li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="text-white/40 uppercase tracking-wider text-[9px] mb-1">Tipos permitidos</p>
                <div className="flex flex-wrap gap-1">
                  {rule.allowedTipos.map(t => (
                    <span
                      key={t}
                      className="px-1.5 py-0.5 rounded-md text-[9px] font-semibold"
                      style={{ background: `${PLAN_COLORS[plan]}22`, color: PLAN_COLORS[plan] }}
                    >
                      {AD_TIPO_LABELS[t]}
                    </span>
                  ))}
                </div>
                <p className="text-white/35 mt-1.5">
                  Prioridad sugerida: {rule.prioridadSugerida.min}–{rule.prioridadSugerida.max}
                  {rule.prioridadSugerida.premiumMin != null &&
                    ` · Premium ≥ ${rule.prioridadSugerida.premiumMin}`}
                </p>
              </div>
            </div>

            <div className="rounded-xl border border-white/[0.06] overflow-hidden">
              <p className="px-3 py-2 text-[9px] font-bold uppercase tracking-wider text-white/35 bg-white/[0.02]">
                Mapa de pantallas
              </p>
              {(Object.keys(AD_PLACEMENTS) as AdBannerTipo[]).map(tipo => {
                const place = AD_PLACEMENTS[tipo]
                const allowed = rule.allowedTipos.includes(tipo)
                return (
                  <div
                    key={tipo}
                    className="px-3 py-2 border-t border-white/[0.04] flex gap-2"
                    style={{ opacity: allowed ? 1 : 0.35 }}
                  >
                    <span className="text-[9px] font-semibold shrink-0 w-[7.5rem]" style={{ color: allowed ? PLAN_COLORS[plan] : '#666' }}>
                      {AD_TIPO_LABELS[tipo]}
                    </span>
                    <div className="min-w-0 text-[9px] text-white/45">
                      <p>{place.pantallas.join(' · ')}</p>
                      <p className="text-white/30 mt-0.5">{place.nota}</p>
                    </div>
                  </div>
                )
              })}
            </div>

            {rule.alertas.length > 0 && (
              <div className="rounded-lg px-3 py-2 text-[10px] text-[#FFB300]/90 bg-[#FFB300]/8 border border-[#FFB300]/20">
                {rule.alertas.map(a => (
                  <p key={a}>⚠ {a}</p>
                ))}
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        <details className="text-[10px] text-white/35">
          <summary className="cursor-pointer text-white/50 font-semibold">Flujo completo (venta → aire)</summary>
          <ol className="mt-2 space-y-1 list-decimal list-inside text-white/40">
            <li>Cliente elige plan en /anunciate → ventas confirma por WhatsApp.</li>
            <li>Comercial crea documento Publicidad en /studio con fechas, arte y plan contratado.</li>
            <li>Panel Admin → Comercial: revisar campañas activas, vencimientos e impresiones.</li>
            <li>La app consulta /api/ads?tipo=… y muestra por prioridad y fechas.</li>
            <li>Demo comercial: botón “Ver en la app” en /anunciate (cookie 1 h, no reemplaza clientes reales).</li>
          </ol>
        </details>
      </div>
    </AdminCard>
  )
}
