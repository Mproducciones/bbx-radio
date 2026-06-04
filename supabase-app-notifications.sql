-- Avisos de la radio visibles en la app (campanita) — admin envía desde /admin → Comunicación
-- Ejecutar en Supabase SQL Editor

CREATE TABLE IF NOT EXISTS app_notifications (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title      TEXT NOT NULL,
  body       TEXT NOT NULL,
  url        TEXT NOT NULL DEFAULT '/',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_app_notifications_created ON app_notifications (created_at DESC);

ALTER TABLE app_notifications DISABLE ROW LEVEL SECURITY;
