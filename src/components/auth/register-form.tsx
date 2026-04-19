"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema, type RegisterInput } from "@/schemas/auth.schema";
import { registerUser } from "@/actions/auth.actions";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import Link from "next/link";
import { FormInput } from "../form/FormInput";
import { GoogleAuth } from "./google-auth";

export function RegisterForm() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const form = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: "", email: "", password: "", confirmPassword: "" },
  });

  function onSubmit(values: RegisterInput) {
    startTransition(async () => {
      const result = await registerUser(values);

      // Early Return on Failure
      if (result.status !== "success") {
        toast.error(result.message);
        return;
      }

      // Success Logic
      toast.success(result.message);
      router.push("/onboarding");
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
        name="name"
        label="الاسم الكامل"
        placeholder="محمد أحمد"
      />
      <FormInput
        control={form.control}
        name="email"
        label="البريد الإلكتروني"
        placeholder="example@email.com"
        type="email"
      />
      <FormInput
        control={form.control}
        name="password"
        label="كلمة المرور"
        type="password"
      />
      <FormInput
        control={form.control}
        name="confirmPassword"
        label="تأكيد كلمة المرور"
        type="password"
      />
      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? "جاري الإنشاء..." : "إنشاء حساب"}
      </Button>
      <GoogleAuth />

      <p className="text-center text-sm text-muted-foreground">
        لديك حساب؟{" "}
        <Link href="/login" className="text-primary hover:underline">
          تسجيل الدخول
        </Link>
      </p>
    </form>
  );
}
