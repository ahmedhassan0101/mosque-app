// src/components/teacher/TeachersListSkeleton.tsx
import { Skeleton } from "@/components/ui/skeleton";

/** Placeholder grid shown while the teachers list is streaming in. */
export function TeachersListSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <div
          key={i}
          className="border border-border rounded-xl overflow-hidden bg-card"
        >
          <div className="h-1 bg-muted" />
          <div className="p-5 space-y-4">
            <div className="flex items-center gap-3">
              <Skeleton className="w-12 h-12 rounded-full shrink-0" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            </div>
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-2/3" />
          </div>
          <div className="h-10 border-t border-border bg-muted/30" />
        </div>
      ))}
    </div>
  );
}