import type { Metadata } from 'next'
import { SaludoForm } from '@/components/engagement/SaludoForm'
import { SectionHeader } from '@/components/layout/SectionHeader'
import { AppMenuScreen } from '@/components/layout/AppMenuScreen'

export const metadata: Metadata = {
  title: 'Saludos al Aire — Radio Bienvenida 93.3 FM',
  description: 'Mandá un saludo al aire. El locutor lo lee en vivo para quien vos quieras.',
}

export default function SaludosPage() {
  return (
    <AppMenuScreen>
      <div className="flex flex-col flex-1 min-h-0">
        <SectionHeader
          compact
          kicker="En vivo · Radio Bienvenida"
          title="Saludos al Aire"
          subtitle="El locutor lo lee en directo"
        />
        <SaludoForm compact />
      </div>
    </AppMenuScreen>
  )
}
