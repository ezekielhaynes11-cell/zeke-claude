-- Noah outreach CRM (optional — Noah runs without it, just won't persist).
-- Run this in your Supabase project's SQL editor.

create extension if not exists pgcrypto;

create table if not exists prospects (
  id         uuid primary key default gen_random_uuid(),
  name       text,
  email      text unique,
  company    text,
  title      text,
  linkedin   text,
  industry   text,
  segment    text,
  notes      text,
  -- new | researched | drafted | contacted | replied | booked | closed
  status     text        not null default 'new',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists outreach_log (
  id          uuid primary key default gen_random_uuid(),
  prospect_id uuid references prospects(id) on delete cascade,
  channel     text,
  touch       int,
  subject     text,
  body        text,
  -- drafted | sent | replied
  status      text        not null default 'drafted',
  -- full Noah output (the JSON sequence) for auditability
  payload     text,
  sent_at     timestamptz,
  created_at  timestamptz not null default now()
);

create index if not exists prospects_status_idx on prospects (status);
create index if not exists outreach_log_prospect_idx on outreach_log (prospect_id, created_at desc);
