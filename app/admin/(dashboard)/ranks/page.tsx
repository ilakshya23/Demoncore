import { AdminTable } from '@/components/admin/AdminTable';

export default function AdminRanksPage() {
  const fields = [
    { key: 'name', label: 'Rank Name', type: 'text' as const },
    { key: 'price', label: 'Price (₹, blank = not for sale)', type: 'number' as const },
    { key: 'color_code', label: 'Color Code (Minecraft &#RRGGBB or MiniMessage gradient)', type: 'textarea' as const },
    { key: 'perks', label: 'Perks', type: 'list' as const, placeholder: 'One perk per line' },
    {
      key: 'command_template',
      label: 'Delivery Command (blank = deliver manually). Placeholders: {player} {server}',
      type: 'text' as const,
      placeholder: 'lp user {player} parent add vip',
    },
    { key: 'sort_order', label: 'Sort Order', type: 'number' as const },
  ];

  return (
    <div className="space-y-16">
      <AdminTable table="ranks" title="Survival Ranks" fields={fields} fixedValues={{ server: 'survival' }} />
      <AdminTable table="ranks" title="Lifesteal Ranks" fields={fields} fixedValues={{ server: 'lifesteal' }} />
    </div>
  );
}
