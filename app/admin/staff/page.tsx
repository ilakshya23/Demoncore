import { AdminTable } from '@/components/admin/AdminTable';

export default function AdminStaffPage() {
  const fields = [
    { key: 'name', label: 'Name', type: 'text' as const },
    { key: 'role', label: 'Role (e.g. Owner, Moderator)', type: 'text' as const },
    { key: 'bio', label: 'Bio', type: 'textarea' as const },
    { key: 'avatar_url', label: 'Avatar URL', type: 'text' as const },
    { key: 'sort_order', label: 'Sort Order', type: 'number' as const },
  ];

  return <AdminTable table="staff_members" title="Staff Directory" fields={fields} />;
}
