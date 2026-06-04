import type { Metadata } from 'next'
import { SaludosScreen } from '@/components/engagement/SaludosScreen'

export const metadata: Metadata = {
  title: 'Saludos al Aire — Radio Bienvenida 93.3 FM',
  description: 'Manda un saludo al aire. El locutor lo lee en vivo para quien tú quieras.',
}

export default function SaludosPage() {
  return <SaludosScreen />
}
