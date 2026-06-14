// app/(auth)/reset-password/page.tsx
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { AuthHeader } from "@/components/auth/AuthPrimitives";
import { ResetPasswordForm } from "@/components/auth/ResetPasswordForm";

export const metadata: Metadata = { title: "تعيين كلمة مرور جديدة | مسجد ERP" };

interface ResetPasswordPageProps {
  searchParams: Promise<{ token?: string }>;
}

export default async function ResetPasswordPage({
  searchParams,
}: ResetPasswordPageProps) {
  const { token } = await searchParams;
  if (!token) redirect("/forgot-password");

  return (
    <>
      <AuthHeader
        title="تعيين كلمة مرور جديدة"
        description="اختر كلمة مرور قوية لتأمين حسابك"
      />
      <ResetPasswordForm token={token} />
    </>
  );
}
