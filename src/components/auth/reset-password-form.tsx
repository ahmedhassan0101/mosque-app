// "use client";

// /**
//  * @file components/auth/reset-password-form.tsx
//  * @description Form to set a new password using the token from the URL.
//  */

// import { useState, useTransition } from "react";
// // import { useRouter } from "next/navigation";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { toast } from "sonner";

// import { Button } from "@/components/ui/button";
// import { CheckCircle2, Loader2 } from "lucide-react";
// import { FormInput } from "../form/FormInput";
// import { resetPassword } from "@/actions/auth.actions";
// import {
//   type ResetPasswordFormInput,
//   resetPasswordFormSchema,
// } from "@/schemas/auth.schema";
// import { RedirectTimer } from "./redirect-timer";

// interface ResetPasswordFormProps {
//   /** JWT reset token extracted from the URL search params in the page component */
//   token: string;
// }

// export function ResetPasswordForm({ token }: ResetPasswordFormProps) {
//   // const router = useRouter();
//   const [isPending, startTransition] = useTransition();
//   const [isSuccess, setIsSuccess] = useState(false);

//   const form = useForm<ResetPasswordFormInput>({
//     resolver: zodResolver(resetPasswordFormSchema),
//     defaultValues: { password: "", confirmPassword: "" },
//   });

//   function onSubmit(values: ResetPasswordFormInput) {
//     startTransition(async () => {
//       const result = await resetPassword(token, values.password);

//       // Early Return on Failure
//       if (result.status !== "success") {
//         toast.error(result.message);
//         return;
//       }

//       // Success Logic
//       // toast.success(result.message);
//       // router.push("/login?reset=true");
//       setIsSuccess(true);
//     });
//   }

//     if (isSuccess) {
//     return (
//       <div className="text-center space-y-4">
//         <div className="flex justify-center text-success">
//           <CheckCircle2 className="h-12 w-12 animate-bounce" />
//         </div>
//         <h3 className="text-lg font-bold">تم تغيير كلمة المرور بنجاح</h3>
//         <p className="text-sm text-muted-foreground">
//           يمكنك الآن استخدام كلمة المرور الجديدة لتسجيل الدخول
//         </p>
//         <RedirectTimer href="/login" seconds={5} />
//       </div>
//     );
//   }

//   return (
//     <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
//       <FormInput
//         control={form.control}
//         name="password"
//         label="كلمة المرور الجديدة"
//         type="password"
//         // autoComplete="new-password"
//       />
//       <FormInput
//         control={form.control}
//         name="confirmPassword"
//         label="تأكيد كلمة المرور"
//         type="password"
//         // autoComplete="new-password"
//       />

//       <Button type="submit" className="w-full" disabled={isPending}>
//         {isPending ? (
//           <>
//             <Loader2 className="ml-2 h-4 w-4 animate-spin" />
//             جارٍ الحفظ...
//           </>
//         ) : (
//           "حفظ كلمة المرور الجديدة"
//         )}
//       </Button>
//     </form>
//   );
// }

// app/(auth)/reset-password/reset-password-form.tsx
"use client";

import { useTransition, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { CheckCircle2, Loader2 } from "lucide-react";
import Link from "next/link";

import {
  type ResetPasswordFormInput,
  resetPasswordFormSchema,
} from "@/schemas/auth.schema";
import { resetPassword } from "@/actions/auth.actions";
import { RedirectTimer } from "@/components/auth/redirect-timer";
import { Button } from "@/components/ui/button";
import { AuthCard, AuthFooter } from "@/components/auth/auth-primitives";
import { FormInput } from "../form/FormInput";

interface ResetPasswordFormProps {
  token: string;
}

export function ResetPasswordForm({ token }: ResetPasswordFormProps) {
  const [isPending, startTransition] = useTransition();
  const [isSuccess, setIsSuccess] = useState(false);

  const form = useForm<ResetPasswordFormInput>({
    resolver: zodResolver(resetPasswordFormSchema),
    defaultValues: { password: "", confirmPassword: "" },
  });

  function onSubmit(values: ResetPasswordFormInput) {
    startTransition(async () => {
      const result = await resetPassword(token, values.password);
      if (result.status !== "success") {
        toast.error(result.message);
        return;
      }
      setIsSuccess(true);
    });
  }

  // ── Success state ─────────────────────────────────────────────
  if (isSuccess) {
    return (
      <AuthCard className="text-center space-y-4">
        <div className="flex justify-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-success/10">
            <CheckCircle2 className="h-7 w-7 text-success" />
          </div>
        </div>
        <div>
          <h2 className="text-base font-semibold text-foreground mb-1">
            تم تغيير كلمة المرور بنجاح
          </h2>
          <p className="text-sm text-muted-foreground">
            يمكنك الآن تسجيل الدخول بكلمة المرور الجديدة.
          </p>
        </div>
        <RedirectTimer href="/login?reset=true" seconds={5} />
      </AuthCard>
    );
  }

  // ── Default form state ────────────────────────────────────────
  return (
    <AuthCard>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4"
        noValidate
      >
        <FormInput
          control={form.control}
          name="password"
          label="كلمة المرور الجديدة"
          type="password"
        />
        <FormInput
          control={form.control}
          name="confirmPassword"
          label="تأكيد كلمة المرور"
          type="password"
        />
        <Button type="submit" className="w-full" size="lg" disabled={isPending}>
          {isPending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              جارٍ الحفظ...
            </>
          ) : (
            "حفظ كلمة المرور الجديدة"
          )}
        </Button>
      </form>

      <AuthFooter>
        <Link
          href="/login"
          className="font-medium text-primary hover:underline"
        >
          العودة لتسجيل الدخول
        </Link>
      </AuthFooter>
    </AuthCard>
  );
}
