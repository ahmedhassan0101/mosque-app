// src/components/groups/GroupsGridSkeleton.tsx
import { Skeleton } from "@/components/ui/skeleton";

export function GroupsGridSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="border border-border rounded-xl overflow-hidden bg-card"
        >
          <div className="h-1 bg-muted" />
          <div className="p-5 space-y-4">
            <div className="flex items-start justify-between">
              <Skeleton className="h-5 w-36" />
              <Skeleton className="h-5 w-16 rounded-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-32" />
            </div>
          </div>
          <div className="h-10 border-t border-border bg-muted/30" />
        </div>
      ))}
    </div>
  );
}