import { ContactForm } from '@/components/ContactForm';
import { Reveal } from '@/components/Reveal';

export const metadata = { title: 'Contact — DEMONCORE MC' };

export default function ContactPage() {
  return (
    <section className="mx-auto max-w-2xl px-6 py-20">
      <Reveal>
        <h1 className="font-display text-4xl md:text-5xl font-black uppercase text-parchment text-center">
          Contact Us
        </h1>
        <p className="text-ash text-center mt-3">
          Questions, bug reports, or business inquiries — send us a message.
        </p>
      </Reveal>
      <Reveal delay={0.12} className="mt-12">
        <ContactForm />
      </Reveal>
    </section>
  );
}
