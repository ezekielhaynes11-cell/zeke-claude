-- Anointed Traffic Engine: complete schema

CREATE TABLE IF NOT EXISTS brand_config (
  id SERIAL PRIMARY KEY,
  brief TEXT NOT NULL DEFAULT '',
  home_care_system_prompt TEXT NOT NULL DEFAULT '',
  trucking_system_prompt TEXT NOT NULL DEFAULT '',
  stan_homecare_url TEXT NOT NULL DEFAULT '',
  stan_trucking_url TEXT NOT NULL DEFAULT '',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS tracks (
  id SERIAL PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  offer_url TEXT NOT NULL DEFAULT '',
  active BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS weekly_plans (
  id SERIAL PRIMARY KEY,
  track_id INTEGER NOT NULL REFERENCES tracks(id),
  week_start DATE NOT NULL,
  angles JSONB NOT NULL DEFAULT '[]',
  posting_plan JSONB NOT NULL DEFAULT '{}',
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'active')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_weekly_plans_track_week ON weekly_plans(track_id, week_start DESC);

CREATE TABLE IF NOT EXISTS script_batches (
  id SERIAL PRIMARY KEY,
  track_id INTEGER NOT NULL REFERENCES tracks(id),
  weekly_plan_id INTEGER REFERENCES weekly_plans(id),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  approved_by TEXT,
  approved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_script_batches_status ON script_batches(status);
CREATE INDEX IF NOT EXISTS idx_script_batches_track ON script_batches(track_id);

CREATE TABLE IF NOT EXISTS scripts (
  id SERIAL PRIMARY KEY,
  batch_id INTEGER NOT NULL REFERENCES script_batches(id),
  track_id INTEGER NOT NULL REFERENCES tracks(id),
  hook TEXT NOT NULL DEFAULT '',
  angle TEXT NOT NULL DEFAULT '',
  body TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_scripts_batch ON scripts(batch_id);

CREATE TABLE IF NOT EXISTS clips (
  id SERIAL PRIMARY KEY,
  script_id INTEGER REFERENCES scripts(id),
  track_id INTEGER NOT NULL REFERENCES tracks(id),
  blob_url TEXT NOT NULL,
  captioned_blob_url TEXT,
  status TEXT NOT NULL DEFAULT 'uploaded' CHECK (
    status IN ('uploaded','captioning','captioned','safety_checking','approved','blocked','publishing','published','failed')
  ),
  caption_job_id TEXT,
  safety_result JSONB,
  error_msg TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_clips_status ON clips(status);
CREATE INDEX IF NOT EXISTS idx_clips_track ON clips(track_id);

CREATE TABLE IF NOT EXISTS social_accounts (
  id SERIAL PRIMARY KEY,
  platform TEXT NOT NULL CHECK (platform IN ('tiktok', 'instagram', 'youtube')),
  profile_id TEXT NOT NULL UNIQUE,
  profile_name TEXT NOT NULL,
  daily_cap INTEGER NOT NULL DEFAULT 3,
  status TEXT NOT NULL DEFAULT 'connected' CHECK (status IN ('connected', 'disconnected')),
  last_disconnect_reason TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS posts (
  id SERIAL PRIMARY KEY,
  clip_id INTEGER NOT NULL REFERENCES clips(id),
  account_id INTEGER NOT NULL REFERENCES social_accounts(id),
  track_id INTEGER NOT NULL REFERENCES tracks(id),
  provider_post_id TEXT,
  utm_link TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'published', 'failed')),
  published_at TIMESTAMPTZ,
  error_msg TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_posts_clip ON posts(clip_id);
CREATE INDEX IF NOT EXISTS idx_posts_account ON posts(account_id);
CREATE INDEX IF NOT EXISTS idx_posts_status ON posts(status);
CREATE INDEX IF NOT EXISTS idx_posts_published_at ON posts(published_at DESC);

CREATE TABLE IF NOT EXISTS dead_letter (
  id SERIAL PRIMARY KEY,
  job_type TEXT NOT NULL,
  payload JSONB NOT NULL DEFAULT '{}',
  error_msg TEXT NOT NULL DEFAULT '',
  attempts INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  resolved_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_dead_letter_resolved ON dead_letter(resolved_at) WHERE resolved_at IS NULL;

CREATE TABLE IF NOT EXISTS ga4_sessions (
  id SERIAL PRIMARY KEY,
  date DATE NOT NULL,
  sessions INTEGER NOT NULL DEFAULT 0,
  source TEXT NOT NULL DEFAULT '',
  medium TEXT NOT NULL DEFAULT '',
  campaign TEXT NOT NULL DEFAULT '',
  utm_track TEXT,
  utm_clip TEXT,
  utm_account TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_ga4_uniq ON ga4_sessions(date, source, medium, campaign, COALESCE(utm_track,''), COALESCE(utm_clip,''), COALESCE(utm_account,''));
CREATE INDEX IF NOT EXISTS idx_ga4_date ON ga4_sessions(date DESC);
CREATE INDEX IF NOT EXISTS idx_ga4_utm_track ON ga4_sessions(utm_track);

CREATE TABLE IF NOT EXISTS stan_orders (
  id SERIAL PRIMARY KEY,
  order_id TEXT NOT NULL UNIQUE,
  product_id TEXT NOT NULL,
  track_id INTEGER REFERENCES tracks(id),
  amount_cents INTEGER NOT NULL DEFAULT 0,
  utm_track TEXT,
  utm_clip TEXT,
  utm_account TEXT,
  raw JSONB NOT NULL DEFAULT '{}',
  received_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_stan_orders_utm_track ON stan_orders(utm_track);
CREATE INDEX IF NOT EXISTS idx_stan_orders_received_at ON stan_orders(received_at DESC);

-- Seed: two tracks
INSERT INTO tracks (slug, name, offer_url) VALUES
  ('home_care', 'Home Care Credentialing', COALESCE(NULLIF(current_setting('app.stan_homecare_url', true), ''), '')),
  ('trucking', 'Trucking Business Setup', COALESCE(NULLIF(current_setting('app.stan_trucking_url', true), ''), ''))
ON CONFLICT (slug) DO NOTHING;

-- Seed: brand config row
INSERT INTO brand_config (id, brief) VALUES (1, '') ON CONFLICT (id) DO NOTHING;
