import { supabasePublic } from './supabase';

export type Rank = {
  id: string;
  server: 'survival' | 'lifesteal';
  name: string;
  price: number | null;
  checkout_url: string | null;
  sort_order: number;
  perks: string[];
  color_code: string | null;
};

export type CrateKey = {
  id: string;
  server: 'survival' | 'lifesteal';
  name: string;
  price: number | null;
  checkout_url: string | null;
  image: string | null;
  sort_order: number;
  contents: string | null;
};

export type StaffMember = {
  id: string;
  name: string;
  role: string;
  bio: string | null;
  minecraft_username: string | null;
  skin_url: string | null;
  sort_order: number;
};

export type RuleSection = {
  id: string;
  title: string;
  body: string;
  category: 'server' | 'discord';
  group_label: string | null;
  sort_order: number;
};

export type CurrentEvent = {
  id: string;
  title: string;
  description: string;
  banner_url: string | null;
  starts_at: string | null;
  ends_at: string | null;
  rules: string[];
  rewards: string[];
};

export type SiteLink = {
  id: string;
  group_name: 'server' | 'social';
  label: string;
  url: string;
  sort_order: number;
};

// Fallback content so pages render sensibly before the admin panel (Phase 3)
// has been used to populate real data.
const FALLBACK_RANKS: Record<string, Rank[]> = {
  survival: [
    { id: 'f1', server: 'survival', name: 'Adventurer', price: 99, checkout_url: null, sort_order: 1, perks: ['/kit adventurer', '2 homes', 'Colored chat'], color_code: null },
    { id: 'f2', server: 'survival', name: 'Champion', price: 249, checkout_url: null, sort_order: 2, perks: ['/kit champion', '5 homes', '/fly in own claim'], color_code: null },
  ],
  lifesteal: [
    { id: 'f3', server: 'lifesteal', name: 'Reaper', price: 149, checkout_url: null, sort_order: 1, perks: ['+2 max hearts on join', '/kit reaper'], color_code: null },
  ],
};

const FALLBACK_CRATES: Record<string, CrateKey[]> = {
  survival: [
    { id: 'c1', server: 'survival', name: 'Common Key', price: 49, checkout_url: null, image: null, sort_order: 1, contents: 'Rare tools, cosmetic dyes' },
  ],
  lifesteal: [
    { id: 'c2', server: 'lifesteal', name: 'Blood Key', price: 99, checkout_url: null, image: null, sort_order: 1, contents: 'Extra heart token, combat gear' },
  ],
};

export async function getRanks(server: 'survival' | 'lifesteal'): Promise<Rank[]> {
  const { data, error } = await supabasePublic
    .from('ranks')
    .select('*')
    .eq('server', server)
    .order('sort_order', { ascending: true });
  if (error || !data || data.length === 0) return FALLBACK_RANKS[server] ?? [];
  return data as Rank[];
}

export async function getCrateKeys(server: 'survival' | 'lifesteal'): Promise<CrateKey[]> {
  const { data, error } = await supabasePublic
    .from('crate_keys')
    .select('*')
    .eq('server', server)
    .order('sort_order', { ascending: true });
  if (error || !data || data.length === 0) return FALLBACK_CRATES[server] ?? [];
  return data as CrateKey[];
}

export async function getStaff(): Promise<StaffMember[]> {
  const { data } = await supabasePublic.from('staff_members').select('*').order('sort_order', { ascending: true });
  return (data as StaffMember[]) ?? [];
}

export async function getRules(): Promise<RuleSection[]> {
  const { data } = await supabasePublic.from('rules').select('*').order('sort_order', { ascending: true });
  return (data as RuleSection[]) ?? [];
}

export async function getCurrentEvent(): Promise<CurrentEvent> {
  const { data } = await supabasePublic.from('current_event').select('*').eq('id', 'active').single();
  return (
    (data as CurrentEvent) ?? {
      id: 'active',
      title: 'Parkour Event',
      description:
        'Race through a brand-new parkour course for exclusive rewards. Full details are being finalized — check back soon.',
      banner_url: null,
      starts_at: null,
      ends_at: null,
      rules: [],
      rewards: [],
    }
  );
}

export async function getSiteLinks(group: 'server' | 'social'): Promise<SiteLink[]> {
  const { data } = await supabasePublic
    .from('site_links')
    .select('*')
    .eq('group_name', group)
    .order('sort_order', { ascending: true });
  return (data as SiteLink[]) ?? [];
}

const FALLBACK_DISCORD_URL = 'https://discord.gg/P6agT4xbAm';

export async function getDiscordUrl(): Promise<string> {
  const links = await getSiteLinks('social');
  return links.find((l) => l.label.toLowerCase().includes('discord'))?.url || FALLBACK_DISCORD_URL;
}

