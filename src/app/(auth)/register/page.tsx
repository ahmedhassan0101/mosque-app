// // src\app\(auth)\register\page.tsx
// import type { Metadata } from "next";

// export const metadata: Metadata = { title: "إنشاء حساب | Masjid ERP" };

// export default function RegisterPage() {
//   return (
//     <main
//       className="flex items-center justify-center bg-background p-4"
//       dir="rtl"
//     >
//       <div className="w-full max-w-md space-y-6">
//         <div className="text-center space-y-1">
//           <h1 className="text-2xl font-bold tracking-tight">إنشاء حساب جديد</h1>
//           <p className="text-muted-foreground text-sm">أدخل بياناتك للبدء</p>
//         </div>
//         <RegisterForm />
//       </div>
//     </main>
//   );
// }

// app/(auth)/register/page.tsx
import type { Metadata } from "next";
import { AuthHeader } from "@/components/auth/AuthPrimitives";
import { RegisterForm } from "@/components/auth/RegisterForm";

export const metadata: Metadata = { title: "إنشاء حساب | مسجد ERP" };

export default function RegisterPage() {
  return (
    <>
      <AuthHeader
        title="إنشاء حساب جديد"
        description="أدخل بياناتك للبدء في استخدام النظام"
      />
      <RegisterForm />
    </>
  );
}
