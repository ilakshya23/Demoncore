import { SiteLinksEditor } from '@/components/admin/SiteLinksEditor';

export default function AdminLinksPage() {
  return (
    <div className="space-y-16">
      <SiteLinksEditor group="server" title="Server Links" labels={['Java Edition', 'Bedrock Edition']} />
      <SiteLinksEditor group="social" title="Social Links" labels={['Discord']} />
    </div>
  );
}
