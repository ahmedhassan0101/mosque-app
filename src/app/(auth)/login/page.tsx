// src\app\(auth)\login\page.tsx
import { LoginForm } from "@/components/auth/login-form";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "تسجيل الدخول | Masjid ERP" };

export default function LoginPage() {
  return (
    <main
      className=" flex items-center justify-center bg-background p-4"
    >
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-1">
          <h1 className="text-2xl font-bold">تسجيل الدخول</h1>
          <p className="text-muted-foreground text-sm">
            مرحباً بك في Masjid ERP
          </p>
        </div>
        <LoginForm />
      </div>
    </main>
  );
}