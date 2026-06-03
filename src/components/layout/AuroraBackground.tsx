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
      className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden"
      style={{ zIndex: 0 }}
      aria-hidden="true"
    >
      {/* % en lugar de vw + sin scale en móvil — evita overflow-x por transform */}
      <AuroraBlob
        animClass="aurora-blob-1"
        blur={40}
        box={{ width: '38%', height: '38%', top: '0', left: '0' }}
        gradient="radial-gradient(circle, rgba(219,137,24,0.14) 0%, transparent 70%)"
      />
      <AuroraBlob
        animClass="aurora-blob-2"
        blur={40}
        box={{ width: '34%', height: '34%', top: '0', right: '0' }}
        gradient="radial-gradient(circle, rgba(125,89,181,0.12) 0%, transparent 70%)"
      />
      <AuroraBlob
        animClass="aurora-blob-3"
        blur={45}
        box={{ width: '36%', height: '36%', bottom: '0', left: '32%' }}
        gradient="radial-gradient(circle, rgba(64,185,191,0.10) 0%, transparent 70%)"
      />
    </div>
  )
}
