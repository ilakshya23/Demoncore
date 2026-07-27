import { AdminTable } from '@/components/admin/AdminTable';

export default function AdminStaffPage() {
  const fields = [
    { key: 'name', label: 'Name', type: 'text' as const },
    { key: 'role', label: 'Role (must match a rank name, e.g. Owner, Admin, Mod)', type: 'text' as const },
    { key: 'bio', label: 'Bio', type: 'textarea' as const },
    { key: 'avatar_url', label: 'Profile Photo', type: 'image' as const },
    { key: 'instagram_url', label: 'Instagram URL', type: 'text' as const, placeholder: 'https://instagram.com/...' },
    { key: 'youtube_url', label: 'YouTube URL', type: 'text' as const, placeholder: 'https://youtube.com/@...' },
    { key: 'discord_url', label: 'Discord URL', type: 'text' as const, placeholder: 'https://discord.gg/...' },
    { key: 'sort_order', label: 'Sort Order', type: 'number' as const },
  ];

  return <AdminTable table="staff_members" title="Staff Directory" fields={fields} />;
}
