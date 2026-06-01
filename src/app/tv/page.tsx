import type { Metadata } from 'next'
import { BienvenidaTV } from '@/components/tv/BienvenidaTV'

export const metadata: Metadata = {
  title: 'Bienvenida TV — Radio Bienvenida 93.3 FM',
  description: 'Señal de televisión en vivo de Radio Bienvenida desde Rancagua.',
}

export default function TVPage() {
  return (
    <main className="min-h-screen flex flex-col" style={{ background: '#000' }}>
      <BienvenidaTV />
    </main>
  )
}
