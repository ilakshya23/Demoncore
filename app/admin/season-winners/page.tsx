import { AdminTable } from '@/components/admin/AdminTable';

export default function AdminSeasonWinnersPage() {
  const fields = [
    { key: 'season_label', label: 'Season (e.g. Season 1)', type: 'text' as const },
    { key: 'gamemode', label: 'Gamemode', type: 'select' as const, options: ['survival', 'pvp', 'lifesteal', ''] },
    { key: 'category', label: 'Category (e.g. Overall Champion)', type: 'text' as const },
    { key: 'player_name', label: 'Player Name', type: 'text' as const },
    { key: 'sort_order', label: 'Sort Order', type: 'number' as const },
  ];

  return <AdminTable table="season_winners" title="Season Winners" fields={fields} />;
}
