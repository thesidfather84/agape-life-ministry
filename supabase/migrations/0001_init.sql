-- =============================================================
-- Agape Life Ministry — initial database schema
-- Run this in the Supabase SQL Editor (or via supabase db push).
-- =============================================================

-- Automatically keep updated_at current on every change.
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ----------------------------------------------------------------
-- church_settings — one row (id = 1) of public church information
-- ----------------------------------------------------------------
create table public.church_settings (
  id integer primary key,
  church_name text not null default 'Agape Life Ministry',
  pastor_name text not null default 'Founder / Pastor Arthur Warning',
  phone text,
  email text,
  address_line1 text not null default '5931 Bullard Avenue',
  address_line2 text default 'Suite 4',
  city text not null default 'New Orleans',
  state text not null default 'LA',
  zip text not null default '70128',
  service_time_text text not null default 'Every Sunday at 9:00 AM CST',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint church_settings_single_row check (id = 1)
);

create trigger church_settings_updated_at
  before update on public.church_settings
  for each row execute function public.set_updated_at();

-- ----------------------------------------------------------------
-- daily_words — pastor-written scripture + devotional posts
-- (scripture text is entered by the pastor, never generated;
--  structure leaves room for a verified Bible API integration later)
-- ----------------------------------------------------------------
create table public.daily_words (
  id uuid primary key default gen_random_uuid(),
  word_date date not null,
  scripture_reference text not null,
  scripture_text text not null,
  title text not null,
  message text not null,
  prayer text,
  status text not null default 'draft' check (status in ('draft', 'published')),
  -- Reserved for a future verified Bible API (e.g. translation + verse id).
  scripture_source text not null default 'pastor',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index daily_words_published_idx
  on public.daily_words (status, word_date desc);

create trigger daily_words_updated_at
  before update on public.daily_words
  for each row execute function public.set_updated_at();

-- ----------------------------------------------------------------
-- events
-- ----------------------------------------------------------------
create table public.events (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  event_date date not null,
  start_time time not null,
  end_time time,
  location text not null,
  description text not null,
  image_url text,
  status text not null default 'draft' check (status in ('draft', 'published')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index events_published_idx
  on public.events (status, event_date);

create trigger events_updated_at
  before update on public.events
  for each row execute function public.set_updated_at();

-- ----------------------------------------------------------------
-- announcements — temporary homepage banner
-- ----------------------------------------------------------------
create table public.announcements (
  id uuid primary key default gen_random_uuid(),
  message text not null default '',
  link_url text,
  link_label text,
  starts_on date,
  ends_on date,
  is_active boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger announcements_updated_at
  before update on public.announcements
  for each row execute function public.set_updated_at();

-- ----------------------------------------------------------------
-- prayer_requests — PRIVATE, never shown publicly
-- ----------------------------------------------------------------
create table public.prayer_requests (
  id uuid primary key default gen_random_uuid(),
  name text,
  contact text,
  request text not null,
  confidential boolean not null default false,
  is_read boolean not null default false,
  created_at timestamptz not null default now()
);

-- ----------------------------------------------------------------
-- contact_messages — PRIVATE
-- ----------------------------------------------------------------
create table public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  contact text not null,
  message text not null,
  is_read boolean not null default false,
  created_at timestamptz not null default now()
);

-- ----------------------------------------------------------------
-- sms_optins — PRIVATE; stored for a future SMS provider (e.g. Twilio)
-- ----------------------------------------------------------------
create table public.sms_optins (
  id uuid primary key default gen_random_uuid(),
  first_name text not null,
  phone text not null,
  consented boolean not null default false check (consented = true),
  created_at timestamptz not null default now()
);

-- ----------------------------------------------------------------
-- welcome_cards — PRIVATE; first-time visitor "I'm New" cards
-- ----------------------------------------------------------------
create table public.welcome_cards (
  id uuid primary key default gen_random_uuid(),
  first_name text not null,
  contact text,
  questions text,
  wants_contact boolean not null default false,
  is_read boolean not null default false,
  created_at timestamptz not null default now()
);

-- =============================================================
-- Row Level Security
--   * Only authenticated administrators may create, edit, delete.
--   * The public may read: published daily words, published events,
--     active announcements, and church settings.
--   * The public may submit (insert only): prayer requests, contact
--     messages, SMS opt-ins, and welcome cards — but never read them.
-- =============================================================

alter table public.church_settings  enable row level security;
alter table public.daily_words      enable row level security;
alter table public.events           enable row level security;
alter table public.announcements    enable row level security;
alter table public.prayer_requests  enable row level security;
alter table public.contact_messages enable row level security;
alter table public.sms_optins       enable row level security;
alter table public.welcome_cards    enable row level security;

-- church_settings
create policy "Public can read church settings"
  on public.church_settings for select
  to anon, authenticated
  using (true);

create policy "Admins manage church settings"
  on public.church_settings for all
  to authenticated
  using (true) with check (true);

-- daily_words
create policy "Public can read published daily words"
  on public.daily_words for select
  to anon
  using (status = 'published');

create policy "Admins manage daily words"
  on public.daily_words for all
  to authenticated
  using (true) with check (true);

-- events
create policy "Public can read published events"
  on public.events for select
  to anon
  using (status = 'published');

create policy "Admins manage events"
  on public.events for all
  to authenticated
  using (true) with check (true);

-- announcements
create policy "Public can read active announcements"
  on public.announcements for select
  to anon
  using (
    is_active = true
    and (starts_on is null or starts_on <= (now() at time zone 'America/Chicago')::date)
    and (ends_on is null or ends_on >= (now() at time zone 'America/Chicago')::date)
  );

create policy "Admins manage announcements"
  on public.announcements for all
  to authenticated
  using (true) with check (true);

-- prayer_requests (insert-only for the public; admins read/manage)
create policy "Anyone can submit a prayer request"
  on public.prayer_requests for insert
  to anon, authenticated
  with check (true);

create policy "Admins read prayer requests"
  on public.prayer_requests for select
  to authenticated
  using (true);

create policy "Admins update prayer requests"
  on public.prayer_requests for update
  to authenticated
  using (true) with check (true);

create policy "Admins delete prayer requests"
  on public.prayer_requests for delete
  to authenticated
  using (true);

-- contact_messages
create policy "Anyone can submit a contact message"
  on public.contact_messages for insert
  to anon, authenticated
  with check (true);

create policy "Admins read contact messages"
  on public.contact_messages for select
  to authenticated
  using (true);

create policy "Admins update contact messages"
  on public.contact_messages for update
  to authenticated
  using (true) with check (true);

create policy "Admins delete contact messages"
  on public.contact_messages for delete
  to authenticated
  using (true);

-- sms_optins
create policy "Anyone can opt in to texts"
  on public.sms_optins for insert
  to anon, authenticated
  with check (consented = true);

create policy "Admins read sms optins"
  on public.sms_optins for select
  to authenticated
  using (true);

create policy "Admins delete sms optins"
  on public.sms_optins for delete
  to authenticated
  using (true);

-- welcome_cards
create policy "Anyone can submit a welcome card"
  on public.welcome_cards for insert
  to anon, authenticated
  with check (true);

create policy "Admins read welcome cards"
  on public.welcome_cards for select
  to authenticated
  using (true);

create policy "Admins update welcome cards"
  on public.welcome_cards for update
  to authenticated
  using (true) with check (true);

create policy "Admins delete welcome cards"
  on public.welcome_cards for delete
  to authenticated
  using (true);
