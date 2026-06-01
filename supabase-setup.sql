-- BBX Radio System — Tablas persistentes
-- Ejecutar en Supabase: SQL Editor → New query → pegar esto → Run

-- ── Registros de oyentes (leads para sorteos) ─────────────────────────────
CREATE TABLE IF NOT EXISTS listener_registrations (
  id          UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  name        TEXT        NOT NULL,
  phone       TEXT        NOT NULL,
  contest     TEXT        NOT NULL DEFAULT 'general',
  ip          TEXT,
  registered_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── Solicitudes de canciones ───────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS song_requests (
  id           TEXT        PRIMARY KEY,
  song         TEXT        NOT NULL,
  artist       TEXT        NOT NULL,
  dedication   TEXT,
  status       TEXT        NOT NULL DEFAULT 'pending',
  submitted_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── Votos de encuestas ─────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS poll_votes (
  id         UUID    DEFAULT gen_random_uuid() PRIMARY KEY,
  poll_id    TEXT    NOT NULL,
  session_id TEXT    NOT NULL,
  option_id  TEXT    NOT NULL,
  voted_at   TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (poll_id, session_id)
);

-- ── Encuestas activas ──────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS polls (
  id           TEXT        PRIMARY KEY,
  question     TEXT        NOT NULL,
  option_a_title  TEXT    NOT NULL,
  option_a_artist TEXT    NOT NULL,
  option_b_title  TEXT    NOT NULL,
  option_b_artist TEXT    NOT NULL,
  active       BOOLEAN     DEFAULT true,
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

-- ── RLS desactivado (seguridad manejada en API routes de Next.js) ──────────
ALTER TABLE listener_registrations DISABLE ROW LEVEL SECURITY;
ALTER TABLE song_requests          DISABLE ROW LEVEL SECURITY;
ALTER TABLE poll_votes             DISABLE ROW LEVEL SECURITY;
ALTER TABLE polls                  DISABLE ROW LEVEL SECURITY;
