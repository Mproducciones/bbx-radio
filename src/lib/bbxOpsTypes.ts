export type OpsSeverity = 'critical' | 'warning' | 'info'

export type OpsCategory =
  | 'subscription'
  | 'billing'
  | 'engagement'
  | 'infrastructure'
  | 'commercial'

export type OpsAlert = {
  tenantId: string | null
  severity: OpsSeverity
  category: OpsCategory
  title: string
  message: string
  actionUrl?: string
  dedupeKey: string
}

export type OpsAlertRow = OpsAlert & {
  id: string
  acknowledgedAt: string | null
  lastNotifiedAt: string | null
  createdAt: string
  updatedAt: string
}

export type OpsNotifyResult = {
  channel: string
  ok: boolean
  skipped?: boolean
  error?: string
}
