import { SponsorLanding } from '@/components/sponsor/SponsorLanding'
import { AppMenuScreen } from '@/components/layout/AppMenuScreen'
import { getListenerCount } from '@/lib/listenerStore'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Anuncia aquí — Radio Bienvenida 93.3 FM',
  description: 'Publicidad en Radio Bienvenida 93.3 FM y app. Planes desde $80.000/mes. Rancagua y región.',
}

export default function AnunciatePage() {
  const initialListeners = getListenerCount()

  return (
    <AppMenuScreen scroll className="w-full min-w-0 max-w-full md:max-w-2xl lg:max-w-3xl">
      <SponsorLanding initialListeners={initialListeners} />
    </AppMenuScreen>
  )
}
