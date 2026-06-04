import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'BBX · Suscripciones',
  robots: { index: false, follow: false },
}

export default function BbxAdminLayout({ children }: { children: React.ReactNode }) {
  return children
}
