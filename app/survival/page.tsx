import { ModeHero } from '@/components/gamemode/ModeHero';
import { RanksGrid, CrateKeysGrid } from '@/components/gamemode/RanksAndCrates';
import { LeaderboardTabs } from '@/components/gamemode/LeaderboardTabs';
import { getRanks, getCrateKeys } from '@/lib/queries';
import { Reveal } from '@/components/Reveal';

const ACCENT = '#4C9A6A';

export const metadata = { title: 'Survival — DEMONCORE MC' };

export default async function SurvivalPage() {
  const [ranks, keys] = await Promise.all([getRanks('survival'), getCrateKeys('survival')]);

  return (
    <>
      <ModeHero
        title="Survival"
        tagline="Build your empire, explore vast landscapes, and survive with other players. Farm resources, craft items, and establish your dominance in the peaceful realm."
        accent={ACCENT}
        serverKey="survival"
      />

      <section className="mx-auto max-w-6xl px-6 py-20">
        <Reveal><h2 className="font-display text-2xl md:text-3xl text-parchment mb-8">Ranks</h2></Reveal>
        <RanksGrid ranks={ranks} accent={ACCENT} />
      </section>

      <section className="mx-auto max-w-6xl px-6 py-20 border-t border-white/10">
        <Reveal><h2 className="font-display text-2xl md:text-3xl text-parchment mb-8">Crate Keys</h2></Reveal>
        <CrateKeysGrid keys={keys} accent={ACCENT} />
      </section>

      <section className="mx-auto max-w-3xl px-6 py-20 border-t border-white/10">
        <Reveal><h2 className="font-display text-2xl md:text-3xl text-parchment mb-8">Leaderboards</h2></Reveal>
        <LeaderboardTabs gamemode="survival" accent={ACCENT} />
      </section>
    </>
  );
}
