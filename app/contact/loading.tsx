import { Skeleton } from '@/components/ui';

export default function Loading() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-20">
      <div className="flex flex-col items-center gap-3">
        <Skeleton className="h-12 w-56" />
        <Skeleton className="h-4 w-72 max-w-full" />
      </div>
      <Skeleton className="mt-12 h-96 w-full" />
    </div>
  );
}
