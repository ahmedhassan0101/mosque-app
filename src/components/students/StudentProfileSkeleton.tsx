// src/components/students/StudentProfileSkeleton.tsx
import { Skeleton } from "@/components/ui/skeleton";

export function StudentProfileSkeleton() {
  return (
    <div className="space-y-4">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2">
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-4 w-3" />
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-4 w-3" />
        <Skeleton className="h-4 w-28" />
      </div>

      {/* Bento grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Top hero card */}
        <div className="md:col-span-2 border border-border rounded-xl p-6 space-y-4 bg-card">
          <div className="flex items-center gap-4">
            <Skeleton className="w-20 h-20 rounded-full shrink-0" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-5 w-16 rounded-full" />
            </div>
          </div>
        </div>

        {/* Info card */}
        <div className="border border-border rounded-xl p-5 space-y-3 bg-card">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="space-y-1">
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-4 w-28" />
            </div>
          ))}
        </div>

        {/* Quran card */}
        <div className="border border-border rounded-xl p-5 space-y-3 bg-card">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-8 w-36" />
          <Skeleton className="h-4 w-20" />
        </div>

        {/* Groups card */}
        <div className="md:col-span-2 border border-border rounded-xl p-5 space-y-3 bg-card">
          <Skeleton className="h-4 w-32" />
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="border border-border rounded-lg p-3 space-y-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}