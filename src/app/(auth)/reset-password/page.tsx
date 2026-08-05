// app/(auth)/reset-password/page.tsx
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { ResetPasswordForm } from "@/components/auth/ResetPasswordForm";

export const metadata: Metadata = {
  title: "تعيين كلمة مرور جديدة",
};

interface ResetPasswordPageProps {
  searchParams: Promise<{ token?: string }>;
}

export default async function ResetPasswordPage({
  searchParams,
}: ResetPasswordPageProps) {
  const { token } = await searchParams;

  if (!token) redirect("/forgot-password");

  return <ResetPasswordForm token={token} />;
}
