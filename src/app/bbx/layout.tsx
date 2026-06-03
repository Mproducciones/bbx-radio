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

/** BBX usa scroll propio; evita que el contenedor de la app recorte el contenido. */
export default function BbxLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="max-md:min-h-0 max-md:h-auto max-md:overflow-y-auto overflow-x-hidden">
      {children}
    </div>
  )
}
