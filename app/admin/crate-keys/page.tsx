import { AdminTable } from '@/components/admin/AdminTable';

export default function AdminCrateKeysPage() {
  const fields = [
    { key: 'name', label: 'Key Name', type: 'text' as const },
    { key: 'price_label', label: 'Price Label (e.g. ₹49)', type: 'text' as const },
    { key: 'contents', label: 'Contents', type: 'list' as const, placeholder: 'One item per line' },
    { key: 'sort_order', label: 'Sort Order', type: 'number' as const },
  ];

  return (
    <div className="space-y-16">
      <AdminTable table="crate_keys" title="Survival Crate Keys" fields={fields} fixedValues={{ gamemode: 'survival' }} />
      <AdminTable table="crate_keys" title="Lifesteal Crate Keys" fields={fields} fixedValues={{ gamemode: 'lifesteal' }} />
    </div>
  );
}
