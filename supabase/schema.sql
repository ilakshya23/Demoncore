-- DEMONCORE MC — Supabase schema
-- Run this in the Supabase SQL editor once per project.
-- Pattern: every content table is public-readable (anon key) so the site
-- can render without auth, but only writable via the service-role key,
-- which only ever lives in Vercel server env vars / the admin API routes
-- (Phase 3) and the plugins (Phase 4). Never exposed to the browser.

-- ─── Live network stats (written by the Velocity plugin) ───────────────
create table if not exists server_stats (
  id text primary key default 'global',
  players_online int not null default 0,
  per_server jsonb not null default '{}',   -- { "survival": 40, "pvp": 12, "lifesteal": 8 }
  uptime_label text not null default '24/7',
  version text not null default '1.21.11',
  discord_online int not null default 0,
  discord_total int not null default 0,
  updated_at timestamptz not null default now()
);

-- ─── Per-gamemode leaderboards (written by each gamemode plugin) ───────
create table if not exists leaderboards (
  id uuid primary key default gen_random_uuid(),
  gamemode text not null check (gamemode in ('survival', 'pvp', 'lifesteal')),
  category text not null check (category in ('baltop', 'top_kills', 'top_deaths', 'top_playtime')),
  rank int not null,
  player_name text not null,
  player_uuid text,
  value numeric not null,           -- balance, kill count, death count, or playtime minutes
  updated_at timestamptz not null default now(),
  unique (gamemode, category, rank)
);

-- ─── Ranks & perks (admin editable, per server) ─────────────────────────
-- NOTE: the live project predates this file and used `server` (not
-- `gamemode`) plus `checkout_url` (not `price_label`) from the start —
-- this definition was corrected to match what's actually deployed.
create table if not exists ranks (
  id uuid primary key default gen_random_uuid(),
  server text not null check (server in ('survival', 'lifesteal')),
  name text not null,
  price numeric,                    -- amount in the shop's display currency; null = not purchasable
  checkout_url text,                -- external checkout link, if any (unused while there's no gateway)
  sort_order int not null default 0,
  perks text[] not null default '{}',
  color_code text,                  -- Minecraft &#RRGGBB / MiniMessage gradient code for the rank name
  created_at timestamptz not null default now()
);

-- ─── Crate keys (admin editable, per server) ────────────────────────────
create table if not exists crate_keys (
  id uuid primary key default gen_random_uuid(),
  server text not null check (server in ('survival', 'lifesteal')),
  name text not null,
  price numeric,                    -- price per single key
  checkout_url text,
  image text,                       -- filename under /public/crates, e.g. "Common.png"
  sort_order int not null default 0,
  contents text,
  created_at timestamptz not null default now()
);

-- Idempotent for pre-existing databases created before these columns existed.
alter table ranks add column if not exists color_code text;
alter table crate_keys add column if not exists image text;
alter table crate_keys add column if not exists sort_order int not null default 0;

-- ─── Server + social links ──────────────────────────────────────────────
create table if not exists site_links (
  id uuid primary key default gen_random_uuid(),
  group_name text not null check (group_name in ('server', 'social')),
  label text not null,
  url text not null,
  sort_order int not null default 0
);

-- ─── Staff directory ─────────────────────────────────────────────────────
create table if not exists staff_members (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  role text not null,               -- "Owner", "Admin", "Moderator", ...
  bio text,
  avatar_url text,
  sort_order int not null default 0
);

-- ─── Rules (editable rich text, ordered sections) ───────────────────────
create table if not exists rules (
  id uuid primary key default gen_random_uuid(),
  section_title text not null,
  body text not null,
  sort_order int not null default 0
);

-- ─── Current event (Events server — swapped out whenever the event changes) ─
create table if not exists current_event (
  id text primary key default 'active',
  title text not null default 'Parkour Event',
  description text not null default '',
  banner_url text,
  starts_at timestamptz,
  ends_at timestamptz,
  rules text[] not null default '{}',
  rewards text[] not null default '{}',
  updated_at timestamptz not null default now()
);

-- Idempotent for pre-existing databases created before rules/rewards existed.
alter table current_event add column if not exists rules text[] not null default '{}';
alter table current_event add column if not exists rewards text[] not null default '{}';

-- ─── Contact form + staff applications ──────────────────────────────────
create table if not exists contact_submissions (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  subject text,
  message text not null,
  created_at timestamptz not null default now(),
  status text not null default 'new' check (status in ('new', 'read', 'archived'))
);

create table if not exists staff_applications (
  id uuid primary key default gen_random_uuid(),
  in_game_name text not null,
  discord_tag text not null,
  age int,
  position text not null,           -- role applied for
  experience text not null,
  why_you text not null,
  created_at timestamptz not null default now(),
  status text not null default 'new' check (status in ('new', 'reviewed', 'accepted', 'rejected'))
);

-- ─── Shop purchase requests (no payment gateway yet — manual fulfillment) ──
create table if not exists purchase_requests (
  id uuid primary key default gen_random_uuid(),
  item_type text not null check (item_type in ('rank', 'crate_key')),
  item_name text not null,
  server text,
  quantity int not null default 1,
  amount numeric not null,
  minecraft_username text not null,
  email text not null,
  created_at timestamptz not null default now(),
  status text not null default 'new' check (status in ('new', 'contacted', 'completed', 'cancelled'))
);

-- ─── Row Level Security ─────────────────────────────────────────────────
alter table server_stats enable row level security;
alter table leaderboards enable row level security;
alter table ranks enable row level security;
alter table crate_keys enable row level security;
alter table site_links enable row level security;
alter table staff_members enable row level security;
alter table rules enable row level security;
alter table current_event enable row level security;
alter table contact_submissions enable row level security;
alter table staff_applications enable row level security;
alter table purchase_requests enable row level security;

-- Public read access on display content only (not on submissions).
create policy "public read" on server_stats for select using (true);
create policy "public read" on leaderboards for select using (true);
create policy "public read" on ranks for select using (true);
create policy "public read" on crate_keys for select using (true);
create policy "public read" on site_links for select using (true);
create policy "public read" on staff_members for select using (true);
create policy "public read" on rules for select using (true);
create policy "public read" on current_event for select using (true);

-- No public policies on contact_submissions / staff_applications / purchase_requests:
-- only the service role (server-side route handlers) can read or write these.
