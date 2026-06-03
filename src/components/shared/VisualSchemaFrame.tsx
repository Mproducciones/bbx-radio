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
      <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-white/40 mb-2.5 text-center">
        Vista previa · experiencia del oyente
      </p>
      <div className="relative flex justify-center">{children}</div>
      {callouts.length > 0 && (
        <div className="flex flex-wrap gap-1.5 justify-center mt-3 px-1">
          {callouts.map(c => (
            <span
              key={c}
              className="pro-chip"
              style={{ '--chip-accent': accent } as React.CSSProperties}
            >
              {c}
            </span>
          ))}
        </div>
      )}
      <div
        className="pro-schema-note mt-3"
        style={{ '--schema-accent': accent } as React.CSSProperties}
      >
        <p className="text-[9px] font-bold uppercase tracking-[0.16em] mb-1.5" style={{ color: accent }}>
          Cómo se implementa
        </p>
        <p className="text-xs text-white/70 leading-relaxed">{visualNote}</p>
      </div>
    </div>
  )
}
