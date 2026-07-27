import { getStaff, getRanks, getMediaCreators } from '@/lib/queries';
import { Reveal } from '@/components/Reveal';
import { ApplyStaffForm } from '@/components/ApplyStaffForm';
import { PageHero } from '@/components/PageHero';
import { MinecraftText } from '@/components/MinecraftText';
import { CreatorCard } from '@/components/CreatorCard';

export const metadata = { title: 'Staff — DEMONCORE MC' };

const FALLBACK = [
  {
    id: 'f1',
    name: 'Owner',
    role: 'Owner',
    bio: 'Founded DEMONCORE MC and oversees all servers.',
    avatar_url: null,
    sort_order: 1,
    instagram_url: null as string | null,
    youtube_url: null as string | null,
    discord_url: null as string | null,
  },
];

export default async function StaffPage() {
  const [staff, ranks, mediaCreators] = await Promise.all([getStaff(), getRanks('survival'), getMediaCreators()]);
  const roleColors = Object.fromEntries(ranks.map((r) => [r.name.toLowerCase(), r.color_code]));
  // Order by the same rank ladder used everywhere else (Owner > Admin > Developer
  // > Mod > Helper > ...) instead of a hand-maintained sort_order, so it's
  // always right regardless of what order staff get added in the admin panel.
  const rankTier = Object.fromEntries(ranks.map((r) => [r.name.toLowerCase(), r.sort_order]));
  const list = [...(staff.length > 0 ? staff : FALLBACK)].sort(
    (a, b) => (rankTier[b.role.toLowerCase()] ?? -1) - (rankTier[a.role.toLowerCase()] ?? -1)
  );

  return (
    <>
      <PageHero title="Our Staff" subtitle="The team keeping DEMONCORE MC running, fair, and fun." />
      <section className="mx-auto max-w-5xl px-6 pb-20">
        <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {list.map((member, i) => (
            <CreatorCard
              key={member.id}
              rank={i + 1}
              delay={i * 0.06}
              photoUrl={member.avatar_url}
              name={member.name}
              subtitle={
                <MinecraftText
                  code={roleColors[member.role.toLowerCase()]}
                  fallback={member.role}
                  className="text-xs uppercase tracking-wide text-core-ember mt-1 inline-block"
                />
              }
              bio={member.bio}
              instagramUrl={member.instagram_url}
              youtubeUrl={member.youtube_url}
              discordUrl={member.discord_url}
            />
          ))}
        </div>

        {mediaCreators.length > 0 && (
          <div className="mt-24">
            <Reveal>
              <h2 className="font-display text-3xl md:text-4xl font-black uppercase text-parchment text-center">
                <MinecraftText
                  code="&#CE28FF&lM&#BA28FF&lE&#A727FF&lD&#9327FF&lI&#7F26FF&lA"
                  fallback="Media"
                  className="tracking-widest"
                />{' '}
                Rank
              </h2>
              <p className="text-ash text-center mt-3">Content creators repping DEMONCORE MC.</p>
            </Reveal>
            <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {mediaCreators.map((creator, i) => (
                <CreatorCard
                  key={creator.id}
                  rank={i + 1}
                  delay={i * 0.06}
                  photoUrl={creator.avatar_url}
                  name={creator.creator_name}
                  subtitle={
                    creator.real_name && (
                      <p className="text-xs uppercase tracking-wide text-ash mt-1">{creator.real_name}</p>
                    )
                  }
                  bio={creator.bio}
                  instagramUrl={creator.instagram_url}
                  youtubeUrl={creator.youtube_url}
                  discordUrl={creator.discord_url}
                />
              ))}
            </div>
          </div>
        )}

        <div className="mt-24 mx-auto max-w-2xl">
          <Reveal>
            <h2 className="font-display text-3xl md:text-4xl font-black uppercase text-parchment text-center">
              Apply for Staff/Media
            </h2>
            <p className="text-ash text-center mt-3">
              We're always looking for dedicated players to help run DEMONCORE MC. Tell us about
              yourself below.
            </p>
          </Reveal>
          <Reveal delay={0.12} className="mt-12">
            <ApplyStaffForm />
          </Reveal>
        </div>
      </section>
    </>
  );
}
