import { CoinPackagesEditor } from '@/components/admin/CoinPackagesEditor';

export default function AdminCoinsPage() {
  return (
    <div className="space-y-16">
      <CoinPackagesEditor server="survival" title="Survival Coin Packages (8 slots, 2 INR = 1 coin)" />
      <div>
        <h2 className="font-display text-lg text-ash">Lifesteal Coin Packages</h2>
        <p className="text-ash text-sm mt-2">Lifesteal coins show as "Coming Soon" on the shop page — nothing to configure yet.</p>
      </div>
    </div>
  );
}
