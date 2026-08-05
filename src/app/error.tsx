"use client";

// app/error.tsx
import { useEffect } from "react";
import { Home, RefreshCw, AlertTriangle } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log to your error monitoring service (e.g. Sentry) here
    console.error("[GlobalError]", error);
  }, [error]);

  return (
    <div
      dir="rtl"
      className="flex min-h-dvh flex-col items-center justify-center bg-background text-foreground px-6 py-24 selection:bg-destructive/15 selection:text-destructive relative overflow-hidden"
    >
      <p
        aria-hidden
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 select-none text-[12rem] font-black leading-none tracking-tighter text-destructive/9 sm:text-[18rem]  pointer-events-none"
      >
        ٥٠٠
      </p>

      {/* ── Copy ─────────────────────────────────────────── */}
      <div className="flex flex-col items-center gap-4 text-center z-10">
        <div className="flex size-12 items-center justify-center rounded-full bg-destructive/10 mb-2">
          <AlertTriangle className="size-6 text-destructive" />
        </div>

        <h1 className="max-w-sm text-3xl font-bold leading-snug text-foreground sm:text-4xl">
          نعتذر، حدث أمر لم نتوقعه
        </h1>

        <p className="max-w-xs text-sm leading-relaxed text-muted-foreground sm:max-w-md sm:text-base">
          واجه النظام مشكلة طارئة، حاول مرة أخرى، وإذا استمرت المشكلة تواصل مع
          الدعم الفني.
        </p>

        {error.digest && (
          <p className="mt-2 text-xs text-muted-foreground/60 tracking-wide bg-muted px-3 py-1 rounded-md">
            رمز الخطأ: {error.digest}
          </p>
        )}
      </div>

      {/* ── Divider ──────────────────────────────────────── */}
      <div className="my-10 h-px w-16 bg-border z-10" aria-hidden />

      {/* ── CTAs ─────────────────────────────────────────── */}
      <div className="flex flex-col w-full max-w-xs sm:max-w-none sm:w-auto items-center gap-3 sm:flex-row z-10">
        <Button
          onClick={reset}
          size="lg"
          className="group gap-2 w-full sm:w-auto"
        >
          <RefreshCw className="h-4 w-4 transition-transform group-hover:rotate-180 duration-300" />
          إعادة المحاولة
        </Button>

        <Button
          asChild
          variant="outline"
          size="lg"
          className="gap-2 w-full sm:w-auto"
        >
          <Link href="/dashboard">
            <Home className="h-4 w-4" />
            العودة للوحة التحكم
          </Link>
        </Button>
      </div>

      {/* ── Footer note ──────────────────────────────────── */}
      <p className="mt-16 text-xs text-muted-foreground/50 z-10">
        نظام حلقة (مسجد ERP) · خطأ داخلي في الخادم
      </p>
    </div>
  );
}
// "use client";

// // app/error.tsx
// //
// // Next.js App Router — global Error Boundary.
// // MUST be a Client Component ("use client") because it receives
// // the `error` and `reset` props from React's error boundary.
// //
// // Catches any unhandled runtime error thrown in the render tree
// // below the root layout. For layout-level errors, use
// // app/global-error.tsx (wraps <html> + <body> itself).

// import { useEffect } from "react";
// import { Home, RefreshCw, MoveRight, AlertTriangle } from "lucide-react";
// import Link from "next/link";

// interface ErrorProps {
//   error: Error & { digest?: string };
//   reset: () => void;
// }

// export default function GlobalError({ error, reset }: ErrorProps) {
//   // Log to your error monitoring service (e.g. Sentry) here
//   useEffect(() => {
//     console.error("[GlobalError]", error);
//   }, [error]);

//   return (
//     <div
//       dir="rtl"
//       className="
//         flex min-h-dvh flex-col items-center justify-center bg-background text-foreground px-6 py-24 selection:bg-destructive/15 selection:text-destructive"
//     >
//       <p
//         aria-hidden
//         className="mb-8 select-none text-[9rem] font-black leading-none tracking-tighter text-destructive/9 sm:text-[13rem]"
//       >
//         ٥٠٠
//       </p>

//       {/* ── Copy ─────────────────────────────────────────── */}
//       <div className="flex flex-col items-center gap-4 text-center">
//         <h1 className="max-w-sm text-2xl font-bold leading-snug text-foreground sm:text-3xl">
//           نعتذر، حدث أمر لم نتوقعه
//         </h1>

//         <p className="max-w-xs text-sm leading-relaxed text-muted-foreground sm:text-base">
//           نعتذر عن هذا الخلل. حاول مرة أخرى، وإذا استمرت المشكلة تواصل مع الدعم
//           الفني.
//         </p>
//         {/*
//          * Error digest — Next.js provides a hashed digest for server errors.
//          * Showing it gives support teams a reference point without
//          * leaking sensitive stack trace details to the user.
//          */}
//         {error.digest && (
//           <p className="mt-1 text-[11px] text-muted-foreground/50 tracking-wide">
//             رمز الخطأ:{" "}
//             <span className="text-muted-foreground font-mono">
//               {error.digest}
//             </span>
//           </p>
//         )}
//       </div>

//       {/* ── Divider ──────────────────────────────────────── */}
//       <div className="my-10 h-px w-16 bg-border" aria-hidden />

//       {/* ── CTAs ─────────────────────────────────────────── */}
//       <div className="flex flex-col items-center gap-3 sm:flex-row">
//         {/*
//          * Primary: retry — attempt to re-render the segment.
//          * Next.js reset() re-runs the Server Component and clears
//          * the error boundary state.
//          */}
//         <button
//           onClick={reset}
//           className="
//             group inline-flex items-center gap-2.5
//             rounded-lg bg-primary px-5 py-2.5
//             text-sm font-semibold text-primary-foreground
//             shadow-sm transition-all duration-150
//             hover:bg-primary/90
//             focus-visible:outline-none focus-visible:ring-2
//             focus-visible:ring-ring focus-visible:ring-offset-2
//           "
//         >
//           <RefreshCw className="h-3.5 w-3.5 transition-transform group-hover:rotate-180 duration-300" />
//           إعادة المحاولة
//         </button>

//         {/* Secondary: navigate home */}
//         <Link
//           href="/dashboard"
//           className="
//             group inline-flex items-center gap-2
//             rounded-lg border border-border
//             px-5 py-2.5 text-sm font-medium
//             text-muted-foreground
//             transition-colors duration-150
//             hover:border-foreground/20 hover:text-foreground
//             focus-visible:outline-none focus-visible:ring-2
//             focus-visible:ring-ring focus-visible:ring-offset-2
//           "
//         >
//           <Home className="h-4 w-4" />
//           العودة للوحة التحكم
//           <MoveRight className="h-3.5 w-3.5 opacity-60 transition-transform group-hover:-translate-x-0.5" />
//         </Link>
//       </div>

//       {/* ── Footer note ──────────────────────────────────── */}
//       <p className="mt-16 text-[11px] text-muted-foreground/50">
//         مسجد ERP · خطأ داخلي في الخادم
//       </p>
//     </div>
//   );
// }

// -----------
// "use client";

// import { useEffect } from "react";
// import Link from "next/link";
// import { AlertTriangle, RotateCcw, Home } from "lucide-react";
// import { Button } from "@/components/ui/button";

// export default function Error({
//   error,
//   reset,
// }: {
//   error: Error & { digest?: string };
//   reset: () => void;
// }) {
//   useEffect(() => {
//     // TODO: وصله بـ error tracking service لاحقاً
//     console.error(error);
//   }, [error]);

//   return (
//     <div className="flex min-h-dvh items-center justify-center page-x-padding">
//       <div className="card-elevated flex w-full max-w-md flex-col items-center gap-4 p-6 text-center">
//         <div className="flex size-12 items-center justify-center rounded-full bg-destructive/10">
//           <AlertTriangle className="size-6 text-destructive" />
//         </div>

//         <div className="flex flex-col gap-1">
//           <h1 className="text-section-title">حدث خطأ غير متوقع</h1>
//           <p className="text-caption">
//             نعتذر عن هذا الخلل. حاول مرة أخرى، وإذا استمرت المشكلة تواصل مع الدعم الفني.
//           </p>
//         </div>

//         <div className="flex w-full gap-2">
//           <Button variant="outline" className="flex-1" asChild>
//             <Link href="/dashboard">
//               <Home className="size-4" />
//               الرئيسية
//             </Link>
//           </Button>
//           <Button className="flex-1" onClick={reset}>
//             <RotateCcw className="size-4" />
//             إعادة المحاولة
//           </Button>
//         </div>
//       </div>
//     </div>
//   );
// }
