// // src\app\(auth)\login\page.tsx
// import type { Metadata } from "next";

// import { Suspense } from "react";

// export const metadata: Metadata = { title: "تسجيل الدخول | Masjid ERP" };

// export default function LoginPage() {
//   return (
//     <main className=" flex items-center justify-center bg-background p-4">
//       <div className="w-full max-w-md space-y-6">
//         <div className="text-center space-y-1">
//           <h1 className="text-2xl font-bold">تسجيل الدخول</h1>
//           <p className="text-muted-foreground text-sm">
//             مرحباً بك في Masjid ERP
//           </p>
//         </div>
//         <Suspense fallback={<div>جاري التحميل...</div>}>
//           <LoginForm />
//         </Suspense>
//       </div>
//     </main>
//   );
// }
// app/(auth)/login/page.tsx
import { Suspense } from "react";
import type { Metadata } from "next";
import { AuthHeader } from "@/components/auth/AuthPrimitives";
import { LoginForm } from "@/components/auth/LoginForm";

export const metadata: Metadata = { title: "تسجيل الدخول | مسجد ERP" };

export default function LoginPage() {
  return (
    <>
      <AuthHeader
        title="أهلاً بك مجدداً"
        description="أدخل بياناتك للوصول إلى لوحة التحكم"
      />
      <Suspense>
        <LoginForm />
      </Suspense>
    </>
  );
}
