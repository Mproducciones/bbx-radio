import { SponsorLanding } from '@/components/sponsor/SponsorLanding'
import { AppMenuScreen } from '@/components/layout/AppMenuScreen'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Anuncia aquí — Radio Bienvenida 93.3 FM',
  description: 'Publicidad en Radio Bienvenida 93.3 FM y app. Planes desde $80.000/mes. Rancagua y región.',
}

export default function AnunciatePage() {
  return (
    <AppMenuScreen scroll className="md:max-w-4xl lg:max-w-6xl">
      <SponsorLanding />
    </AppMenuScreen>
  )
}
