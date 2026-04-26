// app/(auth)/forgot-password/page.tsx
import type { Metadata } from "next";
import { AuthHeader } from "@/components/auth/auth-primitives";
 import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";

export const metadata: Metadata = { title: "استعادة كلمة المرور | مسجد ERP" };
 
export default function ForgotPasswordPage() {
  return (
    <>
      <AuthHeader
        title="نسيت كلمة المرور؟"
        description="أدخل بريدك الإلكتروني وسنرسل لك رابط إعادة التعيين"
      />
      <ForgotPasswordForm />
    </>
  );
}
