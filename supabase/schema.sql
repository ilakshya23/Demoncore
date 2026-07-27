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

-- In-game console command the gamemode delivery plugin runs on payment,
-- e.g. "lp user {player} parent add vip" or "eco give {player} {amount}".
-- Blank = no auto-delivery for that item; staff fulfill it manually.
alter table ranks add column if not exists command_template text;
alter table crate_keys add column if not exists command_template text;

-- ─── Coin packages (admin editable, per server) ─────────────────────────
-- Fixed 8 slots per server (slot_number 1-8) so the admin panel always shows
-- 8 configurable rows instead of an open-ended add/delete list. 2 INR = 1 coin.
create table if not exists coin_packages (
  id uuid primary key default gen_random_uuid(),
  server text not null check (server in ('survival', 'lifesteal')),
  slot_number int not null check (slot_number between 1 and 8),
  coins int not null default 0,
  price numeric not null default 0,
  command_template text,   -- e.g. "eco give {player} {coins}" — blank = manual delivery
  created_at timestamptz not null default now(),
  unique (server, slot_number)
);

alter table coin_packages add column if not exists command_template text;

alter table coin_packages enable row level security;
drop policy if exists "public read" on coin_packages;
create policy "public read" on coin_packages for select using (true);

insert into coin_packages (server, slot_number, coins, price)
select 'survival', n, coins, coins * 2
from (values (1,50), (2,100), (3,250), (4,500), (5,1000), (6,2000), (7,3500), (8,5000)) as v(n, coins)
on conflict (server, slot_number) do nothing;

-- ─── Server + social links ──────────────────────────────────────────────
-- Fixed set of known links (Java/Bedrock IP, Discord invite) — the admin
-- panel edits these in place rather than adding/removing arbitrary rows.
create table if not exists site_links (
  id uuid primary key default gen_random_uuid(),
  group_name text not null check (group_name in ('server', 'social')),
  label text not null,
  url text not null,
  sort_order int not null default 0
);

create unique index if not exists site_links_group_label_idx on site_links (group_name, label);

insert into site_links (group_name, label, url, sort_order)
values
  ('server', 'Java Edition', 'play.demoncoremc.fun:25577', 1),
  ('server', 'Bedrock Edition', 'play.demoncoremc.fun:19176', 2),
  ('social', 'Discord', 'https://discord.gg/P6agT4xbAm', 1)
on conflict (group_name, label) do nothing;

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

-- ─── Shop purchase requests (paid via Razorpay checkout) ────────────────
create table if not exists purchase_requests (
  id uuid primary key default gen_random_uuid(),
  item_type text not null check (item_type in ('rank', 'crate_key', 'coin_package')),
  item_name text not null,
  server text,
  quantity int not null default 1,
  amount numeric not null,
  minecraft_username text not null,
  email text not null,
  created_at timestamptz not null default now(),
  status text not null default 'new' check (status in ('new', 'contacted', 'completed', 'cancelled'))
);

-- Idempotent widen for pre-existing databases created before 'coin_package' existed.
alter table purchase_requests drop constraint if exists purchase_requests_item_type_check;
alter table purchase_requests add constraint purchase_requests_item_type_check
  check (item_type in ('rank', 'crate_key', 'coin_package'));

-- Checkout now collects Discord username instead of email, and tracks the
-- Razorpay order/payment so a webhook or support request can look it up.
alter table purchase_requests add column if not exists discord_username text;
alter table purchase_requests alter column email drop not null;
alter table purchase_requests add column if not exists razorpay_order_id text;
alter table purchase_requests add column if not exists razorpay_payment_id text;

alter table purchase_requests drop constraint if exists purchase_requests_status_check;
alter table purchase_requests add constraint purchase_requests_status_check
  check (status in ('new', 'paid', 'contacted', 'completed', 'cancelled'));

-- Checkout also collects a real name + phone number now.
alter table purchase_requests add column if not exists buyer_name text;
alter table purchase_requests add column if not exists phone_number text;

-- Set once the gamemode delivery plugin has successfully run this order's
-- command_template in-game — lets the plugin poll "status = paid AND
-- delivered_at is null" without redelivering something twice.
alter table purchase_requests add column if not exists delivered_at timestamptz;

-- Per-staff socials: 3 fixed platforms, always shown on the card even when
-- empty — so plain nullable columns instead of an open-ended list.
alter table staff_members drop column if exists social_links;
alter table staff_members add column if not exists instagram_url text;
alter table staff_members add column if not exists youtube_url text;
alter table staff_members add column if not exists discord_url text;

-- ─── Media Rank (content creators) ──────────────────────────────────────
create table if not exists media_creators (
  id uuid primary key default gen_random_uuid(),
  creator_name text not null,        -- channel/stream handle, e.g. "MARTIAN IS LIVE"
  real_name text,
  bio text,
  avatar_url text,
  instagram_url text,
  youtube_url text,
  discord_url text,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

alter table media_creators drop column if exists social_links;
alter table media_creators add column if not exists instagram_url text;
alter table media_creators add column if not exists youtube_url text;
alter table media_creators add column if not exists discord_url text;

alter table media_creators enable row level security;
drop policy if exists "public read" on media_creators;
create policy "public read" on media_creators for select using (true);

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
-- `create policy` has no `if not exists` — dropping first makes re-running
-- this whole file safe, instead of erroring out partway on a second run
-- (which silently skipped every statement after it, including new tables).
drop policy if exists "public read" on server_stats;
create policy "public read" on server_stats for select using (true);
drop policy if exists "public read" on leaderboards;
create policy "public read" on leaderboards for select using (true);
drop policy if exists "public read" on ranks;
create policy "public read" on ranks for select using (true);
drop policy if exists "public read" on crate_keys;
create policy "public read" on crate_keys for select using (true);
drop policy if exists "public read" on site_links;
create policy "public read" on site_links for select using (true);
drop policy if exists "public read" on staff_members;
create policy "public read" on staff_members for select using (true);
drop policy if exists "public read" on rules;
create policy "public read" on rules for select using (true);
drop policy if exists "public read" on current_event;
create policy "public read" on current_event for select using (true);

-- No public policies on contact_submissions / staff_applications / purchase_requests:
-- only the service role (server-side route handlers) can read or write these.
