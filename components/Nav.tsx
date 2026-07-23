'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Logo } from './Logo';

const LINKS = [
  { href: '/', label: 'Home' },
  { href: '/shop', label: 'Shop' },
  { href: '/events', label: 'Events' },
  { href: '/rules', label: 'Rules' },
  { href: '/staff', label: 'Staff' },
  { href: '/contact', label: 'Contact Us' },
];

export function Nav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-void/80 backdrop-blur-md">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link href="/" aria-label="DEMONCORE MC home" className="cursor-target">
          <Logo />
        </Link>

        <ul className="hidden md:flex items-center gap-7 font-body text-sm">
          {LINKS.map((link) => {
            const active = pathname === link.href;
            return (
              <li key={link.href} className="relative">
                <Link
                  href={link.href}
                  className={`cursor-target transition-colors ${active ? 'text-parchment' : 'text-ash hover:text-parchment'}`}
                >
                  {link.label}
                </Link>
                {active && (
                  <motion.div
                    layoutId="nav-active"
                    className="absolute -bottom-[17px] left-0 right-0 h-[2px] bg-core-ember"
                  />
                )}
              </li>
            );
          })}
        </ul>

        <button
          className="cursor-target md:hidden text-parchment text-sm border border-white/20 px-3 py-1.5"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-label="Toggle menu"
        >
          {open ? 'Close' : 'Menu'}
        </button>
      </nav>

      {open && (
        <motion.ul
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="md:hidden border-t border-white/10 bg-void px-6 py-4 space-y-3"
        >
          {LINKS.map((link) => (
            <li key={link.href}>
              <Link href={link.href} className="cursor-target block text-parchment" onClick={() => setOpen(false)}>
                {link.label}
              </Link>
            </li>
          ))}
        </motion.ul>
      )}
    </header>
  );
}
