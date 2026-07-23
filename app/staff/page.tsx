import { getStaff, getRanks } from '@/lib/queries';
import { Reveal } from '@/components/Reveal';
import { ApplyStaffForm } from '@/components/ApplyStaffForm';
import { PageHero } from '@/components/PageHero';
import { MinecraftText } from '@/components/MinecraftText';
import { SkinImage } from '@/components/SkinImage';
import { SkinRenderer } from '@/components/SkinRenderer';

export const metadata = { title: 'Staff — DEMONCORE MC' };

const STEVE_SKIN = 'https://mc-heads.net/body/MHF_Steve/200';
const STEVE_SKIN_TEXTURE = 'https://mc-heads.net/skin/MHF_Steve';

const FALLBACK = [
  {
    id: 'f1',
    name: 'Owner',
    role: 'Owner',
    bio: 'Founded DEMONCORE MC and oversees all servers.',
    minecraft_username: null,
    skin_url: null,
    sort_order: 1,
  },
];

export default async function StaffPage() {
  const [staff, ranks] = await Promise.all([getStaff(), getRanks('survival')]);
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
          {list.map((member, i) => {
            const skinSrc = member.minecraft_username
              ? `https://mc-heads.net/body/${encodeURIComponent(member.minecraft_username)}/200`
              : STEVE_SKIN;

            return (
              <Reveal key={member.id} delay={i * 0.06} className="border border-white/10 p-6 text-center">
                <div className="mx-auto h-40 flex items-end justify-center">
                  {member.skin_url ? (
                    <SkinRenderer skinUrl={member.skin_url} fallbackTextureUrl={STEVE_SKIN_TEXTURE} />
                  ) : (
                    <SkinImage src={skinSrc} alt={member.name} fallback={STEVE_SKIN} />
                  )}
                </div>
                <h3 className="font-display text-parchment mt-4">{member.name}</h3>
                <MinecraftText
                  code={roleColors[member.role.toLowerCase()]}
                  fallback={member.role}
                  className="text-xs uppercase tracking-wide text-core-ember mt-1 inline-block"
                />
                {member.bio && <p className="text-sm text-ash mt-3 leading-relaxed">{member.bio}</p>}
              </Reveal>
            );
          })}
        </div>

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
