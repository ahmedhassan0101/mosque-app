"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginInput } from "@/schemas/auth.schema";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useTransition } from "react";
import Link from "next/link";
import { FormInput } from "../form/FormInput";
import { GoogleAuth } from "./google-auth";
import { useRouter } from "next/navigation";
import { loginUser } from "@/actions/auth.actions";

export function LoginForm() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const form = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  function onSubmit(values: LoginInput) {
    startTransition(async () => {
      const result = await loginUser(values);

      // Early Return on Failure
      if (result.status !== "success") {
        toast.error(result.message);
        return;
      }

      // Success Logic
      toast.success(result.message);
      router.push("/dashboard");
      router.refresh();
    });
  }

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="space-y-4"
      dir="rtl"
    >
      <FormInput
        control={form.control}
        name="email"
        label="البريد الإلكتروني"
        type="email"
        placeholder="admin@mosque.com"
        dir="ltr"
      />

      <FormInput
        control={form.control}
        name="password"
        label="كلمة المرور"
        type="password"
      />

      <div className="text-left">
        <Link
          href="/forgot-password"
          className="text-sm text-primary hover:underline"
        >
          نسيت كلمة المرور؟
        </Link>
      </div>

      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? "جاري الدخول..." : "تسجيل الدخول"}
      </Button>
      <GoogleAuth />

      <p className="text-center text-sm text-muted-foreground">
        ليس لديك حساب؟{" "}
        <Link href="/register" className="text-primary hover:underline">
          إنشاء حساب
        </Link>
      </p>
    </form>
  );
}
