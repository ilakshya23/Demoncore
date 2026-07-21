'use client';

import { createContext, useContext, useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { LogoMark } from './Logo';

const SiteReadyContext = createContext(true);
export const useSiteReady = () => useContext(SiteReadyContext);

/**
 * Wraps the whole app. Children mount immediately (so data fetching / route
 * work starts right away), but stay hidden behind the preloader overlay
 * until `window.load` fires and a minimum display time has elapsed. This is
 * the "preloader for the entire site" — it only plays once per browser
 * session (sessionStorage), not on every client-side route change.
 */
export function Preloader({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const [skip, setSkip] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);
  const shardTop = useRef<HTMLDivElement>(null);
  const shardBottom = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const alreadySeen = sessionStorage.getItem('dc_preloaded');
    if (alreadySeen) {
      setSkip(true);
      setReady(true);
      return;
    }

    const start = Date.now();
    const MIN_MS = 1400;

    const finish = () => {
      const elapsed = Date.now() - start;
      const wait = Math.max(0, MIN_MS - elapsed);
      window.setTimeout(() => setReady(true), wait);
    };

    if (document.readyState === 'complete') {
      finish();
    } else {
      window.addEventListener('load', finish, { once: true });
      // Safety net: never hold the site hostage longer than 5s
      const fallback = window.setTimeout(finish, 5000);
      return () => {
        window.removeEventListener('load', finish);
        window.clearTimeout(fallback);
      };
    }
  }, []);

  useEffect(() => {
    if (!ready || skip) return;
    sessionStorage.setItem('dc_preloaded', '1');

    const tl = gsap.timeline({
      onComplete: () => overlayRef.current?.remove(),
    });
    tl.to(shardTop.current, { yPercent: -100, duration: 0.7, ease: 'power4.inOut' })
      .to(shardBottom.current, { yPercent: 100, duration: 0.7, ease: 'power4.inOut' }, '<')
      .to(overlayRef.current, { autoAlpha: 0, duration: 0.2 }, '-=0.2');
  }, [ready, skip]);

  return (
    <SiteReadyContext.Provider value={ready}>
      {!skip && (
        <div
          ref={overlayRef}
          className="fixed inset-0 z-[999] pointer-events-none"
          aria-hidden={ready}
        >
          <div
            ref={shardTop}
            className="absolute inset-x-0 top-0 h-1/2 bg-void flex items-end justify-center pb-2"
          >
            <div className="mb-6 animate-pulse">
              <LogoMark size={56} />
            </div>
          </div>
          <div ref={shardBottom} className="absolute inset-x-0 bottom-0 h-1/2 bg-void" />
        </div>
      )}
      {children}
    </SiteReadyContext.Provider>
  );
}
