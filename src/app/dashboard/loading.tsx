// export default function DashboardLoading() {
//   return (
//     <div className="flex h-full min-h-[50vh] items-center justify-center">
//       <div
//         className="size-8 animate-spin rounded-full border-2 border-muted border-t-primary"
//         role="status"
//         aria-label="جارٍ التحميل"
//       />
//     </div>
//   );
// }

// app/dashboard/loading.tsx
import { Loader2 } from "lucide-react";

export default function DashboardLoading() {
  return (
    <div className="flex h-[calc(100vh-8rem)] w-full flex-col items-center justify-center gap-4 text-muted-foreground">
      <Loader2 className="size-8 animate-spin text-primary" />
      <p className="animate-pulse text-sm font-medium">جاري جلب البيانات...</p>
    </div>
  );
}
