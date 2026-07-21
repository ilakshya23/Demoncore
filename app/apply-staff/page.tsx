import { ApplyStaffForm } from '@/components/ApplyStaffForm';
import { Reveal } from '@/components/Reveal';

export const metadata = { title: 'Apply for Staff — DEMONCORE MC' };

export default function ApplyStaffPage() {
  return (
    <section className="mx-auto max-w-2xl px-6 py-20">
      <Reveal>
        <h1 className="font-display text-4xl md:text-5xl font-black uppercase text-parchment text-center">
          Apply for Staff
        </h1>
        <p className="text-ash text-center mt-3">
          We're always looking for dedicated players to help run DEMONCORE MC. Tell us about
          yourself below.
        </p>
      </Reveal>
      <Reveal delay={0.12} className="mt-12">
        <ApplyStaffForm />
      </Reveal>
    </section>
  );
}
