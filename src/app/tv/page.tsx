import type { Metadata } from 'next'
import { BienvenidaTV } from '@/components/tv/BienvenidaTV'
import { AppMenuScreen } from '@/components/layout/AppMenuScreen'
import { SectionHeader } from '@/components/layout/SectionHeader'

export const metadata: Metadata = {
  title: 'Bienvenida TV — Radio Bienvenida 93.3 FM',
  description: 'Señal de televisión en vivo de Radio Bienvenida desde Rancagua.',
}

export default function TVPage() {
  return (
    <AppMenuScreen scroll className="tv-route w-full min-w-0">
      <SectionHeader compact title="Bienvenida TV" />
      <p className="tv-route__sub shrink-0">Señal en vivo · pantalla completa disponible · la radio se pausa</p>
      <BienvenidaTV variant="embedded" />
    </AppMenuScreen>
  )
}
