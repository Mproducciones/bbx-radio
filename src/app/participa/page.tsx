import type { Metadata } from 'next'
import { ParticipaScreen } from '@/components/engagement/ParticipaScreen'

export const metadata: Metadata = {
  title: 'Participa — Radio Bienvenida 93.3 FM',
  description: 'Vota en la batalla de temas, pide canciones al locutor y participa en sorteos en vivo.',
}

export default function ParticipaPage() {
  return <ParticipaScreen />
}
