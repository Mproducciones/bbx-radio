import { SponsorLanding } from '@/components/sponsor/SponsorLanding'
import { AppMenuScreen } from '@/components/layout/AppMenuScreen'
import { getListenerCount } from '@/lib/listenerStore'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Publicidad — Radio Bienvenida 93.3 FM',
  description:
    'Publicidad en las 33 comunas de O\'Higgins: 4 señales FM + banners medibles en la app. Planes desde $80.000/mes. Rancagua.',
}

export default function AnunciatePage() {
  const initialListeners = getListenerCount()

  return (
    <AppMenuScreen scroll className="w-full min-w-0 max-w-full md:max-w-2xl lg:max-w-3xl">
      <SponsorLanding initialListeners={initialListeners} />
    </AppMenuScreen>
  )
}
