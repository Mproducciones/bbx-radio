'use client'

import { usePathname } from 'next/navigation'
import { BottomNav } from './BottomNav'

export function ClientBottomNav() {
  const pathname = usePathname()
  
  if (pathname === '/admin') {
    return null
  }
  
  return <BottomNav />
}