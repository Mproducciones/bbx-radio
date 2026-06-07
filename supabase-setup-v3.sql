-- BBX v3 — métricas publicitarias + sorteos patrocinados
-- Ejecutar en Supabase SQL Editor

CREATE TABLE IF NOT EXISTS ad_events (
  id           BIGSERIAL PRIMARY KEY,
  radio_id     TEXT        NOT NULL,
  ad_id        TEXT        NOT NULL,
  ad_tipo      TEXT        NOT NULL,
  event_type   TEXT        NOT NULL CHECK (event_type IN ('impression', 'click')),
  placement    TEXT        NOT NULL,
  session_id   TEXT,
  recorded_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_ad_events_ad_month ON ad_events (ad_id, recorded_at DESC);
CREATE INDEX IF NOT EXISTS idx_ad_events_radio_month ON ad_events (radio_id, recorded_at DESC);

CREATE TABLE IF NOT EXISTS contests (
  id            UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  slug          TEXT        UNIQUE NOT NULL,
  title         TEXT        NOT NULL,
  prize         TEXT        NOT NULL,
  description   TEXT,
  sponsor_name  TEXT,
  sponsor_ad_id TEXT,
  banner_image_url TEXT,
  deadline      TEXT,
  active        BOOLEAN     DEFAULT false,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS app_notifications (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title      TEXT NOT NULL,
  body       TEXT NOT NULL,
  url        TEXT NOT NULL DEFAULT '/',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_app_notifications_created ON app_notifications (created_at DESC);

CREATE TABLE IF NOT EXISTS push_subscriptions (
  endpoint   TEXT PRIMARY KEY,
  p256dh     TEXT NOT NULL,
  auth       TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE ad_events DISABLE ROW LEVEL SECURITY;
ALTER TABLE contests DISABLE ROW LEVEL SECURITY;
ALTER TABLE app_notifications DISABLE ROW LEVEL SECURITY;
ALTER TABLE push_subscriptions DISABLE ROW LEVEL SECURITY;

-- Si ya ejecutaste v3 antes, agrega la columna del banner:
-- ALTER TABLE contests ADD COLUMN IF NOT EXISTS banner_image_url TEXT;

INSERT INTO contests (slug, title, prize, description, sponsor_name, deadline, active)
VALUES (
  'sorteo-bienvenida',
  'Sorteo en vivo - Radio Bienvenida',
  'Premio sorpresa de un patrocinador',
  'Registrate y el locutor anuncia al ganador en la programacion.',
  'Patrocinador Bienvenida',
  'Esta semana',
  true
) ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  prize = EXCLUDED.prize;
