// app/(auth)/layout.tsx
//
// Unified Auth Shell — Split-Screen Architecture
//
// Left panel (hidden < lg): Static brand panel — identity, values, trust signals.
// Right panel: Form area — clean, centered, padded.
//
// Every auth page (login, register, forgot-password, etc.) drops its content
// as `children` into the right panel. No page needs to re-implement centering
// or the brand visual.
//
// Server Component — no "use client" needed.

import type { ReactNode } from "react";
import { School  } from "lucide-react";

interface AuthLayoutProps {
  children: ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div dir="rtl" className="flex min-h-dvh bg-background">
      {/* ── Left brand panel (desktop only) ─────────────────────────────── */}
      <aside
        aria-hidden
        className="
          hidden lg:flex lg:w-[42%] xl:w-[38%]
          flex-col justify-between
          bg-sidebar border-e border-sidebar-border
          px-12 py-10
          relative overflow-hidden
          select-none
        "
      >
        {/* Subtle geometric background pattern */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage: `
              radial-gradient(circle at 1px 1px, var(--color-border) 1px, transparent 0)
            `,
            backgroundSize: "32px 32px",
          }}
        />

        {/* Top: Logo */}
        <div className="relative flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <School className="h-4.5 w-4.5" />
          </div>
          <span className="text-[15px] font-bold text-sidebar-foreground tracking-tight">
            مسجد <span className="text-primary">ERP</span>
          </span>
        </div>

        {/* Middle: hero copy */}
        <div className="relative space-y-6">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            إدارة المساجد والمراكز التعليمية
          </p>
          <h2 className="text-3xl font-black leading-snug text-sidebar-foreground xl:text-4xl">
            تفرّغ لرسالتك،{" "}
            <span className="text-primary">ودع الإدارة لنا.</span>
          </h2>
          <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">
            منصة سحابية تجمع الطلاب، المالية، والحضور في لوحة تحكم واحدة هادئة ومتقنة.
          </p>

          {/* Trust signals */}
          <div className="flex flex-col gap-3 pt-2">
            {[
              "متابعة تقدم الحفظ لكل طالب",
              "تقارير مالية تلقائية لحظية",
              "نظام مكافآت يحفّز الطلاب",
            ].map((point) => (
              <div key={point} className="flex items-center gap-2.5 text-sm text-muted-foreground">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/15">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                </span>
                {point}
              </div>
            ))}
          </div>
        </div>

        {/* Bottom: social proof */}
        <div className="relative">
          <div className="rounded-xl border border-sidebar-border bg-background/50 p-4 backdrop-blur-sm">
            <p className="text-xs text-muted-foreground leading-relaxed">
              أصبح الإداريون يوفّرون ساعتين يومياً على الأقل مع نظام مسجد.
            </p>
            <p className="mt-2 text-[11px] font-semibold text-foreground">
              — مدير مركز تحفيظ القرآن، الرياض
            </p>
          </div>
          <p className="mt-4 text-[10px] text-muted-foreground/50">
            © {new Date().getFullYear()} مسجد ERP · جميع الحقوق محفوظة
          </p>
        </div>
      </aside>

      {/* ── Right form panel ──────────────────────────────────────────────── */}
      <main className="flex flex-1 flex-col items-center justify-center px-5 py-12 sm:px-8">
        {/* Mobile logo — only shown < lg */}
        <div className="mb-8 flex items-center gap-2.5 lg:hidden">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <School className="h-4 w-4" />
          </div>
          <span className="text-[14px] font-bold text-foreground">
            مسجد <span className="text-primary">ERP</span>
          </span>
        </div>

        {/* Page content slot — each page provides title + form */}
        <div className="w-full max-w-88 sm:max-w-sm">
          {children}
        </div>
      </main>
    </div>
  );
}