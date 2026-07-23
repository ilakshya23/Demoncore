# DEMONCORE MC — Website

Next.js 14 (App Router) + TypeScript + Tailwind + Lenis + Framer Motion + GSAP.

## What's built

**Foundation** — project scaffold, design tokens, fonts (Unbounded / Inter / JetBrains
Mono), site-wide preloader (gates reveal until the whole app has loaded, once per
session), Lenis smooth scroll synced to GSAP ScrollTrigger, Framer Motion page
transitions on every route, the `crack-divider` signature motif used instead of
icons/numbered badges, skeleton loader primitives, and `useCachedFetch` (stale-
while-revalidate: reads localStorage instantly, revalidates in the background).

**Pages** — Home, Survival, PvP, Lifesteal, Events (shows whatever event is currently
active — Parkour by default), Rules, Staff, Contact, Apply for Staff. Survival and
Lifesteal show ranks + crate keys + leaderboards; PvP shows leaderboards only, per
your brief. Every gamemode page shows a live players-online badge for that server.

**Admin panel** (`/admin`) — Supabase-Auth-gated (middleware + a Server Component
check), with editable screens for: Ranks, Crate Keys, Staff, Rules, Server & Social
Links, Current Event, plus read-only viewers with status actions for
Contact Submissions and Staff Applications. All writes go through one generic,
whitelisted API route (`/api/admin/[table]`) reused by every screen, with optimistic
UI (edits save in the background; adding/deleting a row updates instantly and rolls
back only if the request actually fails).

**Contact + applications** — forms POST to `/api/contact` and `/api/apply-staff`,
which save to Supabase and best-effort email you via Resend (the submission is
still saved even if the email fails).

**Live stats pipeline** — Velocity plugin → `/api/plugin/network` → Supabase →
`/api/stats` → homepage + per-gamemode badges. See `demoncore-plugins.zip`.

**Gamemode leaderboards** — one Paper plugin (`gamemode-stats-bridge`), deployed on
all three gamemode servers with a different `gamemode:` value in each server's
config.yml, reporting baltop (via EssentialsX), top kills/deaths/playtime (via
vanilla Bukkit statistics) to `/api/plugin/leaderboard` every 5 minutes by default.
I built one configurable plugin rather than three near-identical copies — same
functionality, one codebase to maintain. Say the word if you'd rather have three
fully separate plugin projects instead.

## Not yet built

- Payment integration for ranks/crate keys (you asked to point purchases at the
  Minecraft server for now, which every "Purchase" button already does)
- Real content in the admin tables — everything currently falls back to
  placeholder copy until you fill it in through `/admin`

## Creating your first admin account

There's no public sign-up (intentional). In the Supabase dashboard: Authentication →
Users → Add User, set an email + password, and use that to log in at `/admin/login`.

## Known limitation worth knowing about

The gamemode plugin computes leaderboards by iterating every account that has ever
joined that server (`Bukkit.getOfflinePlayers()`). Fine for hundreds/low thousands
of accounts; if a server's player base gets very large, that loop should be swapped
for either a cached/paginated pass or event-driven counters (increment on kill/death
rather than recomputing from scratch). Flagged in the code comments too.

## Local setup

```bash
npm install
cp .env.example .env.local   # fill in Supabase + Resend + plugin key
npm run dev
```

Then in Supabase: SQL Editor → paste `supabase/schema.sql` → Run.

## Deploying

- Push this repo to GitHub.
- Import into Vercel, add the same env vars from `.env.local` in
  Project Settings → Environment Variables.
- Point your Supabase project's allowed origins at the Vercel domain.

## How the live player count works

```
Minecraft backends (survival/pvp/lifesteal/events)
        │  players connect
        ▼
   Velocity proxy  ──(network-bridge plugin, every 10s)──►  POST /api/plugin/network
        │                                                          │ x-plugin-key auth
        │                                                          ▼
        │                                            Supabase `server_stats` table
        │                                                          │
        ▼                                                          ▼
  players see accurate counts  ◄──  GET /api/stats  ◄──  homepage/gamemode pages
```

The per-gamemode player lists you asked for (players online *per page*) will use
the same `per_server` JSON column already in the schema — Phase 2 will add a
small component per gamemode page that reads it and lists players by server.

## Why Supabase service-role key never reaches the browser

`lib/supabase.ts` exports two clients: `supabasePublic` (anon key, RLS-scoped,
safe in client components) and `supabaseAdmin()` (service role, only importable
inside `app/api/**/route.ts` files, which run server-side only). The admin panel
in Phase 3 will use Supabase Auth sessions + RLS policies keyed to an `is_admin`
claim, rather than trusting the service role from the browser.
