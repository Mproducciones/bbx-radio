'use client'

import { usePathname } from 'next/navigation'

const EXCLUDED = ['/admin', '/studio', '/bbx']

export function NoiseOverlay() {
  const pathname = usePathname()
  if (EXCLUDED.some(p => pathname.startsWith(p))) return null
  return (
    <div
      className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden"
      style={{
        zIndex: 9999,
        opacity: 0.028,
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        backgroundRepeat: 'repeat',
        backgroundSize: '128px 128px',
      }}
      aria-hidden="true"
    />
  )
}
