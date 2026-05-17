import type { Metadata } from 'next'
import { LogoutButton } from '@/components/studio/LogoutButton'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Admin — Radio Bienvenida 93.3 FM',
  manifest: '/admin-manifest.json',
}

export default function StudioLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="relative min-h-screen">
      <LogoutButton />
      {children}
    </div>
  )
}
