import Link from 'next/link';
import { redirect } from 'next/navigation';
import { supabaseServer } from '@/lib/supabase-server';
import { Logo } from '@/components/Logo';
import { SignOutButton } from '@/components/admin/SignOutButton';

const NAV = [
  { href: '/admin', label: 'Dashboard' },
  { href: '/admin/ranks', label: 'Ranks' },
  { href: '/admin/crate-keys', label: 'Crate Keys' },
  { href: '/admin/purchases', label: 'Purchase Requests' },
  { href: '/admin/staff', label: 'Staff' },
  { href: '/admin/rules', label: 'Rules' },
  { href: '/admin/links', label: 'Server & Social Links' },
  { href: '/admin/event', label: 'Current Event' },
  { href: '/admin/submissions', label: 'Contact Submissions' },
  { href: '/admin/applications', label: 'Staff Applications' },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  // Belt-and-suspenders: middleware already gates /admin/*, but a Server
  // Component check means this layout never even renders protected data
  // if, for some reason, middleware were bypassed (e.g. edge cache oddity).
  const supabase = supabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect('/admin/login');

  return (
    <div className="min-h-screen flex">
      <aside className="w-64 shrink-0 border-r border-white/10 px-5 py-6 hidden md:block">
        <Logo size={30} />
        <nav className="mt-10 space-y-1">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="cursor-target block px-3 py-2 text-sm text-ash hover:text-parchment hover:bg-white/5 transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="mt-10 border-t border-white/10 pt-5">
          <p className="text-xs text-ash mb-3 truncate">{user.email}</p>
          <SignOutButton />
        </div>
      </aside>
      <main className="flex-1 px-6 md:px-10 py-10 max-w-5xl">{children}</main>
    </div>
  );
}
