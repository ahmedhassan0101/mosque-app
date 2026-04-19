"use client";

/**
 * @file components/auth/forgot-password-form.tsx
 * @description Form for requesting a password reset email.
 */

import { useEffect, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { requestPasswordReset } from "@/actions/auth.actions";

import { Button } from "@/components/ui/button";
import { Loader2, MailCheck } from "lucide-react";
import { useState } from "react";
import { FormInput } from "../form/FormInput";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  type ForgotPasswordInput,
  forgotPasswordSchema,
} from "@/schemas/auth.schema";

export function ForgotPasswordForm() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [sent, setSent] = useState(false);
  const [countdown, setCountdown] = useState(5);

  const form = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (sent && countdown > 0) {
      timer = setInterval(() => setCountdown((prev) => prev - 1), 1000);
    } else if (sent && countdown === 0) {
      router.push("/login");
    }
    return () => clearInterval(timer);
  }, [sent, countdown, router]);

  function onSubmit(values: ForgotPasswordInput) {
    startTransition(async () => {
      const result = await requestPasswordReset(values.email);

      // Early Return on Failure
      if (result.status !== "success") {
        toast.error(result.message);
        return;
      }

      // Success Logic
      toast.success(result.message);
      setSent(true);
    });
  }

  if (sent) {
    return (
      <div className="flex flex-col items-center gap-4 py-6 text-center">
        <MailCheck className="h-12 w-12 text-success animate-bounce" />
        <h3 className="text-lg font-semibold">تم إرسال الرابط!</h3>
        <p className="text-muted-foreground text-sm max-w-xs">
          إذا كان البريد مسجلاً، ستصلك رسالة قريباً.
        </p>

        <div className="mt-4 p-3 bg-muted rounded-md w-full">
          <p className="text-sm">
            سيتم تحويلك لصفحة الدخول خلال{" "}
            <span className="font-bold text-primary">{countdown}</span> ثانية...
          </p>
        </div>

        <Link
          href="/login"
          className="text-primary text-sm font-medium hover:underline"
        >
          انتقل لصفحة الدخول الآن
        </Link>
      </div>
    );
  }
  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <FormInput
        control={form.control}
        name="email"
        label="البريد الإلكتروني"
        type="email"
        placeholder="admin@mosque.com"
        dir="ltr"
      />
      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? (
          <>
            <Loader2 className="ml-2 h-4 w-4 animate-spin" />
            جارٍ الإرسال...
          </>
        ) : (
          "إرسال رابط الاستعادة"
        )}
      </Button>
    </form>
  );
}
