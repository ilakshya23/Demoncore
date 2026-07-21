import type { Metadata } from 'next';
import { Unbounded, Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { Preloader } from '@/components/Preloader';
import { SmoothScrollProvider } from '@/components/SmoothScrollProvider';
import { Nav } from '@/components/Nav';
import { Footer } from '@/components/Footer';
import { PageTransition } from '@/components/PageTransition';
import { MinecraftHUD } from '@/components/MinecraftHUD';
import TargetCursor from '@/components/TargetCursor';

const display = Unbounded({ subsets: ['latin'], weight: ['500', '700', '900'], variable: '--font-display' });
const body = Inter({ subsets: ['latin'], variable: '--font-body' });
const mono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono' });

export const metadata: Metadata = {
  title: 'DEMONCORE MC — Season 2: Rise of the Demons',
  description:
    'Survival, PvP, and Lifesteal on DEMONCORE MC. India-based, zero pay-to-win Minecraft SMP running 1.21.11.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable} ${mono.variable}`}>
      <body className="font-body">
        <TargetCursor targetSelector=".cursor-target" cursorColorOnTarget="#FF5A2E" />
        <Preloader>
          <SmoothScrollProvider>
            <Nav />
            <PageTransition>
              <main>{children}</main>
            </PageTransition>
            <Footer />
          </SmoothScrollProvider>
        </Preloader>
        <MinecraftHUD />
      </body>
    </html>
  );
}
