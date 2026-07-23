import { ModeHero } from '@/components/gamemode/ModeHero';
import { RanksGrid, CrateKeysGrid } from '@/components/gamemode/RanksAndCrates';
import { LeaderboardTabs } from '@/components/gamemode/LeaderboardTabs';
import { getRanks, getCrateKeys } from '@/lib/queries';
import { Reveal } from '@/components/Reveal';

const ACCENT = '#C81E3A';

export const metadata = { title: 'Lifesteal — DEMONCORE MC' };

export default async function LifestealPage() {
  const [ranks, keys] = await Promise.all([getRanks('lifesteal'), getCrateKeys('lifesteal')]);

  return (
    <>
      <ModeHero
        title="Lifesteal"
        tagline="The ultimate hardcore challenge. Every kill heals you, every death costs your experience. Rise or fall on the blood-soaked battlefields."
        accent={ACCENT}
        serverKey="lifesteal"
      />

      <section className="mx-auto max-w-6xl px-6 py-20">
        <Reveal><h2 className="font-display text-2xl md:text-3xl text-parchment mb-8">Ranks</h2></Reveal>
        <RanksGrid ranks={ranks} server="lifesteal" />
      </section>

      <section className="mx-auto max-w-6xl px-6 py-20 border-t border-white/10">
        <Reveal><h2 className="font-display text-2xl md:text-3xl text-parchment mb-8">Crate Keys</h2></Reveal>
        <CrateKeysGrid keys={keys} server="lifesteal" />
      </section>

      <section className="mx-auto max-w-3xl px-6 py-20 border-t border-white/10">
        <Reveal><h2 className="font-display text-2xl md:text-3xl text-parchment mb-8">Leaderboards</h2></Reveal>
        <LeaderboardTabs gamemode="lifesteal" accent={ACCENT} />
      </section>
    </>
  );
}
