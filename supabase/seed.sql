-- =============================================================
-- Agape Life Ministry — seed content
-- Run AFTER 0001_init.sql. Safe to run once on a fresh database.
--
-- Scripture below is quoted from the project brief
-- (1 Corinthians 16:14), not generated. The sample devotional is
-- clearly labeled for the pastor to replace.
-- =============================================================

-- The single row of church information shown across the website.
insert into public.church_settings
  (id, church_name, pastor_name, phone, email,
   address_line1, address_line2, city, state, zip, service_time_text)
values
  (1, 'Agape Life Ministry', 'Founder / Pastor Arthur Warning',
   null,  -- phone: placeholder, set in Admin > Edit Church Information
   null,  -- email: placeholder, set in Admin > Edit Church Information
   '5931 Bullard Avenue', 'Suite 4', 'New Orleans', 'LA', '70128',
   'Every Sunday at 9:00 AM CST')
on conflict (id) do nothing;

-- A sample Daily Word so the homepage is never empty.
insert into public.daily_words
  (word_date, scripture_reference, scripture_text, title, message, prayer, status)
values
  (current_date,
   '1 Corinthians 16:14',
   'Let all that you do be done in love.',
   'Welcome to the Daily Word',
   'This is a sample post showing how the Daily Word will look. Sign in to the admin area, tap "Post Today''s Scripture," and share a verse and a short message with the congregation. (Sample content — replace it with your own.)',
   null,
   'published');

-- The standing Sunday Worship service for the next four Sundays.
insert into public.events
  (title, event_date, start_time, end_time, location, description, status)
select
  'Sunday Worship Service',
  next_sunday + weeks.n * 7,
  '09:00'::time,
  null,
  '5931 Bullard Avenue, Suite 4, New Orleans, LA 70128',
  'Join us for worship, prayer, and Biblical teaching. Everyone is welcome — come as you are.',
  'published'
from
  (select current_date + ((7 - extract(dow from current_date)::int) % 7) as next_sunday) s,
  (select generate_series(0, 3) as n) weeks;

-- An example (inactive) announcement the pastor can edit and turn on.
insert into public.announcements (message, is_active)
values ('Welcome! Edit this announcement in the admin area and turn it on when you need it.', false);
