-- Enable UUID extension
create extension if not exists "pgcrypto";

-- CLIENTS
create table public.clients (
  id              uuid primary key default gen_random_uuid(),
  name            text not null,
  email           text,
  phone           text,
  notes           text,
  referral_source text,
  last_event_date date,
  created_at      timestamptz not null default now()
);
alter table public.clients enable row level security;
create policy "Authenticated users can manage clients"
  on public.clients for all
  to authenticated using (true) with check (true);

-- EVENTS
create table public.events (
  id             uuid primary key default gen_random_uuid(),
  client_id      uuid references public.clients(id) on delete set null,
  event_name     text not null,
  event_type     text,
  event_date     date not null,
  start_time     time,
  end_time       time,
  venue          text,
  venue_address  text,
  guest_count    integer not null default 0,
  status         text not null default 'inquiry'
                   check (status in ('inquiry','quoted','confirmed','completed','cancelled')),
  notes          text,
  total_quoted   numeric(10,2) not null default 0,
  deposit_amount numeric(10,2) not null default 0,
  deposit_paid   boolean not null default false,
  balance_due    numeric(10,2) not null default 0,
  balance_paid   boolean not null default false,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);
alter table public.events enable row level security;
create policy "Authenticated users can manage events"
  on public.events for all
  to authenticated using (true) with check (true);

-- Auto-update updated_at
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger events_updated_at
  before update on public.events
  for each row execute function public.set_updated_at();

-- MENU ITEMS
create table public.menu_items (
  id             uuid primary key default gen_random_uuid(),
  name           text not null,
  category       text,
  description    text,
  cost_per_head  numeric(8,2) not null default 0,
  price_per_head numeric(8,2) not null default 0,
  dietary_tags   text[] not null default '{}',
  active         boolean not null default true
);
alter table public.menu_items enable row level security;
create policy "Authenticated users can manage menu_items"
  on public.menu_items for all
  to authenticated using (true) with check (true);

-- STAFF
create table public.staff (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  phone       text,
  email       text,
  role        text,
  hourly_rate numeric(8,2),
  notes       text,
  active      boolean not null default true
);
alter table public.staff enable row level security;
create policy "Authenticated users can manage staff"
  on public.staff for all
  to authenticated using (true) with check (true);

-- EVENT_STAFF (join table)
create table public.event_staff (
  id               uuid primary key default gen_random_uuid(),
  event_id         uuid not null references public.events(id) on delete cascade,
  staff_id         uuid not null references public.staff(id) on delete cascade,
  role             text,
  call_time        time,
  hours_scheduled  numeric(5,2),
  assignment_notes text,
  confirmed        boolean not null default false,
  unique (event_id, staff_id)
);
alter table public.event_staff enable row level security;
create policy "Authenticated users can manage event_staff"
  on public.event_staff for all
  to authenticated using (true) with check (true);

-- QUOTES (one per event, upserted)
create table public.quotes (
  id          uuid primary key default gen_random_uuid(),
  event_id    uuid not null unique references public.events(id) on delete cascade,
  line_items  jsonb not null default '[]',
  subtotal    numeric(10,2) not null default 0,
  tax_rate    numeric(5,4) not null default 0.08,
  tax_amount  numeric(10,2) not null default 0,
  total       numeric(10,2) not null default 0,
  notes       text,
  sent_at     timestamptz,
  viewed_at   timestamptz,
  accepted_at timestamptz
);
alter table public.quotes enable row level security;
create policy "Authenticated users can manage quotes"
  on public.quotes for all
  to authenticated using (true) with check (true);

-- PAYMENTS
create table public.payments (
  id       uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.events(id) on delete cascade,
  type     text not null check (type in ('deposit','balance','partial')),
  amount   numeric(10,2) not null,
  method   text,
  notes    text,
  paid_at  timestamptz not null default now()
);
alter table public.payments enable row level security;
create policy "Authenticated users can manage payments"
  on public.payments for all
  to authenticated using (true) with check (true);
