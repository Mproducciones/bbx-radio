'use client'

import { LiveListenerCounter } from '@/components/admin/LiveListenerCounter'
import { SaludosPanel } from '@/components/admin/SaludosPanel'
import { CommercialAdsDashboard } from '@/components/admin/CommercialAdsDashboard'
import { AnalyticsPanel } from '@/components/admin/AnalyticsPanel'
import { SolicitudesPanel } from '@/components/admin/SolicitudesPanel'
import { ListenerChart } from '@/components/admin/ListenerChart'
import { PollManager } from '@/components/admin/PollManager'
import { NotificacionPanel } from '@/components/admin/NotificacionPanel'
import { ContestsPanel } from '@/components/admin/ContestsPanel'
import { ReportsPanel } from '@/components/admin/ReportsPanel'
import { StudioContentPanel } from '@/components/admin/StudioContentPanel'
import { AdminSectionTitle } from '@/components/admin/adminUi'
import type { AdminSection } from '@/components/admin/AdminNav'

export function AdminSectionContent({ section }: { section: AdminSection }) {
  switch (section) {
    case 'overview':
      return (
        <div className="flex flex-col gap-6">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
            <div className="lg:col-span-2">
              <LiveListenerCounter />
            </div>
            <div className="lg:col-span-3">
              <AnalyticsPanel />
            </div>
          </div>
          <ListenerChart />
        </div>
      )

    case 'live':
      return (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
          <SaludosPanel />
          <SolicitudesPanel />
          <div className="xl:col-span-2">
            <PollManager />
          </div>
        </div>
      )

    case 'commercial':
      return (
        <div className="flex flex-col gap-6">
          <CommercialAdsDashboard />
          <ContestsPanel />
          <ReportsPanel />
        </div>
      )

    case 'comms':
      return (
        <div className="max-w-2xl">
          <NotificacionPanel />
        </div>
      )

    case 'content':
      return <StudioContentPanel />

    default:
      return null
  }
}
