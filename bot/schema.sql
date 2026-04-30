create table if not exists conversations (
  sender_id  text        primary key,
  messages   jsonb       not null default '[]'::jsonb,
  updated_at timestamptz not null default now()
);

create index if not exists conversations_updated_at_idx
  on conversations (updated_at desc);
