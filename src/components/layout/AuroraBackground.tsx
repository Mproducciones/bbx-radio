'use client'

import { usePathname } from 'next/navigation'

const EXCLUDED = ['/admin', '/studio']

export function AuroraBackground() {
  const pathname = usePathname()
  if (EXCLUDED.some(p => pathname.startsWith(p))) return null

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }} aria-hidden="true">
      {/* Blob 1 — amber, top-left */}
      <div className="absolute rounded-full"
        style={{
          width: '60vw', height: '60vw',
          top: '-20vw', left: '-15vw',
          background: 'radial-gradient(circle, rgba(219,137,24,0.07) 0%, transparent 70%)',
          animation: 'aurora-1 14s ease-in-out infinite',
          filter: 'blur(60px)',
        }} />
      {/* Blob 2 — purple, top-right */}
      <div className="absolute rounded-full"
        style={{
          width: '50vw', height: '50vw',
          top: '-10vw', right: '-10vw',
          background: 'radial-gradient(circle, rgba(125,89,181,0.06) 0%, transparent 70%)',
          animation: 'aurora-2 18s ease-in-out infinite',
          filter: 'blur(60px)',
        }} />
      {/* Blob 3 — cyan, bottom */}
      <div className="absolute rounded-full"
        style={{
          width: '70vw', height: '70vw',
          bottom: '-30vw', left: '15vw',
          background: 'radial-gradient(circle, rgba(64,185,191,0.05) 0%, transparent 70%)',
          animation: 'aurora-3 22s ease-in-out infinite',
          filter: 'blur(80px)',
        }} />
    </div>
  )
}
