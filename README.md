# Agape Life Ministry — Church Website

A calm, faith-centered website for **Agape Life Ministry** in New Orleans,
Louisiana, led by **Founder / Pastor Arthur Warning**. Sunday worship is
**every Sunday at 9:00 AM CST** at 5931 Bullard Avenue, Suite 4,
New Orleans, LA 70128.

Built with Next.js (App Router) + TypeScript + Tailwind CSS + Supabase,
designed for deployment on Netlify at **https://agapelifeministry.org**.

## What the website includes

**Public site**
- Home page with hero, welcome section, "What Is Agape Love?", the featured
  Daily Word, the next three upcoming events, plan-your-visit with a
  lazy-loaded map, "A Moment of Peace" (a silent 60-second pause),
  prayer request form, and scripture-by-text signup
- About, Events (upcoming + past), Daily Word archive, Visit Us (with an
  "I'm New" welcome card), Contact, and Privacy pages
- Homepage announcement banner the pastor can turn on and off
- Installable as a lightweight app (Add to Home Screen), SEO metadata,
  sitemap, robots.txt, and Church/PlaceOfWorship structured data

**Sermons**
- Public `/sermons` page: featured newest sermon plus a responsive
  archive grid with pagination, and a "Latest Sermon" homepage section
- Pastor workflow (under one minute): post the sermon as a public
  Facebook Reel → open the admin → paste the Reel link → Publish
- Accepts facebook.com/reel/…, facebook.com/share/r/…,
  facebook.com/watch/…, and fb.watch/… links; non-Facebook URLs are
  rejected. Links that Facebook can't embed automatically show a clean
  "Watch on Facebook" card instead of a broken player. Videos never
  autoplay and only load when tapped.
- Note: this uses a safe manual paste workflow. Automatic syncing from
  a personal Facebook profile is not possible and is not attempted.

**Pastor email notifications (Resend)**
- After a contact message, prayer request, "I'm New" card, or text
  signup saves to Supabase, the pastor receives a branded email at the
  address in `PASTOR_NOTIFICATION_EMAIL` with an "Open Pastor
  Dashboard" button
- Confidential prayer requests never include the request text or
  personal details in the email — only a prompt to sign in
- Contact emails set Reply-To to the visitor's email so the pastor can
  reply straight from Gmail
- Email delivery failures never block a submission: the record is
  already saved and the visitor still sees the success message
- Sending is server-side only; forms are also protected by a honeypot
  and per-IP rate limiting (admin login attempts are rate limited too)

**Admin area (`/admin`)** — plain language, large buttons
- Post Today's Scripture (with live preview, draft/publish)
- Add New Sermon (paste a Facebook Reel link; preview, draft/publish,
  feature, edit, delete with confirmation)
- Add / edit / delete events (with a confirmation step)
- Edit church information (phone and email start as clearly marked placeholders)
- View prayer requests (private, confidential flag supported)
- View contact messages, first-time visitor cards, and text signups
- Manage the homepage announcement
- Log out

**Content safety rules built in**
- Scripture is always entered by the pastor and shown word-for-word;
  nothing is generated or rewritten. The `daily_words` table includes a
  `scripture_source` column reserved for a future verified Bible API.
- Prayer requests, contact messages, visitor cards, and SMS opt-ins are
  never public — Row Level Security allows the public to *submit* them
  but only signed-in administrators to read them.
- Text-message signups are stored only; sending requires connecting an
  SMS provider such as Twilio later.

---

## 1. Set up Supabase (one time, ~10 minutes)

1. Create a free project at [supabase.com](https://supabase.com).
2. In the Supabase dashboard, open **SQL Editor** and run the contents of
   [`supabase/migrations/0001_init.sql`](supabase/migrations/0001_init.sql)
   — this creates every table and all Row Level Security policies.
   Then run
   [`supabase/migrations/0002_sermons_and_email.sql`](supabase/migrations/0002_sermons_and_email.sql)
   — this adds the sermons table (with its own RLS) and the optional
   contact-message subject line. Then run
   [`supabase/migrations/0003_pastor_uploads.sql`](supabase/migrations/0003_pastor_uploads.sql)
   — this enables phone video uploads (sermons storage bucket with
   public-read / admin-write policies, and the `video_url` column).
3. Then run [`supabase/seed.sql`](supabase/seed.sql) — this adds the church
   information, a sample Daily Word, and the standing Sunday Worship
   services so the site is never empty.
4. Create the pastor's login: **Authentication → Users → Add user →
   Create new user**. Enter the pastor's email and a strong password, and
   check **Auto confirm user**. Anyone created here can sign in at
   `/admin`, so only create accounts for trusted administrators.
5. Recommended: in **Authentication → Sign In / Up**, disable new user
   sign-ups so accounts can only be created from the dashboard.
6. In **Settings → API**, copy the **Project URL** and the **anon public**
   key for the next step.

## 2. Run it locally

```bash
cp .env.example .env.local   # then paste in your Supabase URL and anon key
npm install
npm run dev
```

Open http://localhost:3000. The admin area is at http://localhost:3000/admin.

Without Supabase credentials the public site still runs using built-in
sample content, and the admin area stays locked — so nothing crashes
before setup is finished.

## 3. Deploy to Netlify

1. Push this folder to a GitHub repository named `agape-life-ministry`
   (exact commands are in the section below).
2. In [Netlify](https://app.netlify.com), **Add new site → Import an
   existing project → GitHub** and pick the repository. The included
   `netlify.toml` already sets the build command (`npm run build`) and
   the official Next.js runtime plugin — accept the detected settings.
3. Before the first deploy (or under **Site configuration → Environment
   variables**), add the values from `.env.example`:
   - `NEXT_PUBLIC_SITE_URL` = `https://agapelifeministry.org`
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY` (Supabase → Settings → API; used only
     server-side by the contact endpoint)
   - `PASTOR_LOGIN_EMAIL` = the Supabase Auth email behind the simple
     Pastor Login (default `pastor@agapelifeministry.org`)
   - `RESEND_API_KEY` (see the email setup section below)
   - `PASTOR_NOTIFICATION_EMAIL` = `arthurwarning49@gmail.com`
   - `EMAIL_FROM_ADDRESS` = `website@agapelifeministry.org`
     (only after the domain is verified in Resend — leave it out until
     then and the site uses Resend's testing sender)
4. Deploy the site.
5. Connect the domain: **Domain management → Add a domain →**
   `agapelifeministry.org`, then follow Netlify's DNS instructions at
   your registrar (Netlify DNS or a CNAME/A record). Netlify provisions
   HTTPS automatically. If the preferred .org is unavailable, buy an
   alternative and simply change `NEXT_PUBLIC_SITE_URL` — every
   canonical URL, sitemap entry, and structured-data reference follows
   it.

### Push to GitHub

```bash
git add -A
git commit -m "Agape Life Ministry website"
git remote add origin https://github.com/YOUR-USERNAME/agape-life-ministry.git
git branch -M main
git push -u origin main
```

## 4. Set up pastor email notifications (Resend)

The website emails `arthurwarning49@gmail.com` whenever someone sends a
contact message, prayer request, "I'm New" card, or text signup. Exact
steps:

1. Create a free account at [resend.com](https://resend.com).
2. In Resend, open **Domains → Add Domain** and enter
   `agapelifeministry.org`. The from address
   `website@agapelifeministry.org` only works after this domain is
   verified.
3. Resend shows DNS records to add (typically an MX and a TXT record on
   the `send` subdomain for SPF, plus a `resend._domainkey` TXT record
   for DKIM, and optionally a DMARC TXT record). Add each one in your
   active **Netlify DNS zone**: Netlify → **Domains →
   agapelifeministry.org → DNS records → Add new record**, copying the
   type, name, and value exactly as Resend displays them. Click
   **Verify** in Resend once added (DNS can take up to an hour).
4. In Resend, open **API Keys → Create API Key** (sending access is
   enough) and copy the key — it is shown only once.
5. In Netlify, add environment variable `RESEND_API_KEY` with that key.
6. Add `PASTOR_NOTIFICATION_EMAIL` = `arthurwarning49@gmail.com`.
7. Add `EMAIL_FROM_ADDRESS` = `website@agapelifeministry.org`.
   **Until step 3's verification is complete**, leave this variable out:
   the site automatically falls back to Resend's approved testing
   sender (`onboarding@resend.dev`) so development and early testing
   still deliver. (Resend's testing sender can only deliver to the
   email address that owns the Resend account.)
8. Redeploy the site (Netlify → **Deploys → Trigger deploy**) so the new
   variables take effect.
9. Test each form on the live site: Contact, Prayer Request (both with
   and without the confidential box), the "I'm New" card on Visit Us,
   and the text signup. Each should show its success message and
   deliver an email.
10. Confirm the confidential prayer request email contains **no request
    text and no personal details** — only a notice and a dashboard
    link. The full request is visible only after signing in at
    `/admin/prayer-requests`.

Notes:
- The Resend key is used only in server-side code and is never sent to
  the browser.
- If email ever fails (bad key, provider outage), submissions still
  save to Supabase and visitors still see the success message; the
  failure is logged without exposing secrets or request content.

## Handing the site to the pastor

Give the pastor two things:

1. The website address, plus `/admin` for the dashboard
   (there is also an "Admin Login" link in the website footer).
2. Their email and password from step 1.4.

Everything in the dashboard is written in plain language: *Post Today's
Scripture*, *Add New Sermon*, *Add an Event*, *Edit Church Information*,
*View Prayer Requests*, *View Contact Messages*, *Manage Homepage
Announcement*.

**The simple Pastor page (`/pastor`):** the pastor signs in at
`/pastor-login` with the username `pastor` and their password ("Pastor
Login" link in the website menu). The username maps server-side to the
Supabase Auth account in `PASTOR_LOGIN_EMAIL`; the password is stored
hashed by Supabase and never appears in the code. Create that account
in Supabase → Authentication → Add user, and set the password there.

On the Pastor page they can, in one column with large buttons:
- Post a sermon from a Facebook Reel link, **or upload a video straight
  from their phone's camera roll** (MP4/MOV/WebM, with a progress bar,
  a retry on failure, and an optional picture). Videos are stored in
  Supabase Storage, never in the database.
- Flip each sermon's big 🟢 ON / 🔴 OFF toggle to show or hide it
  publicly (nothing is deleted), and choose the one Featured sermon
  that leads the homepage and Sermons page.

Note: Supabase's default per-file upload limit is 50 MB. For longer
videos, raise it under Supabase → Storage → Settings, or post to
Facebook and paste the link instead.

**Posting from Facebook (under a minute):** post the sermon as a public
Reel → open `/pastor` → paste the Reel link (Share → Copy Link) →
*Publish Sermon*. Older sermons stay on the Sermons page automatically.

Placeholders that still need real values are clearly marked inside
**Edit Church Information** (church phone number and email).

## Project structure

```
app/(public)/        Public pages (home, about, events, daily-word, visit, contact, privacy)
app/admin/           Login + protected dashboard pages
app/actions/         Server actions (public forms, admin content, auth)
components/          Site, home, events, daily-word, forms, and admin components
lib/                 Site constants, Supabase clients, queries, helpers
supabase/            SQL migration (schema + RLS) and seed content
public/icons/        App icons for Add to Home Screen
```

## Maintenance notes

- Public pages revalidate every 5 minutes; admin saves refresh the site
  immediately.
- The map is click-to-load so the homepage stays fast on cellular
  connections.
- To enable automated scripture texts later, connect an SMS provider
  (e.g. Twilio) to the `sms_optins` table; consent and timestamps are
  already stored.
- To add a verified Bible API later, populate `scripture_source` in
  `daily_words` — the pastor-entered flow keeps working unchanged.
