import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Anuncia aquí — Radio Bienvenida 93.3 FM',
}

/** Scroll completo en móvil (no recortar contenido). */
export default function AnunciateLayout({ children }: { children: React.ReactNode }) {
  return <div className="w-full min-w-0 flex-1 flex flex-col">{children}</div>
}
