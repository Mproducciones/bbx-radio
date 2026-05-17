import { clearAdminSessionCookie } from '@/lib/adminAuth'

export async function POST() {
  return clearAdminSessionCookie()
}
