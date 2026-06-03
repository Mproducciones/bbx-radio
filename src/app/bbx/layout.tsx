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

/** BBX: scroll propio a pantalla completa, fuera del recorte del shell de la app. */
export default function BbxLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bbx-layout w-full min-h-[100dvh] max-md:overflow-y-auto overflow-x-hidden max-md:[-webkit-overflow-scrolling:touch]">
      {children}
    </div>
  )
}
