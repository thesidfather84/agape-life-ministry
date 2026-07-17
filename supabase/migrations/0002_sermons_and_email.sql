-- =============================================================
-- Agape Life Ministry — sermons + contact subject
-- Run this in the Supabase SQL Editor after 0001_init.sql.
-- =============================================================

-- Optional subject line on contact messages (shown in admin + email).
alter table public.contact_messages
  add column if not exists subject text;

-- ----------------------------------------------------------------
-- sermons — Facebook Reel links the pastor publishes manually
-- ----------------------------------------------------------------
create table public.sermons (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  speaker_name text not null default 'Founder / Pastor Arthur Warning',
  sermon_date date not null,
  scripture_reference text,
  description text,
  facebook_url text not null,
  embed_url text,
  thumbnail_url text,
  is_featured boolean not null default false,
  published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index sermons_published_idx
  on public.sermons (published, sermon_date desc);

create trigger sermons_updated_at
  before update on public.sermons
  for each row execute function public.set_updated_at();

alter table public.sermons enable row level security;

-- Public users may read only published sermons.
create policy "Public can read published sermons"
  on public.sermons for select
  to anon
  using (published = true);

-- Only authenticated administrators manage sermons.
create policy "Admins manage sermons"
  on public.sermons for all
  to authenticated
  using (true) with check (true);
