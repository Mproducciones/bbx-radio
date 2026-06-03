-- Suscripción BBX por tenant (una fila por radio / deploy)
-- Ejecutar en Supabase SQL Editor

CREATE TABLE IF NOT EXISTS tenant_subscriptions (
  tenant_id              TEXT PRIMARY KEY,
  status                 TEXT NOT NULL DEFAULT 'active'
    CHECK (status IN ('active', 'grace', 'suspended', 'trial', 'cancelled')),
  plan                   TEXT NOT NULL DEFAULT 'pro',
  current_period_start   TIMESTAMPTZ,
  current_period_end     TIMESTAMPTZ,
  trial_ends_at          TIMESTAMPTZ,
  grace_days             INT NOT NULL DEFAULT 7,
  stripe_customer_id     TEXT,
  stripe_subscription_id TEXT,
  last_payment_at        TIMESTAMPTZ,
  amount_clp             INT,
  billing_email          TEXT,
  notes                  TEXT,
  updated_at             TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at             TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_tenant_subscriptions_status ON tenant_subscriptions (status);
CREATE INDEX IF NOT EXISTS idx_tenant_subscriptions_period_end ON tenant_subscriptions (current_period_end);

-- Seed ejemplo (ajustar tenant_id al RADIO.id del deploy)
-- INSERT INTO tenant_subscriptions (tenant_id, status, plan, current_period_end, billing_email)
-- VALUES ('bienvenida-933', 'active', 'pro', now() + interval '30 days', 'admin@radiobienvenida.cl')
-- ON CONFLICT (tenant_id) DO NOTHING;
