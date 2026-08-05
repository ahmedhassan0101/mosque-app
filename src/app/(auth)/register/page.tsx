// src/app/(auth)/register/page.tsx

import type { Metadata } from "next";
import { RegisterForm } from "@/components/auth/RegisterForm";

export const metadata: Metadata = {
  title: "إنشاء حساب",
};

export default function RegisterPage() {
  return <RegisterForm />;
}