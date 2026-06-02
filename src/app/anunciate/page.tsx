import { SponsorLanding } from '@/components/sponsor/SponsorLanding'
import type { Metadata } from 'next'
import { AppMenuScreen } from '@/components/layout/AppMenuScreen'

export const metadata: Metadata = {
  title: '¿Eres empresa? — Radio Bienvenida 93.3 FM',
  description: 'Anúnciate en Radio Bienvenida y llega a miles de oyentes en Rancagua. Paquetes desde $80.000 CLP/mes.',
}

export default function AnunciatePage() {
  return (
    <AppMenuScreen scroll className="md:max-w-3xl relative z-[2]">
      <SponsorLanding />
    </AppMenuScreen>
  )
}
