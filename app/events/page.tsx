import { getCurrentEvent } from '@/lib/queries';
import { CrackDivider } from '@/components/ui';
import { PlayersOnline } from '@/components/gamemode/PlayersOnline';
import { Reveal } from '@/components/Reveal';
import { PageHero } from '@/components/PageHero';
import { RibbonMarquee } from '@/components/RibbonMarquee';

export const metadata = { title: 'Events — DEMONCORE MC' };

export default async function EventsPage() {
  const event = await getCurrentEvent();

  return (
    <>
      <section className="relative">
        <PageHero eyebrow="Current Event" title={event.title} subtitle={event.description} />
        <Reveal className="relative mx-auto max-w-5xl px-6 pb-14 text-center -mt-10">
          <div className="flex justify-center">
            <PlayersOnline serverKey="events" label="the event" />
          </div>
        </Reveal>
        <div className="mt-10">
          <RibbonMarquee text="Coming Soon" />
        </div>
        <CrackDivider />
      </section>

      <section className="mx-auto max-w-3xl px-6 py-20 text-center border-t border-white/10">
        <p className="text-ash text-sm">
          Full event details and countdown timers are finalized closer to launch — the admin
          panel lets us swap this entire page's content the moment a new event goes live,
          without a redeploy.
        </p>
      </section>
    </>
  );
}
