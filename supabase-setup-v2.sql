-- BBX Radio System v2 — Tablas estratégicas para escalar el negocio
-- SQL Editor → New query → pegar → Run

-- ── Serie temporal de oyentes ──────────────────────────────────────────────
-- Guarda el conteo cada ~30 min → genera el gráfico que cierra ventas
CREATE TABLE IF NOT EXISTS listener_counts (
  id          BIGSERIAL   PRIMARY KEY,
  radio_id    TEXT        NOT NULL DEFAULT 'bienvenida-933',
  count       INTEGER     NOT NULL,
  recorded_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índice para consultas rápidas de las últimas 24/48h
CREATE INDEX IF NOT EXISTS listener_counts_time_idx
  ON listener_counts (radio_id, recorded_at DESC);

-- ── Resultados de polls cerrados ───────────────────────────────────────────
-- Historial de votaciones → "tu audiencia prefiere reggaeton 73%"
CREATE TABLE IF NOT EXISTS poll_results (
  id              TEXT        PRIMARY KEY,
  radio_id        TEXT        NOT NULL DEFAULT 'bienvenida-933',
  question        TEXT        NOT NULL,
  option_a_title  TEXT,
  option_a_artist TEXT,
  option_a_votes  INTEGER     DEFAULT 0,
  option_b_title  TEXT,
  option_b_artist TEXT,
  option_b_votes  INTEGER     DEFAULT 0,
  total_votes     INTEGER     DEFAULT 0,
  closed_at       TIMESTAMPTZ DEFAULT NOW()
);

-- ── Configuración de radios (base multi-tenant) ────────────────────────────
-- Cada radio es una fila → desplegar una radio nueva = agregar una fila
CREATE TABLE IF NOT EXISTS radios (
  id            TEXT        PRIMARY KEY,
  name          TEXT        NOT NULL,
  slogan        TEXT,
  frequency     TEXT,
  city          TEXT,
  country       TEXT        DEFAULT 'CL',
  stream_url    TEXT,
  zeno_slug     TEXT,
  logo_url      TEXT,
  primary_color TEXT        DEFAULT '#db8918',
  plan          TEXT        DEFAULT 'pro',
  active        BOOLEAN     DEFAULT true,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- Insertar Radio Bienvenida como primera radio
INSERT INTO radios (id, name, slogan, frequency, city, stream_url, zeno_slug, primary_color, plan)
VALUES (
  'bienvenida-933',
  'Radio Bienvenida',
  'Tu radio · 93.3 FM',
  '93.3 FM',
  'Rancagua',
  'https://sonicstream-puntual.grupozgh.cl/8180/bienenida',
  'radio-bienvenida-fm',
  '#db8918',
  'pro'
) ON CONFLICT (id) DO NOTHING;

-- Desactivar RLS (seguridad manejada en API routes Next.js)
ALTER TABLE listener_counts  DISABLE ROW LEVEL SECURITY;
ALTER TABLE poll_results      DISABLE ROW LEVEL SECURITY;
ALTER TABLE radios            DISABLE ROW LEVEL SECURITY;
