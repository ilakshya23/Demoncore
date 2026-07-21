import { getStaff } from '@/lib/queries';
import { Reveal } from '@/components/Reveal';

export const metadata = { title: 'Staff — DEMONCORE MC' };

const FALLBACK = [
  { id: 'f1', name: 'Owner', role: 'Owner', bio: 'Founded DEMONCORE MC and oversees all servers.', avatar_url: null, sort_order: 1 },
];

export default async function StaffPage() {
  const staff = await getStaff();
  const list = staff.length > 0 ? staff : FALLBACK;

  return (
    <section className="mx-auto max-w-5xl px-6 py-20">
      <h1 className="font-display text-4xl md:text-5xl font-black uppercase text-parchment text-center">
        Our Staff
      </h1>
      <p className="text-ash text-center mt-3">The team keeping DEMONCORE MC running, fair, and fun.</p>

      <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {list.map((member, i) => (
          <Reveal key={member.id} delay={i * 0.06} className="border border-white/10 p-6 text-center">
            <div className="mx-auto h-16 w-16 rounded-full bg-obsidian border border-white/10 flex items-center justify-center font-display text-lg text-core-ember">
              {member.name.slice(0, 1).toUpperCase()}
            </div>
            <h3 className="font-display text-parchment mt-4">{member.name}</h3>
            <p className="text-xs uppercase tracking-wide text-core-ember mt-1">{member.role}</p>
            {member.bio && <p className="text-sm text-ash mt-3 leading-relaxed">{member.bio}</p>}
          </Reveal>
        ))}
      </div>
    </section>
  );
}
