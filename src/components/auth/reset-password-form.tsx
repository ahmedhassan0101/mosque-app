"use client";

/**
 * @file components/auth/reset-password-form.tsx
 * @description Form to set a new password using the token from the URL.
 */

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { FormInput } from "../form/FormInput";
import { resetPassword } from "@/actions/auth.actions";
import {
  type ResetPasswordFormInput,
  resetPasswordFormSchema,
} from "@/schemas/auth.schema";

interface ResetPasswordFormProps {
  /** JWT reset token extracted from the URL search params in the page component */
  token: string;
}

export function ResetPasswordForm({ token }: ResetPasswordFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const form = useForm<ResetPasswordFormInput>({
    resolver: zodResolver(resetPasswordFormSchema),
    defaultValues: { password: "", confirmPassword: "" },
  });

  function onSubmit(values: ResetPasswordFormInput) {
    startTransition(async () => {
      const result = await resetPassword(token, values.password);

      // Early Return on Failure
      if (result.status !== "success") {
        toast.error(result.message);
        return;
      }

      // Success Logic
      toast.success(result.message);
      router.push("/login");
    });
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <FormInput
        control={form.control}
        name="password"
        label="كلمة المرور الجديدة"
        type="password"
        // autoComplete="new-password"
      />
      <FormInput
        control={form.control}
        name="confirmPassword"
        label="تأكيد كلمة المرور"
        type="password"
        // autoComplete="new-password"
      />

      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? (
          <>
            <Loader2 className="ml-2 h-4 w-4 animate-spin" />
            جارٍ الحفظ...
          </>
        ) : (
          "حفظ كلمة المرور الجديدة"
        )}
      </Button>
    </form>
  );
}
