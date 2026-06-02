/** Marco para mockups: etiquetas + nota de implementación (no lista de features). */
export function VisualSchemaFrame({
  children,
  callouts,
  visualNote,
  accent,
}: {
  children: React.ReactNode
  callouts: string[]
  visualNote: string
  accent: string
}) {
  return (
    <div>
      <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-white/35 mb-2 text-center">
        Esquema · así lo ve el oyente
      </p>
      <div className="relative flex justify-center">
        {children}
      </div>
      {callouts.length > 0 && (
        <div className="flex flex-wrap gap-1.5 justify-center mt-3 px-1">
          {callouts.map(c => (
            <span
              key={c}
              className="text-[9px] font-semibold px-2 py-1 rounded-full"
              style={{ background: `${accent}18`, border: `1px solid ${accent}45`, color: accent }}
            >
              {c}
            </span>
          ))}
        </div>
      )}
      <div
        className="mt-3 rounded-xl p-3"
        style={{ background: 'rgba(255,255,255,0.03)', borderLeft: `3px solid ${accent}` }}
      >
        <p className="text-[9px] font-bold uppercase tracking-wider mb-1" style={{ color: accent }}>
          Cómo se implementa
        </p>
        <p className="text-xs text-white/75 leading-relaxed">{visualNote}</p>
      </div>
    </div>
  )
}
