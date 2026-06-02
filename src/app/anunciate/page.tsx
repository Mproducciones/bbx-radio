import { SponsorLanding } from '@/components/sponsor/SponsorLanding'
import type { Metadata } from 'next'
import { AppMenuScreen } from '@/components/layout/AppMenuScreen'

export const metadata: Metadata = {
  title: 'Anuncia aquí — Radio Bienvenida 93.3 FM',
  description:
    'Publicidad en Radio Bienvenida 93.3 FM y app: spots al aire, banners digitales y planes desde $80.000/mes. Rancagua y región.',
  openGraph: {
    title: 'Anuncia en Radio Bienvenida 93.3 FM',
    description: 'Tu negocio en la radio y en la app de los oyentes.',
    type: 'website',
  },
}

export default function AnunciatePage() {
  return (
    <AppMenuScreen scroll className="md:max-w-4xl lg:max-w-6xl relative z-[2]">
      <SponsorLanding />
    </AppMenuScreen>
  )
}
