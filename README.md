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

**Admin area (`/admin`)** — plain language, large buttons
- Post Today's Scripture (with live preview, draft/publish)
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
   variables**), add the three values from `.env.example`:
   - `NEXT_PUBLIC_SITE_URL` = `https://agapelifeministry.org`
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
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

## Handing the site to the pastor

Give the pastor two things:

1. The website address, plus `/admin` for the dashboard
   (there is also an "Admin Login" link in the website footer).
2. Their email and password from step 1.4.

Everything in the dashboard is written in plain language: *Post Today's
Scripture*, *Add an Event*, *Edit Church Information*, *View Prayer
Requests*, *View Contact Messages*, *Manage Homepage Announcement*.

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
