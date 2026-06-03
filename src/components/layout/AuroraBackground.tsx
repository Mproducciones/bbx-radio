'use client'

import { usePathname } from 'next/navigation'

const EXCLUDED = ['/admin', '/studio', '/anunciate']

/** Blur en wrapper + animación en hijo — Safari iOS congela transform si blur está en el mismo nodo */
function AuroraBlob({
  animClass,
  blur,
  box,
  gradient,
}: {
  animClass: string
  blur: number
  box: React.CSSProperties
  gradient: string
}) {
  return (
    <div
      className="absolute"
      style={{
        ...box,
        WebkitFilter: `blur(${blur}px)`,
        filter: `blur(${blur}px)`,
      }}
    >
      <div
        className={`w-full h-full rounded-full ${animClass}`}
        style={{
          background: gradient,
          willChange: 'transform',
        }}
      />
    </div>
  )
}

export function AuroraBackground() {
  const pathname = usePathname()
  if (EXCLUDED.some(p => pathname.startsWith(p))) return null

  return (
    <div
      className="fixed inset-0 pointer-events-none overflow-hidden max-md:[clip-path:inset(0)]"
      style={{ zIndex: 0, width: '100%', maxWidth: '100%' }}
      aria-hidden="true"
    >
      {/* % en lugar de vw + sin scale en móvil — evita overflow-x por transform */}
      <AuroraBlob
        animClass="aurora-blob-1"
        blur={50}
        box={{ width: '42%', height: '42%', top: '-4%', left: '-4%' }}
        gradient="radial-gradient(circle, rgba(219,137,24,0.14) 0%, transparent 70%)"
      />
      <AuroraBlob
        animClass="aurora-blob-2"
        blur={50}
        box={{ width: '38%', height: '38%', top: '-2%', right: '-2%' }}
        gradient="radial-gradient(circle, rgba(125,89,181,0.12) 0%, transparent 70%)"
      />
      <AuroraBlob
        animClass="aurora-blob-3"
        blur={60}
        box={{ width: '44%', height: '44%', bottom: '-4%', left: '28%' }}
        gradient="radial-gradient(circle, rgba(64,185,191,0.10) 0%, transparent 70%)"
      />
    </div>
  )
}
