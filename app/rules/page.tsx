import { getRules, getDiscordUrl } from '@/lib/queries';
import type { RuleSection } from '@/lib/queries';
import { Reveal } from '@/components/Reveal';
import { PageHero } from '@/components/PageHero';

export const metadata = { title: 'Rules — DEMONCORE MC' };

const FALLBACK: RuleSection[] = [
  {
    id: 'f1',
    title: 'General Conduct',
    body: 'Be respectful to all players and staff. Harassment, hate speech, and discrimination are not tolerated.',
    category: 'server',
    group_label: null,
    sort_order: 1,
  },
  {
    id: 'f2',
    title: 'Cheating',
    body: 'Any use of hacked clients, X-ray, or exploiting bugs results in an immediate, permanent ban.',
    category: 'server',
    group_label: null,
    sort_order: 2,
  },
  {
    id: 'f3',
    title: 'Be Respectful',
    body: 'Treat every member of the community with respect, in DMs and in the server.',
    category: 'discord',
    group_label: null,
    sort_order: 1,
  },
];

function groupRules(rules: RuleSection[]) {
  const groups: { label: string | null; items: RuleSection[] }[] = [];
  for (const rule of rules) {
    const last = groups[groups.length - 1];
    if (last && last.label === rule.group_label) {
      last.items.push(rule);
    } else {
      groups.push({ label: rule.group_label, items: [rule] });
    }
  }
  return groups;
}

function RuleList({ rules }: { rules: RuleSection[] }) {
  const groups = groupRules(rules);
  let counter = 0;
  return (
    <div className="space-y-10">
      {groups.map((group, gi) => (
        <div key={gi}>
          {group.label && (
            <h3 className="font-mono text-xs uppercase tracking-[0.25em] text-core-ember mb-5">{group.label}</h3>
          )}
          <div className="space-y-8">
            {group.items.map((rule) => {
              counter += 1;
              return (
                <Reveal key={rule.id} delay={counter * 0.04} className="border-l-2 border-core-ember pl-6">
                  <span className="font-mono text-xs text-ash">{String(counter).padStart(2, '0')}</span>
                  <h2 className="font-display text-xl text-parchment mt-1">{rule.title}</h2>
                  <p className="text-sm text-ash mt-2 leading-relaxed whitespace-pre-line">{rule.body}</p>
                </Reveal>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

export default async function RulesPage() {
  const [rules, discordUrl] = await Promise.all([getRules(), getDiscordUrl()]);
  const source = rules.length > 0 ? rules : FALLBACK;
  const serverRules = source.filter((r) => r.category === 'server').sort((a, b) => a.sort_order - b.sort_order);
  const discordRules = source.filter((r) => r.category === 'discord').sort((a, b) => a.sort_order - b.sort_order);

  return (
    <>
      <PageHero
        title="Rules"
        subtitle="Breaking these rules may result in a warning, mute, kick, or ban depending on severity."
      />
      <section className="mx-auto max-w-3xl px-6 pb-20 space-y-24">
        <div>
          <h2 className="font-display text-2xl md:text-3xl font-black uppercase text-parchment text-center">
            Server Rules
          </h2>
          <p className="text-ash text-center text-sm mt-2">Stay stable. Avoid the Meltdown.</p>
          <div className="mt-12">
            <RuleList rules={serverRules} />
          </div>
        </div>

        <div className="border-t border-white/10 pt-20">
          <h2 className="font-display text-2xl md:text-3xl font-black uppercase text-parchment text-center">
            Discord Rules
          </h2>
          <p className="text-ash text-center text-sm mt-2">
            Join the community —{' '}
            <a
              href={discordUrl}
              target="_blank"
              rel="noreferrer"
              className="cursor-target text-core-ember hover:text-core-glow"
            >
              {discordUrl.replace(/^https?:\/\//, '')}
            </a>
          </p>
          <div className="mt-12">
            <RuleList rules={discordRules} />
          </div>
        </div>
      </section>
    </>
  );
}
