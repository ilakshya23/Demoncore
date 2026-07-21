import { supabasePublic } from './supabase';

export type Rank = {
  id: string;
  gamemode: 'survival' | 'lifesteal';
  name: string;
  price_label: string | null;
  sort_order: number;
  perks: string[];
  color_hex: string;
};

export type CrateKey = {
  id: string;
  gamemode: 'survival' | 'lifesteal';
  name: string;
  price_label: string | null;
  sort_order: number;
  contents: string[];
};

export type StaffMember = {
  id: string;
  name: string;
  role: string;
  bio: string | null;
  avatar_url: string | null;
  sort_order: number;
};

export type RuleSection = {
  id: string;
  section_title: string;
  body: string;
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

export type SeasonWinner = {
  id: string;
  season_label: string;
  gamemode: string | null;
  category: string;
  player_name: string;
  sort_order: number;
};

// Fallback content so pages render sensibly before the admin panel (Phase 3)
// has been used to populate real data.
const FALLBACK_RANKS: Record<string, Rank[]> = {
  survival: [
    { id: 'f1', gamemode: 'survival', name: 'Adventurer', price_label: '₹99', sort_order: 1, perks: ['/kit adventurer', '2 homes', 'Colored chat'], color_hex: '#4C9A6A' },
    { id: 'f2', gamemode: 'survival', name: 'Champion', price_label: '₹249', sort_order: 2, perks: ['/kit champion', '5 homes', '/fly in own claim'], color_hex: '#4C9A6A' },
  ],
  lifesteal: [
    { id: 'f3', gamemode: 'lifesteal', name: 'Reaper', price_label: '₹149', sort_order: 1, perks: ['+2 max hearts on join', '/kit reaper'], color_hex: '#C81E3A' },
  ],
};

const FALLBACK_CRATES: Record<string, CrateKey[]> = {
  survival: [
    { id: 'c1', gamemode: 'survival', name: 'Common Key', price_label: '₹49', sort_order: 1, contents: ['Rare tools', 'Cosmetic dyes'] },
  ],
  lifesteal: [
    { id: 'c2', gamemode: 'lifesteal', name: 'Blood Key', price_label: '₹99', sort_order: 1, contents: ['Extra heart token', 'Combat gear'] },
  ],
};

export async function getRanks(gamemode: 'survival' | 'lifesteal'): Promise<Rank[]> {
  const { data, error } = await supabasePublic
    .from('ranks')
    .select('*')
    .eq('gamemode', gamemode)
    .order('sort_order', { ascending: true });
  if (error || !data || data.length === 0) return FALLBACK_RANKS[gamemode] ?? [];
  return data as Rank[];
}

export async function getCrateKeys(gamemode: 'survival' | 'lifesteal'): Promise<CrateKey[]> {
  const { data, error } = await supabasePublic
    .from('crate_keys')
    .select('*')
    .eq('gamemode', gamemode)
    .order('sort_order', { ascending: true });
  if (error || !data || data.length === 0) return FALLBACK_CRATES[gamemode] ?? [];
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

export async function getSeasonWinners(): Promise<SeasonWinner[]> {
  const { data } = await supabasePublic.from('season_winners').select('*').order('sort_order', { ascending: true });
  return (data as SeasonWinner[]) ?? [];
}
