import { AdminTable } from '@/components/admin/AdminTable';

export default function AdminLinksPage() {
  const fields = [
    { key: 'label', label: 'Label', type: 'text' as const },
    { key: 'url', label: 'URL', type: 'text' as const },
    { key: 'sort_order', label: 'Sort Order', type: 'number' as const },
  ];

  return (
    <div className="space-y-16">
      <AdminTable table="site_links" title="Server Links" fields={fields} fixedValues={{ group_name: 'server' }} />
      <AdminTable table="site_links" title="Social Links" fields={fields} fixedValues={{ group_name: 'social' }} />
    </div>
  );
}
