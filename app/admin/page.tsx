import { supabaseAdmin } from '@/lib/supabase';

export default async function AdminDashboard() {
  const supabase = supabaseAdmin();

  const [{ count: newSubmissions }, { count: newApplications }] = await Promise.all([
    supabase.from('contact_submissions').select('*', { count: 'exact', head: true }).eq('status', 'new'),
    supabase.from('staff_applications').select('*', { count: 'exact', head: true }).eq('status', 'new'),
  ]);

  return (
    <div>
      <h1 className="font-display text-2xl text-parchment mb-8">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="border border-white/10 p-6">
          <div className="font-mono text-3xl text-core-ember">{newSubmissions ?? 0}</div>
          <div className="text-xs uppercase tracking-wide text-ash mt-1">New contact submissions</div>
        </div>
        <div className="border border-white/10 p-6">
          <div className="font-mono text-3xl text-core-ember">{newApplications ?? 0}</div>
          <div className="text-xs uppercase tracking-wide text-ash mt-1">New staff applications</div>
        </div>
      </div>
      <p className="text-ash text-sm mt-10">
        Use the sidebar to edit ranks, crate keys, staff, rules, links, season winners, and
        the current event — every change is picked up by the live site immediately.
      </p>
    </div>
  );
}
