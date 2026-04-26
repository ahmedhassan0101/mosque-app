// // src\app\onboarding\page.tsx
// import { OnboardingTabs } from "@/components/onboarding/onboarding-tabs";
// import type { Metadata } from "next";

// export const metadata: Metadata = { title: "إعداد المسجد | Masjid ERP" };

// export default function OnboardingPage() {
//   return (
//     <main
//       className="min-h-screen flex items-center justify-center bg-background p-4"
//       dir="rtl"
//     >
//       <div className="w-full max-w-lg space-y-6">
//         <div className="text-center space-y-1">
//           <h1 className="text-2xl font-bold">إعداد حساب المسجد</h1>
//           <p className="text-muted-foreground text-sm">
//             قم بإنشاء مسجد جديد أو الانضمام لمسجد موجود برمز الدعوة
//           </p>
//         </div>
//         <OnboardingTabs />
//       </div>
//     </main>
//   );
// }


// app/(auth)/onboarding/page.tsx
//
// Onboarding sits outside the dashboard (no sidebar) but shares
// the auth layout split-screen structure. The user has authenticated
// but hasn't linked a mosque yet.
 
import type { Metadata } from "next";
import { AuthHeader } from "@/components/auth/auth-primitives";
import { OnboardingTabs } from "@/components/onboarding/onboarding-tabs";
import AuthLayout from "@/app/(auth)/layout";
 
export const metadata: Metadata = { title: "إعداد المسجد | مسجد ERP" };
 
export default function OnboardingPage() {
  return (
    <AuthLayout>
      <AuthHeader
        title="مرحباً! لنبدأ الإعداد"
        description="أنشئ مسجدك الجديد أو انضم لمسجد قائم برمز الدعوة"
      />
      <OnboardingTabs />
    </AuthLayout>
  );
}
