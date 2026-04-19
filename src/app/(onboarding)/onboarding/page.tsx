// src\app\onboarding\page.tsx
import { OnboardingTabs } from "@/components/onboarding/onboarding-tabs";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "إعداد المسجد | Masjid ERP" };

export default function OnboardingPage() {
  return (
    <main
      className="min-h-screen flex items-center justify-center bg-background p-4"
      dir="rtl"
    >
      <div className="w-full max-w-lg space-y-6">
        <div className="text-center space-y-1">
          <h1 className="text-2xl font-bold">إعداد حساب المسجد</h1>
          <p className="text-muted-foreground text-sm">
            قم بإنشاء مسجد جديد أو الانضمام لمسجد موجود برمز الدعوة
          </p>
        </div>
        <OnboardingTabs />
      </div>
    </main>
  );
}
