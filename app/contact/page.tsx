import { ContactForm } from '@/components/ContactForm';
import { Reveal } from '@/components/Reveal';
import { ParallaxImage } from '@/components/ParallaxImage';

export const metadata = { title: 'Contact — DEMONCORE MC' };

export default function ContactPage() {
  return (
    <div className="relative isolate">
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <ParallaxImage src="/backgrounds/contact-bg.jpg" />
        <div className="absolute inset-0 bg-void/75" />
      </div>

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
    </div>
  );
}
