import { SponsorLanding } from '@/components/sponsor/SponsorLanding'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Anuncia aquí — Radio Bienvenida 93.3 FM',
  description: 'Publicidad en Radio Bienvenida 93.3 FM y app. Planes desde $80.000/mes. Rancagua y región.',
}

export default function AnunciatePage() {
  return (
    <main className="relative z-[2] mx-auto w-full max-w-6xl px-4 pt-3 pb-2 md:pt-8 md:pb-24 max-md:min-h-[var(--app-screen-h)] max-md:overflow-y-auto">
      <SponsorLanding />
    </main>
  )
}
