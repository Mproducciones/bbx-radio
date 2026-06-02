import type { Metadata } from 'next'
import { ParticipaScreen } from '@/components/engagement/ParticipaScreen'

export const metadata: Metadata = {
  title: 'Participá — Radio Bienvenida 93.3 FM',
  description: 'Votá tu canción favorita y pedí temas al locutor en vivo.',
}

export default function ParticipaPage() {
  return <ParticipaScreen />
}
