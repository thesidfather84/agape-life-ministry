-- =============================================================
-- Agape Life Ministry — phone video uploads for sermons
-- Run in the Supabase SQL Editor after 0002_sermons_and_email.sql.
-- =============================================================

-- A sermon can now be an uploaded video instead of a Facebook Reel.
alter table public.sermons
  alter column facebook_url drop not null;

alter table public.sermons
  add column if not exists video_url text;

-- ----------------------------------------------------------------
-- Storage bucket for sermon videos and thumbnails.
-- Public read (the congregation watches them); only signed-in
-- administrators can upload, replace, or remove files.
-- ----------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('sermons', 'sermons', true)
on conflict (id) do nothing;

create policy "Public can view sermon media"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'sermons');

create policy "Admins can upload sermon media"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'sermons');

create policy "Admins can update sermon media"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'sermons')
  with check (bucket_id = 'sermons');

create policy "Admins can delete sermon media"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'sermons');
