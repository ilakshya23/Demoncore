import { ModeHero } from '@/components/gamemode/ModeHero';
import { LeaderboardTabs } from '@/components/gamemode/LeaderboardTabs';
import { Reveal } from '@/components/Reveal';

const ACCENT = '#8A98A6';

export const metadata = { title: 'PvP — DEMONCORE MC' };

export default function PvpPage() {
  return (
    <>
      <ModeHero
        title="PvP"
        tagline="Engage in intense combat battles. Fight for supremacy in arena-style gameplay with epic rewards and bragging rights."
        accent={ACCENT}
        serverKey="pvp"
      />

      <section className="mx-auto max-w-3xl px-6 py-20">
        <Reveal><h2 className="font-display text-2xl md:text-3xl text-parchment mb-8">Leaderboards</h2></Reveal>
        <LeaderboardTabs gamemode="pvp" accent={ACCENT} />
      </section>
    </>
  );
}
