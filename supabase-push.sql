-- Push Web — suscripciones de oyentes (admin radio → /admin → Comunicación)
-- Ejecutar en Supabase SQL Editor (proyecto de la radio)

CREATE TABLE IF NOT EXISTS push_subscriptions (
  endpoint   TEXT PRIMARY KEY,
  p256dh     TEXT NOT NULL,
  auth       TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_push_subscriptions_created ON push_subscriptions (created_at DESC);

ALTER TABLE push_subscriptions DISABLE ROW LEVEL SECURITY;
