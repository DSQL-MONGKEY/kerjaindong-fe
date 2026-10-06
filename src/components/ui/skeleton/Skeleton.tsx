import { cn } from "@/utils";

interface SkeletonProps {
  className?: string;
}

export default function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "animate-pulse rounded-md bg-gray-100 dark:bg-white/10",
        className,
      )}
    />
  );
}

export function SkeletonText({
  lines = 3,
  className,
}: {
  lines?: number;
  className?: string;
}) {
  return (
    <div className={cn("space-y-2", className)}>
      {Array.from({ length: lines }).map((_, index) => (
        <Skeleton
          key={index}
          className={cn("h-3.5", index === lines - 1 ? "w-2/3" : "w-full")}
        />
      ))}
    </div>
  );
}

export function SkeletonStatCards({
  count = 3,
  className,
}: {
  count?: number;
  className?: string;
}) {
  return (
    <div
      className={cn("grid grid-cols-1 gap-4 sm:grid-cols-3", className)}
      aria-hidden="true"
    >
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/3"
        >
          <Skeleton className="h-6 w-12" />
          <Skeleton className="mt-2.5 h-3.5 w-28" />
        </div>
      ))}
    </div>
  );
}

export function SkeletonJobCard() {
  return (
    <div
      aria-hidden="true"
      className="flex h-full flex-col gap-3 rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/3"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1 space-y-2">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-3.5 w-1/2" />
        </div>
        <Skeleton className="h-6 w-20 shrink-0 rounded-full" />
      </div>

      <div className="flex flex-wrap gap-2">
        <Skeleton className="h-6 w-16 rounded-full" />
        <Skeleton className="h-6 w-20 rounded-full" />
        <Skeleton className="h-6 w-14 rounded-full" />
      </div>

      <div className="mt-auto flex items-center justify-between gap-2 border-t border-gray-100 pt-3 dark:border-gray-800">
        <Skeleton className="h-3.5 w-24" />
        <Skeleton className="h-3.5 w-28" />
      </div>
    </div>
  );
}

export function SkeletonJobCardGrid({
  count = 6,
  className,
}: {
  count?: number;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3",
        className,
      )}
      aria-hidden="true"
    >
      {Array.from({ length: count }).map((_, index) => (
        <SkeletonJobCard key={index} />
      ))}
    </div>
  );
}

export function SkeletonListCard({
  rows = 3,
  avatar = false,
  className,
}: {
  rows?: number;
  avatar?: boolean;
  className?: string;
}) {
  return (
    <div className={cn("space-y-3", className)} aria-hidden="true">
      {Array.from({ length: rows }).map((_, index) => (
        <div
          key={index}
          className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/3"
        >
          <div className="flex min-w-0 flex-1 items-center gap-4">
            {avatar ? (
              <Skeleton className="size-12 shrink-0 rounded-xl" />
            ) : null}
            <div className="min-w-0 flex-1 space-y-2">
              <Skeleton className="h-4 w-44 max-w-full" />
              <Skeleton className="h-3.5 w-56 max-w-full" />
            </div>
          </div>
          <Skeleton className="h-9 w-24 rounded-lg" />
        </div>
      ))}
    </div>
  );
}

export function SkeletonRows({
  rows = 3,
  className,
}: {
  rows?: number;
  className?: string;
}) {
  return (
    <div className={cn("space-y-3", className)} aria-hidden="true">
      {Array.from({ length: rows }).map((_, index) => (
        <div
          key={index}
          className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-gray-100 p-4 dark:border-gray-800"
        >
          <div className="min-w-0 flex-1 space-y-2">
            <Skeleton className="h-4 w-40 max-w-full" />
            <Skeleton className="h-3.5 w-56 max-w-full" />
          </div>
          <Skeleton className="h-9 w-20 rounded-lg" />
        </div>
      ))}
    </div>
  );
}

export function SkeletonTable({
  rows = 6,
  columns = 4,
  className,
}: {
  rows?: number;
  columns?: number;
  className?: string;
}) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "overflow-hidden rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/3",
        className,
      )}
    >
      <div className="flex gap-4 bg-gray-50 px-4 py-3 dark:bg-white/5">
        {Array.from({ length: columns }).map((_, index) => (
          <Skeleton key={index} className="h-3.5 flex-1" />
        ))}
      </div>
      <div className="divide-y divide-gray-100 dark:divide-gray-800">
        {Array.from({ length: rows }).map((_, row) => (
          <div key={row} className="flex gap-4 px-4 py-3.5">
            {Array.from({ length: columns }).map((_, column) => (
              <Skeleton key={column} className="h-3.5 flex-1" />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export function SkeletonForm({
  fields = 4,
  className,
}: {
  fields?: number;
  className?: string;
}) {
  return (
    <div className={cn("space-y-5", className)} aria-hidden="true">
      {Array.from({ length: fields }).map((_, index) => (
        <div key={index} className="space-y-2">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-11 w-full rounded-lg" />
        </div>
      ))}
      <Skeleton className="h-11 w-32 rounded-lg" />
    </div>
  );
}

export function SkeletonDetail({ className }: SkeletonProps) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/3",
        className,
      )}
    >
      <Skeleton className="h-5 w-1/3" />
      <Skeleton className="mt-2 h-3.5 w-1/4" />
      <SkeletonText lines={4} className="mt-5" />
      <Skeleton className="mt-5 h-10 w-32 rounded-lg" />
    </div>
  );
}
