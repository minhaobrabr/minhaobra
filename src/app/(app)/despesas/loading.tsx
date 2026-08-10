import { Skeleton } from "@/components/ui/skeleton";

export default function DespesasLoading() {
  return (
    <div>
      <div className="mb-6 flex items-end justify-between gap-4">
        <div className="space-y-2">
          <Skeleton className="h-7 w-36" />
          <Skeleton className="h-4 w-80 max-w-full" />
        </div>
        <Skeleton className="h-10 w-40 rounded-full" />
      </div>

      <Skeleton className="mb-4 h-[70px] rounded-2xl" />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
        <Skeleton className="h-[520px] rounded-2xl lg:col-span-8" />
        <Skeleton className="h-[420px] rounded-2xl lg:col-span-4" />
      </div>
    </div>
  );
}
