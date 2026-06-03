'use client'

import { usePathname } from 'next/navigation'

const EXCLUDED = ['/admin', '/studio', '/anunciate']

/** Blur en wrapper + animación en hijo — Safari iOS congela transform si blur está en el mismo nodo */
function AuroraBlob({
  animation,
  blur,
  box,
  gradient,
}: {
  animation: string
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
        className="w-full h-full rounded-full"
        style={{
          background: gradient,
          animation,
          WebkitAnimation: animation,
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
    <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }} aria-hidden="true">
      <AuroraBlob
        animation="aurora-1 14s ease-in-out infinite"
        blur={50}
        box={{ width: '55vw', height: '55vw', top: '0', left: '0', maxWidth: '100%' }}
        gradient="radial-gradient(circle, rgba(219,137,24,0.14) 0%, transparent 70%)"
      />
      <AuroraBlob
        animation="aurora-2 18s ease-in-out infinite"
        blur={50}
        box={{ width: '50vw', height: '50vw', top: '0', right: '0' }}
        gradient="radial-gradient(circle, rgba(125,89,181,0.12) 0%, transparent 70%)"
      />
      <AuroraBlob
        animation="aurora-3 22s ease-in-out infinite"
        blur={60}
        box={{ width: '55vw', height: '55vw', bottom: '0', left: '50%', transform: 'translateX(-50%)' }}
        gradient="radial-gradient(circle, rgba(64,185,191,0.10) 0%, transparent 70%)"
      />
    </div>
  )
}
