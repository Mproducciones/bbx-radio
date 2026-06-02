'use client'

import { AdTrackView, trackAdClick } from '@/components/ads/AdTrackView'

const AD_ID = 'demo-programatico-bbx'
const PLACEMENT = 'programatico_feed'

/** Espacio display complementario (monetización programática demo). */
export function ProgrammaticAdSlot({ className }: { className?: string }) {
  return (
    <AdTrackView adId={AD_ID} adTipo="programatico" placement={PLACEMENT} className={className}>
      <a
        href="/anunciate"
        onClick={() => trackAdClick(AD_ID, 'programatico', PLACEMENT)}
        className="block rounded-xl overflow-hidden"
        style={{ background: '#0e0e16', border: '1px solid rgba(125,89,181,0.25)' }}
      >
        <div className="px-3 py-2.5 flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center text-[10px] font-black shrink-0"
            style={{ background: 'rgba(125,89,181,0.2)', color: '#7D59B5' }}
          >
            AD
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[8px] text-white/35 uppercase tracking-wider">Espacio display</p>
            <p className="text-white/70 text-xs font-semibold truncate">Complemento programático</p>
            <p className="text-white/40 text-[10px] truncate">Ingreso pasivo · CPM estimado</p>
          </div>
          <span className="text-[9px] font-bold px-2 py-1 rounded-lg shrink-0" style={{ background: '#7D59B525', color: '#7D59B5' }}>
            Info
          </span>
        </div>
      </a>
    </AdTrackView>
  )
}
