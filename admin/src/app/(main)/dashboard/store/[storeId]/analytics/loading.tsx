import { Skeleton } from "@/components/ui/skeleton";

export default function AnalyticsLoading() {
  return (
    <div className="flex flex-col gap-4 md:gap-6">
      {/* Overview skeleton */}
      <div className="grid gap-4">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Skeleton className="h-9 w-40" />
            <Skeleton className="h-9 w-24" />
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="h-9 w-56" />
            <Skeleton className="h-9 w-24" />
          </div>
        </div>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <Skeleton className="h-48" />
          <Skeleton className="h-48 lg:col-span-2" />
        </div>
      </div>

      {/* Middle row skeleton */}
      <div className="grid grid-cols-1 items-stretch gap-4 lg:grid-cols-3">
        <div className="flex flex-col gap-4 lg:col-span-2">
          <Skeleton className="h-96" />
          <Skeleton className="h-64" />
        </div>
        <Skeleton className="h-full min-h-96" />
      </div>

      {/* Ledger skeleton */}
      <Skeleton className="h-96" />
    </div>
  );
}
