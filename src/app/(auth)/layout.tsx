// app/(auth)/layout.tsx

import type { ReactNode } from "react";
import { ThemeToggle } from "@/components/shared/ThemeToggle";

interface AuthLayoutProps {
  children: ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    /*
      الـ auth pages: centered layout على background رمادي خفيف.
      الـ background مختلف عن الـ card color عشان الـ card يبرز.
      min-h-dvh بدل min-h-screen — يحسب الـ mobile browser bars.
    */
    <div className="relative flex min-h-dvh flex-col bg-muted/40">

      {/* Theme toggle — top-start corner, RTL-aware */}
      <div className="absolute inset-s-4 top-4 z-10">
        <ThemeToggle />
      </div>

      {/* Content — centered vertically and horizontally */}
      <main className="flex flex-1 items-center justify-center px-4 py-16">
        {children}
      </main>

      {/* Footer — minimal, مش مزعج */}
      <footer className="flex items-center justify-center gap-2 pb-6 text-xs text-muted-foreground">
        <span>نظام إدارة المسجد</span>
        <span aria-hidden="true">·</span>
        <span>جميع الحقوق محفوظة {new Date().getFullYear()}</span>
      </footer>

    </div>
  );
}