import { AdminTable } from '@/components/admin/AdminTable';

export default function AdminStaffPage() {
  const fields = [
    { key: 'name', label: 'Name', type: 'text' as const },
    { key: 'role', label: 'Role (must match a rank name, e.g. Owner, Admin, Mod)', type: 'text' as const },
    { key: 'bio', label: 'Bio', type: 'textarea' as const },
    { key: 'skin', label: 'Skin', type: 'staff-skin' as const },
    { key: 'sort_order', label: 'Sort Order', type: 'number' as const },
  ];

  return (
    <div>
      <div className="mb-10 border border-core-ember/30 p-6">
        <h2 className="font-display text-sm uppercase tracking-wide text-core-ember mb-3">
          Setting a staff member's skin
        </h2>
        <p className="text-sm text-ash mb-4">
          Pick <span className="text-parchment">Premium account</span> if they own the real
          Minecraft game — just enter their username and the skin is fetched automatically. Pick{' '}
          <span className="text-parchment">Cracked / custom skin</span> for anyone else, then
          either upload a skin file directly or paste a link to one. Either way, the site renders
          it as a full 3D character — the box on the right previews it live as you set it.
        </p>
        <p className="text-sm text-ash mb-2">To get a skin link from a site like{' '}
          <a href="https://www.minecraftskins.com" target="_blank" rel="noreferrer" className="text-core-ember hover:text-core-glow">
            minecraftskins.com
          </a>:
        </p>
        <ol className="list-decimal list-inside space-y-2 text-sm text-ash">
          <li>Find or upload the skin there, and open its skin page.</li>
          <li>
            Scroll to the <span className="text-parchment">"Embed codes"</span> box and click the{' '}
            <span className="text-parchment">"Image Link"</span> tab (not "Forum" or "HTML").
          </li>
          <li>
            Copy just that link — it looks like{' '}
            <code className="text-xs text-parchment bg-obsidian px-1.5 py-0.5 break-all">
              https://www.minecraftskins.com/uploads/skins/2026/07/19/rgb-entity-24207708.png?v961
            </code>
          </li>
          <li>Paste it into "Paste URL" below for that staff member.</li>
        </ol>
        <p className="text-xs text-ash/70 mt-4">
          Don't use the page URL (the one in your browser's address bar, e.g.{' '}
          <code className="bg-obsidian px-1 py-0.5">minecraftskins.com/skin/24207708/rgb-entity/</code>
          ) or the "Forum"/"HTML" embed codes — those are pages or snippets, not a direct image
          link, and won't render. If you have the skin file itself, "Upload file" skips this
          entirely.
        </p>
      </div>
      <AdminTable table="staff_members" title="Staff Directory" fields={fields} />
    </div>
  );
}
