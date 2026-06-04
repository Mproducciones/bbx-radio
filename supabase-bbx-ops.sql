-- Centro de operaciones BBX — alertas y seguimiento
-- Ejecutar en Supabase SQL Editor (mismo proyecto que tenant_subscriptions)

CREATE TABLE IF NOT EXISTS bbx_ops_alerts (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id        TEXT,
  severity         TEXT NOT NULL CHECK (severity IN ('critical', 'warning', 'info')),
  category         TEXT NOT NULL,
  title            TEXT NOT NULL,
  message          TEXT NOT NULL,
  action_url       TEXT,
  dedupe_key       TEXT NOT NULL UNIQUE,
  acknowledged_at  TIMESTAMPTZ,
  last_notified_at TIMESTAMPTZ,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_bbx_ops_alerts_open
  ON bbx_ops_alerts (severity, updated_at DESC)
  WHERE acknowledged_at IS NULL;

CREATE INDEX IF NOT EXISTS idx_bbx_ops_alerts_tenant
  ON bbx_ops_alerts (tenant_id);

ALTER TABLE bbx_ops_alerts DISABLE ROW LEVEL SECURITY;
