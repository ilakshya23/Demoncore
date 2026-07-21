import { AdminTable } from '@/components/admin/AdminTable';

export default function AdminRulesPage() {
  const fields = [
    { key: 'section_title', label: 'Section Title', type: 'text' as const },
    { key: 'body', label: 'Body Text', type: 'textarea' as const },
    { key: 'sort_order', label: 'Sort Order', type: 'number' as const },
  ];

  return <AdminTable table="rules" title="Rules" fields={fields} />;
}
