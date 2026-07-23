import { AdminTable } from '@/components/admin/AdminTable';

export default function AdminRulesPage() {
  const fields = [
    { key: 'group_label', label: 'Group Heading (optional, e.g. "Chat Guidelines")', type: 'text' as const },
    { key: 'title', label: 'Rule Title', type: 'text' as const },
    { key: 'body', label: 'Body Text', type: 'textarea' as const },
    { key: 'sort_order', label: 'Sort Order', type: 'number' as const },
  ];

  return (
    <div className="space-y-16">
      <AdminTable table="rules" title="Server Rules" fields={fields} fixedValues={{ category: 'server' }} />
      <AdminTable table="rules" title="Discord Rules" fields={fields} fixedValues={{ category: 'discord' }} />
    </div>
  );
}
