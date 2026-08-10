import { Skeleton } from "@/components/ui/skeleton";

export default function RelatorioLoading() {
  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <div className="space-y-3 border-b border-line pb-6">
        <Skeleton className="h-3 w-40" />
        <Skeleton className="h-8 w-80 max-w-full" />
        <Skeleton className="h-4 w-64" />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {Array.from({ length: 4 }).map((_, index) => (
          <Skeleton key={index} className="h-[132px] rounded-2xl" />
        ))}
      </div>

      <Skeleton className="h-[400px] rounded-2xl" />
      <Skeleton className="h-64 rounded-2xl" />
      <Skeleton className="h-64 rounded-2xl" />
    </div>
  );
}
