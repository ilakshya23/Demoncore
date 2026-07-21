import { AdminTable } from '@/components/admin/AdminTable';

export default function AdminRanksPage() {
  const fields = [
    { key: 'name', label: 'Rank Name', type: 'text' as const },
    { key: 'price_label', label: 'Price Label (e.g. ₹199)', type: 'text' as const },
    { key: 'perks', label: 'Perks', type: 'list' as const, placeholder: 'One perk per line' },
    { key: 'sort_order', label: 'Sort Order', type: 'number' as const },
    { key: 'color_hex', label: 'Accent Color', type: 'color' as const },
  ];

  return (
    <div className="space-y-16">
      <AdminTable table="ranks" title="Survival Ranks" fields={fields} fixedValues={{ gamemode: 'survival' }} />
      <AdminTable table="ranks" title="Lifesteal Ranks" fields={fields} fixedValues={{ gamemode: 'lifesteal' }} />
    </div>
  );
}
