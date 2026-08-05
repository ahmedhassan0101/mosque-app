// src/app/(auth)/login/page.tsx

import { Suspense } from "react";
import type { Metadata } from "next";
import { LoginForm } from "@/components/auth/LoginForm";

export const metadata: Metadata = {
  title: "تسجيل الدخول",
};

export default function LoginPage() {
  return (
    // Suspense مطلوب لأن LoginForm يستخدم useSearchParams()
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}