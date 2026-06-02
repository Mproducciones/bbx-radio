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
  deadline      TEXT,
  active        BOOLEAN     DEFAULT false,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE ad_events DISABLE ROW LEVEL SECURITY;
ALTER TABLE contests DISABLE ROW LEVEL SECURITY;

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
