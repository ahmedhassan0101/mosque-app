"use client";

// app/error.tsx
//
// Next.js App Router — global Error Boundary.
// MUST be a Client Component ("use client") because it receives
// the `error` and `reset` props from React's error boundary.
//
// Catches any unhandled runtime error thrown in the render tree
// below the root layout. For layout-level errors, use
// app/global-error.tsx (wraps <html> + <body> itself).

import { useEffect } from "react";
import { Home, RefreshCw, MoveRight } from "lucide-react";
import Link from "next/link";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: ErrorProps) {
  // Log to your error monitoring service (e.g. Sentry) here
  useEffect(() => {
    console.error("[GlobalError]", error);
  }, [error]);

  return (
    <div
      dir="rtl"
      className="
        flex min-h-dvh flex-col items-center justify-center
        bg-background text-foreground
        px-6 py-24
        selection:bg-destructive/15 selection:text-destructive
      "
    >
      {/*
       * Visual anchor — a muted "500" anchors the layout the same way
       * the 404 page uses its numeral. Signals error severity without
       * being alarming.
       */}
      <p
        aria-hidden
        className="
          mb-8 select-none
          text-[9rem] font-black leading-none tracking-tighter
          text-destructive/6
          sm:text-[13rem]
        "
      >
        ٥٠٠
      </p>

      {/* ── Copy ─────────────────────────────────────────── */}
      <div className="flex flex-col items-center gap-4 text-center">
        {/* Eyebrow */}
        <span className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
          حدث خطأ غير متوقع
        </span>

        {/* Headline */}
        <h1 className="max-w-sm text-2xl font-bold leading-snug text-foreground sm:text-3xl">
          نعتذر، حدث أمر لم نتوقعه
        </h1>

        {/* Explanation */}
        <p className="max-w-xs text-sm leading-relaxed text-muted-foreground sm:max-w-sm sm:text-base">
          واجه النظام خطأً داخلياً أثناء معالجة طلبك. فريقنا على علم بذلك. يمكنك محاولة إعادة التحميل أو العودة للوحة التحكم.
        </p>

        {/*
         * Error digest — Next.js provides a hashed digest for server errors.
         * Showing it gives support teams a reference point without
         * leaking sensitive stack trace details to the user.
         */}
        {error.digest && (
          <p className="mt-1 font-mono text-[11px] text-muted-foreground/50 tracking-wide">
            رمز الخطأ:{" "}
            <span className="text-muted-foreground">{error.digest}</span>
          </p>
        )}
      </div>

      {/* ── Divider ──────────────────────────────────────── */}
      <div className="my-10 h-px w-16 bg-border" aria-hidden />

      {/* ── CTAs ─────────────────────────────────────────── */}
      <div className="flex flex-col items-center gap-3 sm:flex-row">
        {/*
         * Primary: retry — attempt to re-render the segment.
         * Next.js reset() re-runs the Server Component and clears
         * the error boundary state.
         */}
        <button
          onClick={reset}
          className="
            group inline-flex items-center gap-2.5
            rounded-lg bg-primary px-5 py-2.5
            text-sm font-semibold text-primary-foreground
            shadow-sm transition-all duration-150
            hover:bg-primary/90
            focus-visible:outline-none focus-visible:ring-2
            focus-visible:ring-ring focus-visible:ring-offset-2
          "
        >
          <RefreshCw className="h-3.5 w-3.5 transition-transform group-hover:rotate-180 duration-300" />
          إعادة المحاولة
        </button>

        {/* Secondary: navigate home */}
        <Link
          href="/dashboard"
          className="
            group inline-flex items-center gap-2
            rounded-lg border border-border
            px-5 py-2.5 text-sm font-medium
            text-muted-foreground
            transition-colors duration-150
            hover:border-foreground/20 hover:text-foreground
            focus-visible:outline-none focus-visible:ring-2
            focus-visible:ring-ring focus-visible:ring-offset-2
          "
        >
          <Home className="h-4 w-4" />
          العودة للوحة التحكم
          <MoveRight className="h-3.5 w-3.5 opacity-60 transition-transform group-hover:-translate-x-0.5" />
        </Link>
      </div>

      {/* ── Footer note ──────────────────────────────────── */}
      <p className="mt-16 text-[11px] text-muted-foreground/50">
        مسجد ERP · خطأ داخلي في الخادم
      </p>
    </div>
  );
}