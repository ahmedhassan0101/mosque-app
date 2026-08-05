// app/not-found.tsx
import Link from "next/link";
import { Home, MoveLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div
      dir="rtl"
      className="flex min-h-dvh flex-col items-center justify-center bg-background text-foreground px-6 py-24 selection:bg-primary/15 selection:text-primary relative overflow-hidden"
    >
      {/* Visual anchor — the 404 numeral */}
      <p
        aria-hidden
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 mb-8 select-none text-[12rem] font-black leading-none tracking-tighter text-primary/9 sm:text-[18rem] pointer-events-none"
      >
        404
      </p>

      {/* ── Copy ─────────────────────────────────────────── */}
      <div className="flex flex-col items-center gap-4 text-center z-10">
        <span className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
          الصفحة غير موجودة
        </span>

        <h1 className="max-w-sm text-3xl font-bold leading-snug text-foreground sm:text-4xl">
          يبدو أنك سلكت طريقاً لا يؤدي إلى أي مكان
        </h1>

        <p className="max-w-xs text-sm leading-relaxed text-muted-foreground sm:max-w-md sm:text-base">
          الرابط الذي أدخلته غير صحيح أو ربما تم نقل هذه الصفحة. لا تقلق، يمكنك
          العودة بأمان لاستكمال عملك.
        </p>
      </div>

      {/* ── Divider ──────────────────────────────────────── */}
      <div className="my-10 h-px w-16 bg-border z-10" aria-hidden />

      {/* ── CTA ──────────────────────────────────────────── */}
      <div className="flex flex-col items-center gap-3 sm:flex-row z-10">
        <Button asChild size="lg" className="group gap-2">
          <Link href="/dashboard">
            <Home className="h-4 w-4" />
            العودة للوحة التحكم
            {/* استخدام MoveLeft لأن الحركة للأمام في العربي تكون جهة اليسار */}
            <MoveLeft className="h-4 w-4 opacity-70 transition-transform group-hover:-translate-x-1" />
          </Link>
        </Button>

        {/* يمكنك تفعيل زر الرجوع للخلف إذا أردت لاحقاً */}
        {/* <Button variant="outline" size="lg" onClick={() => window.history.back()}>
          الرجوع للخلف
        </Button> */}
      </div>

      {/* ── Footer note ──────────────────────────────────── */}
      <p className="mt-16 text-xs text-muted-foreground/50 z-10">
        نظام حلقة (مسجد ERP) · رمز الخطأ 404
      </p>
    </div>
  );
}

// // app/not-found.tsx
// //
// // Next.js App Router — global Not Found boundary.
// // Rendered when notFound() is thrown or a route has no match.
// // No "use client" needed — this is a Server Component.

// import Link from "next/link";
// import { Home, MoveRight } from "lucide-react";

// export default function NotFound() {
//   return (
//     <div
//       dir="rtl"
//       className="
//         flex min-h-dvh flex-col items-center justify-center
//         bg-background text-foreground
//         px-6 py-24
//         selection:bg-primary/15 selection:text-primary
//       "
//     >
//       {/*
//        * Visual anchor — the 404 numeral.
//        * Rendered in a near-transparent primary tint so it
//        * creates atmosphere without competing with the copy.
//        */}
//       <p
//         aria-hidden
//         className="
//           mb-8 select-none
//           text-[9rem] font-black leading-none tracking-tighter
//           text-primary/[0.07]
//           sm:text-[13rem]
//         "
//       >
//         ٤٠٤
//       </p>

//       {/* ── Copy ─────────────────────────────────────────── */}
//       <div className="flex flex-col items-center gap-4 text-center">
//         {/* Eyebrow label */}
//         <span className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
//           الصفحة غير موجودة
//         </span>

//         {/* Main headline */}
//         <h1 className="max-w-sm text-2xl font-bold leading-snug text-foreground sm:text-3xl">
//           يبدو أنك سلكت طريقاً لا يؤدي إلى أي مكان
//         </h1>

//         {/* Supporting sentence */}
//         <p className="max-w-xs text-sm leading-relaxed text-muted-foreground sm:max-w-sm sm:text-base">
//           الرابط الذي أدخلته غير صحيح أو ربما تم نقل هذه الصفحة. لا تقلق، يمكنك
//           العودة بأمان.
//         </p>
//       </div>

//       {/* ── Divider ──────────────────────────────────────── */}
//       <div className="my-10 h-px w-16 bg-border" aria-hidden />

//       {/* ── CTA ──────────────────────────────────────────── */}
//       <div className="flex flex-col items-center gap-3 sm:flex-row">
//         <Link
//           href="/dashboard"
//           className="
//             group inline-flex items-center gap-2.5
//             rounded-lg bg-primary px-5 py-2.5
//             text-sm font-semibold text-primary-foreground
//             shadow-sm transition-all duration-150
//             hover:bg-primary/90 focus-visible:outline-none
//             focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2
//           "
//         >
//           <Home className="h-4 w-4" />
//           العودة للوحة التحكم
//           <MoveRight className="h-3.5 w-3.5 opacity-60 transition-transform group-hover:-translate-x-0.5" />
//         </Link>

//         <button
//           // onClick={() => window.history.back()}
//           className="
//             inline-flex items-center gap-2
//             rounded-lg border border-border
//             px-5 py-2.5 text-sm font-medium
//             text-muted-foreground
//             transition-colors duration-150
//             hover:border-foreground/20 hover:text-foreground
//             focus-visible:outline-none focus-visible:ring-2
//             focus-visible:ring-ring focus-visible:ring-offset-2
//           "
//         >
//           الرجوع للخلف
//         </button>
//       </div>

//       {/* ── Footer note ──────────────────────────────────── */}
//       <p className="mt-16 text-[11px] text-muted-foreground/50">
//         مسجد ERP · رمز الخطأ 404
//       </p>
//     </div>
//   );
// }
// -----------
// import Link from "next/link";
// import { FileQuestion } from "lucide-react";
// import { Button } from "@/components/ui/button";

// export default function NotFound() {
//   return (
//     <div className="flex min-h-dvh items-center justify-center page-x-padding">
//       <div className="card-elevated flex w-full max-w-md flex-col items-center gap-4 p-6 text-center">
//         <div className="flex size-12 items-center justify-center rounded-full bg-muted">
//           <FileQuestion className="size-6 text-muted-foreground" />
//         </div>

//         <div className="flex flex-col gap-1">
//           <h1 className="text-section-title">الصفحة غير موجودة</h1>
//           <p className="text-caption">
//             الرابط الذي حاولت الوصول إليه غير موجود أو تم نقله.
//           </p>
//         </div>

//         <Button asChild className="w-full">
//           <Link href="/dashboard">العودة إلى الرئيسية</Link>
//         </Button>
//       </div>
//     </div>
//   );
// }
