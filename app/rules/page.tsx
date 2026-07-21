import { getRules } from '@/lib/queries';
import { Reveal } from '@/components/Reveal';

export const metadata = { title: 'Rules — DEMONCORE MC' };

const FALLBACK = [
  { id: 'f1', section_title: 'General Conduct', body: 'Be respectful to all players and staff. Harassment, hate speech, and discrimination are not tolerated.', sort_order: 1 },
  { id: 'f2', section_title: 'Building & Griefing', body: 'Griefing, stealing, and unauthorized claiming of other players\' builds is strictly forbidden across all gamemodes.', sort_order: 2 },
  { id: 'f3', section_title: 'Cheating', body: 'Any use of hacked clients, X-ray, or exploiting bugs results in an immediate, permanent ban.', sort_order: 3 },
];

export default async function RulesPage() {
  const rules = await getRules();
  const sections = rules.length > 0 ? rules : FALLBACK;

  return (
    <section className="mx-auto max-w-3xl px-6 py-20">
      <h1 className="font-display text-4xl md:text-5xl font-black uppercase text-parchment text-center">
        Rules
      </h1>
      <p className="text-ash text-center mt-3">
        Breaking these rules may result in a warning, mute, kick, or ban depending on severity.
      </p>

      <div className="mt-14 space-y-10">
        {sections.map((section, i) => (
          <Reveal key={section.id} delay={i * 0.06} className="border-l-2 border-core-ember pl-6">
            <span className="font-mono text-xs text-ash">{String(i + 1).padStart(2, '0')}</span>
            <h2 className="font-display text-xl text-parchment mt-1">{section.section_title}</h2>
            <p className="text-sm text-ash mt-2 leading-relaxed whitespace-pre-line">{section.body}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
