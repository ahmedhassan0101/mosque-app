// src/components/groups/GroupProfileSkeleton.tsx
import { Skeleton } from "@/components/ui/skeleton";

export function GroupProfileSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-7 w-48" />
          <Skeleton className="h-5 w-20 rounded-full" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-9 w-24 rounded-md" />
          <Skeleton className="h-9 w-9 rounded-md" />
        </div>
      </div>

      {/* Info cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="border border-border rounded-xl p-5 space-y-3 bg-card">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-4 w-20" />
          </div>
        ))}
      </div>

      {/* Students table */}
      <div className="border border-border rounded-xl overflow-hidden bg-card">
        <div className="p-4 border-b border-border">
          <Skeleton className="h-5 w-36" />
        </div>
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 px-4 py-3 border-b border-border last:border-0">
            <Skeleton className="w-7 h-7 rounded-full shrink-0" />
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-24 mr-auto" />
            <Skeleton className="h-7 w-7 rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}