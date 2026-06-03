import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'BBX Radio System — Plataforma digital para radios',
  description:
    'App PWA white-label para emisoras: streaming en vivo, publicidad digital, participación del oyente y panel de control. Implementación en 48 horas.',
  openGraph: {
    title: 'BBX Radio System',
    description: 'Tu radio. Tu audiencia. Tu negocio digital.',
    type: 'website',
  },
}

/** BBX: un solo contenedor de scroll dentro del shell móvil (evita doble scroll y taps bloqueados). */
export default function BbxLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bbx-layout relative flex flex-1 flex-col min-h-0 min-w-0 w-full max-w-full overflow-x-hidden overflow-y-auto overscroll-contain touch-pan-y md:min-h-[100dvh]">
      {children}
    </div>
  )
}
