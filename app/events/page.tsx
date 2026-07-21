import { getCurrentEvent } from '@/lib/queries';
import { CrackDivider } from '@/components/ui';
import { PlayersOnline } from '@/components/gamemode/PlayersOnline';
import { Reveal } from '@/components/Reveal';

export const metadata = { title: 'Events — DEMONCORE MC' };

export default async function EventsPage() {
  const event = await getCurrentEvent();

  return (
    <>
      <section className="relative">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(201,162,39,0.15),_transparent_60%)]" />
        <Reveal className="relative mx-auto max-w-5xl px-6 pt-20 pb-14 text-center">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-mode-events">Current Event</p>
          <h1 className="mt-4 font-display text-4xl md:text-6xl font-black uppercase text-parchment">
            {event.title}
          </h1>
          <p className="mt-4 max-w-xl mx-auto text-ash">{event.description}</p>
          <div className="mt-8 flex justify-center">
            <PlayersOnline serverKey="events" label="the event" />
          </div>
        </Reveal>
        <CrackDivider />
      </section>

      <section className="mx-auto max-w-4xl px-6 py-20 grid grid-cols-1 md:grid-cols-2 gap-10">
        <Reveal>
          <h2 className="font-display text-xl text-parchment mb-4">Rules</h2>
          {event.rules.length > 0 ? (
            <ul className="space-y-2 text-sm text-ash list-disc list-inside">
              {event.rules.map((r, i) => (
                <li key={i}>{r}</li>
              ))}
            </ul>
          ) : (
            <ul className="space-y-2 text-sm text-ash list-disc list-inside">
              <li>No checkpoints may be skipped — complete the course in order.</li>
              <li>No mods or client-side modifications that alter movement.</li>
              <li>One attempt per run; queue again to retry.</li>
            </ul>
          )}
        </Reveal>
        <Reveal delay={0.1}>
          <h2 className="font-display text-xl text-parchment mb-4">Rewards</h2>
          {event.rewards.length > 0 ? (
            <ul className="space-y-2 text-sm text-ash list-disc list-inside">
              {event.rewards.map((r, i) => (
                <li key={i}>{r}</li>
              ))}
            </ul>
          ) : (
            <ul className="space-y-2 text-sm text-ash list-disc list-inside">
              <li>Top 3 fastest times earn an exclusive parkour crate key.</li>
              <li>All finishers receive a limited cosmetic tag.</li>
            </ul>
          )}
        </Reveal>
      </section>

      <section className="mx-auto max-w-3xl px-6 pb-20 text-center border-t border-white/10 pt-14">
        <p className="text-ash text-sm">
          Full event details and countdown timers are finalized closer to launch — the admin
          panel lets us swap this entire page's content the moment a new event goes live,
          without a redeploy.
        </p>
      </section>
    </>
  );
}
