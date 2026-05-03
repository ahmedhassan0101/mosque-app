// src/components/students/StudentsTableSkeleton.tsx
import { Skeleton } from "@/components/ui/skeleton";

export function StudentsTableSkeleton() {
  return (
    <div className="border border-border rounded-xl overflow-hidden bg-card">
      {/* Table header */}
      <div className="grid grid-cols-6 gap-4 px-4 py-3 bg-muted/50 border-b border-border">
        {["الاسم", "العمر", "المستوى", "ولي الأمر", "الحالة", "إجراءات"].map(
          (h) => (
            <div key={h} className="text-xs font-medium text-muted-foreground">
              {h}
            </div>
          ),
        )}
      </div>
      {/* Rows */}
      {Array.from({ length: 8 }).map((_, i) => (
        <div
          key={i}
          className="grid grid-cols-6 gap-4 px-4 py-3 border-b border-border last:border-0"
        >
          <div className="flex items-center gap-2">
            <Skeleton className="w-7 h-7 rounded-full shrink-0" />
            <Skeleton className="h-4 w-24" />
          </div>
          <Skeleton className="h-4 w-10 self-center" />
          <Skeleton className="h-5 w-16 rounded-full self-center" />
          <Skeleton className="h-4 w-24 self-center" />
          <Skeleton className="h-5 w-14 rounded-full self-center" />
          <div className="flex gap-1 self-center">
            <Skeleton className="h-7 w-7 rounded" />
            <Skeleton className="h-7 w-7 rounded" />
            <Skeleton className="h-7 w-7 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}
