import type { Metadata } from 'next'
import { SaludoForm } from '@/components/engagement/SaludoForm'

export const metadata: Metadata = {
  title: 'Saludos al Aire — Radio Bienvenida 93.3 FM',
  description: 'Mandá un saludo al aire. El locutor lo lee en vivo para quien vos quieras.',
}

export default function SaludosPage() {
  return (
    <main className="min-h-screen px-5 pt-6 pb-24 max-w-md mx-auto" style={{ zIndex: 1 }}>
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-2 h-2 rounded-full bg-[#db8918] animate-pulse" />
          <p className="text-[#db8918] text-[10px] font-black uppercase tracking-widest">En vivo · Radio Bienvenida</p>
        </div>
        <h1 className="font-display text-4xl text-white leading-none">Saludos<br />al Aire</h1>
      </div>
      <SaludoForm />
    </main>
  )
}
