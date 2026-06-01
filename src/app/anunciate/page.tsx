import { SponsorLanding } from '@/components/sponsor/SponsorLanding'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '¿Eres empresa? — Radio Bienvenida 93.3 FM',
  description: 'Anúnciate en Radio Bienvenida y llega a miles de oyentes en Rancagua. Paquetes desde $80.000 CLP/mes.',
}

export default function AnunciatePage() {
  return (
    <main className="min-h-screen px-4 py-6 max-w-md md:max-w-3xl mx-auto">
      <SponsorLanding />
    </main>
  )
}
