import { AdminTable } from '@/components/admin/AdminTable';

export default function AdminCrateKeysPage() {
  const fields = [
    { key: 'name', label: 'Key Name', type: 'text' as const },
    { key: 'price', label: 'Price per key (₹)', type: 'number' as const },
    { key: 'image', label: 'Image filename (in /public/crates)', type: 'text' as const, placeholder: 'Common.png' },
    { key: 'contents', label: 'Contents', type: 'textarea' as const },
    { key: 'sort_order', label: 'Sort Order', type: 'number' as const },
  ];

  return (
    <div className="space-y-16">
      <AdminTable table="crate_keys" title="Survival Crate Keys" fields={fields} fixedValues={{ server: 'survival' }} />
      <AdminTable table="crate_keys" title="Lifesteal Crate Keys" fields={fields} fixedValues={{ server: 'lifesteal' }} />
    </div>
  );
}
