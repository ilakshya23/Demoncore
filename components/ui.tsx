export function CrackDivider() {
  return <div className="crack-divider my-0" role="presentation" />;
}

export function Skeleton({ className = '' }: { className?: string }) {
  return <div className={`skeleton ${className}`} />;
}

export function SkeletonText({ lines = 3, className = '' }: { lines?: number; className?: string }) {
  return (
    <div className={`space-y-2 ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton key={i} className={`h-3 ${i === lines - 1 ? 'w-2/3' : 'w-full'}`} />
      ))}
    </div>
  );
}

export function StatCard({
  label,
  value,
  loading = false,
}: {
  label: string;
  value: string | number;
  loading?: boolean;
}) {
  return (
    <div className="border border-white/10 bg-obsidian/85 px-6 py-5 text-center">
      {loading ? (
        <Skeleton className="mx-auto h-9 w-16" />
      ) : (
        <div className="font-mono text-3xl md:text-4xl text-core-ember tabular-nums">{value}</div>
      )}
      <div className="mt-1 text-xs uppercase tracking-[0.2em] text-ash">{label}</div>
    </div>
  );
}
