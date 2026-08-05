// "use client";

// import { useEffect } from "react";
// import { AlertTriangle, RotateCcw } from "lucide-react";
// import { Button } from "@/components/ui/button";

// export default function DashboardError({
//   error,
//   reset,
// }: {
//   error: Error & { digest?: string };
//   reset: () => void;
// }) {
//   useEffect(() => {
//     console.error(error);
//   }, [error]);

//   return (
//     <div className="flex h-full min-h-[50vh] items-center justify-center">
//       <div className="card-elevated flex w-full max-w-md flex-col items-center gap-4 p-6 text-center">
//         <div className="flex size-12 items-center justify-center rounded-full bg-destructive/10">
//           <AlertTriangle className="size-6 text-destructive" />
//         </div>

//         <div className="flex flex-col gap-1">
//           <h1 className="text-section-title">تعذر تحميل هذا القسم</h1>
//           <p className="text-caption">
//             حدث خطأ أثناء تحميل البيانات. حاول مرة أخرى.
//           </p>
//         </div>

//         <Button onClick={reset} className="w-full">
//           <RotateCcw className="size-4" />
//           إعادة المحاولة
//         </Button>
//       </div>
//     </div>
//   );
// }

"use client";

// app/dashboard/error.tsx
import { useEffect } from "react";
import { AlertCircle, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // يفضل ربطها بـ Sentry لاحقاً
    console.error("[Dashboard Error]", error);
  }, [error]);

  return (
    <div className="flex h-[calc(100vh-8rem)] w-full items-center justify-center">
      <div className="mx-auto flex w-full max-w-md flex-col items-center gap-6 rounded-xl border bg-card p-8 text-center text-card-foreground shadow-sm">
        <div className="flex size-14 items-center justify-center rounded-full bg-destructive/10">
          <AlertCircle className="size-7 text-destructive" />
        </div>

        <div className="flex flex-col gap-2">
          <h2 className="text-xl font-semibold tracking-tight">
            تعذر تحميل البيانات
          </h2>
          <p className="text-sm leading-relaxed text-muted-foreground">
            حدث خطأ غير متوقع أثناء محاولة جلب بيانات هذا القسم. يرجى إعادة
            المحاولة أو التواصل مع الدعم الفني.
          </p>
          {error.digest && (
            <span className="mx-auto mt-1 w-fit rounded-md bg-muted px-2 py-1 font-mono text-[11px] text-muted-foreground">
              {error.digest}
            </span>
          )}
        </div>

        <div className="mt-2 w-full">
          <Button onClick={reset} className="group w-full gap-2">
            <RotateCcw className="size-4 transition-transform duration-300 group-hover:-rotate-180" />
            إعادة المحاولة
          </Button>
        </div>
      </div>
    </div>
  );
}
