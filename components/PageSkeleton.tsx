import { Skeleton } from '@/components/ui';

// Generic route loading state — roughly matches the hero + content shape of
// every page so navigation feels instant instead of blank while data loads.
export function PageSkeleton({ cards = 0, rows = 0 }: { cards?: number; rows?: number }) {
  return (
    <div>
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 px-6">
        <Skeleton className="h-3 w-32" />
        <Skeleton className="h-14 w-72 max-w-full" />
        <Skeleton className="h-4 w-96 max-w-full" />
      </div>

      {cards > 0 && (
        <div className="mx-auto max-w-6xl px-6 py-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {Array.from({ length: cards }).map((_, i) => (
            <Skeleton key={i} className="h-72 w-full" />
          ))}
        </div>
      )}

      {rows > 0 && (
        <div className="mx-auto max-w-3xl px-6 py-10 space-y-6">
          {Array.from({ length: rows }).map((_, i) => (
            <Skeleton key={i} className="h-20 w-full" />
          ))}
        </div>
      )}
    </div>
  );
}
