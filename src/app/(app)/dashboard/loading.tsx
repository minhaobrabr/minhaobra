import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardLoading() {
  return (
    <div className="space-y-4">
      <div className="mb-6 space-y-2">
        <Skeleton className="h-7 w-64" />
        <Skeleton className="h-4 w-96 max-w-full" />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <Skeleton key={index} className="h-[132px] rounded-2xl" />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
        <Skeleton className="h-28 rounded-2xl lg:col-span-8" />
        <Skeleton className="h-28 rounded-2xl lg:col-span-4" />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
        <Skeleton className="h-[330px] rounded-2xl lg:col-span-8" />
        <Skeleton className="h-[330px] rounded-2xl lg:col-span-4" />
      </div>

      <Skeleton className="h-80 rounded-2xl" />
    </div>
  );
}
