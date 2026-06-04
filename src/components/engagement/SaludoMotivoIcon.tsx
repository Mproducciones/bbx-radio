import type { ReactNode } from 'react'
import type { MotivoId } from '@/lib/saludoTypes'

const paths: Record<MotivoId, ReactNode> = {
  cumpleanos: (
    <>
      <rect x="5" y="14" width="14" height="6" rx="1.5" fill="currentColor" opacity="0.35" />
      <path d="M6 14V10a6 6 0 0 1 12 0v4" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
      <path d="M8 8c1-2 3-2 4 0M16 8c-1-2-3-2-4 0" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </>
  ),
  aniversario: (
    <>
      <path d="M12 20s-7-4.5-7-9a4 4 0 0 1 7-2 4 4 0 0 1 7 2c0 4.5-7 9-7 9z" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinejoin="round" />
      <circle cx="12" cy="11" r="1.5" fill="currentColor" />
    </>
  ),
  dedicatoria: (
    <>
      <path d="M9 18V8l4-2v12" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M5 14c2-1 4-1 6 0s4 1 6 0" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
    </>
  ),
  apoyo: (
    <>
      <path d="M8 11v5M16 11v5" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
      <path d="M6 16h12" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
      <path d="M12 6v10M9 9l3-3 3 3" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
    </>
  ),
  extrañas: (
    <>
      <path d="M5 8h14v10H5z" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinejoin="round" />
      <path d="M5 8l7 6 7-6" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinejoin="round" />
    </>
  ),
  saludo: (
    <>
      <path d="M6 14c2-3 4-4 6-4s4 1 6 4" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
      <path d="M8 10V7M12 9V6M16 10V7" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
    </>
  ),
}

export function SaludoMotivoIcon({ id, className }: { id: MotivoId; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      {paths[id]}
    </svg>
  )
}
