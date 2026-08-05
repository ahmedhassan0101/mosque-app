// src/components/auth/ResetPasswordForm.tsx
"use client";

import { useTransition, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { CheckCircle2 } from "lucide-react";
import Link from "next/link";

import {
  type ResetPasswordFormInput,
  resetPasswordFormSchema,
} from "@/schemas/auth.schema";
import { resetPassword } from "@/actions/auth.actions";
import { RedirectTimer } from "@/components/auth/RedirectTimer";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardSysLabel,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { FormInput } from "@/components/form/FormInput";

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

  /* ── State 2: Success ─────────────────────────────────────────
     تم التغيير — redirect تلقائي بعد 5 ثوان
     RedirectTimer موجود مسبقاً في المشروع
  */
  if (isSuccess) {
    return (
      <Card className="w-full max-w-md animate-scale-in">
        <CardHeader>
          <CardSysLabel>نظام إدارة المسجد</CardSysLabel>
          <div className="flex flex-col gap-1 pt-2">
            <CardTitle>تم التغيير بنجاح</CardTitle>
            <CardDescription>
              يمكنك الآن تسجيل الدخول بكلمة المرور الجديدة
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent>
          <div className="flex flex-col gap-5">
            {/* Success indicator */}
            <div className="flex items-center gap-3 rounded-md border border-success/20 bg-success/5 p-4">
              <CheckCircle2
                size={20}
                className="shrink-0 text-success"
                aria-hidden="true"
              />
              <p className="text-sm text-success leading-relaxed">
                تم تغيير كلمة المرور بنجاح
              </p>
            </div>

            {/* Redirect timer — component موجود في المشروع */}
            <RedirectTimer href="/login?reset=true" seconds={5} />
          </div>
        </CardContent>

        <CardFooter className="justify-center">
          <Button
            variant="link"
            size="sm"
            className="h-auto p-0 text-xs text-muted-foreground hover:text-foreground"
            asChild
          >
            <Link href="/login">تسجيل الدخول الآن</Link>
          </Button>
        </CardFooter>
      </Card>
    );
  }

  /* ── State 1: Form ────────────────────────────────────────────
   */
  return (
    <Card className="w-full max-w-md animate-scale-in">
      <CardHeader>
        <CardSysLabel>نظام إدارة المسجد</CardSysLabel>
        <div className="flex flex-col gap-1 pt-2">
          <CardTitle>تعيين كلمة مرور جديدة</CardTitle>
          <CardDescription>اختر كلمة مرور قوية لتأمين حسابك</CardDescription>
        </div>
      </CardHeader>

      <CardContent>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          noValidate
          className="flex flex-col gap-4"
        >
          <FormInput
            control={form.control}
            name="password"
            label="كلمة المرور الجديدة"
            type="password"
            autoComplete="new-password"
            description="يجب أن تكون 8 أحرف على الأقل"
            disabled={isPending}
          />

          <FormInput
            control={form.control}
            name="confirmPassword"
            label="تأكيد كلمة المرور"
            type="password"
            autoComplete="new-password"
            disabled={isPending}
          />

          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? "جارٍ الحفظ..." : "حفظ كلمة المرور الجديدة"}
          </Button>
        </form>
      </CardContent>

      <CardFooter className="justify-center">
        <Button
          variant="link"
          size="sm"
          className="h-auto p-0 text-xs text-muted-foreground hover:text-foreground"
          asChild
        >
          <Link href="/login">العودة لتسجيل الدخول</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
// // app/(auth)/reset-password/reset-password-form.tsx
// "use client";

// import { useTransition, useState } from "react";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { toast } from "sonner";
// import { CheckCircle2, Loader2 } from "lucide-react";
// import Link from "next/link";

// import {
//   type ResetPasswordFormInput,
//   resetPasswordFormSchema,
// } from "@/schemas/auth.schema";
// import { resetPassword } from "@/actions/auth.actions";
// import { RedirectTimer } from "@/components/auth/RedirectTimer";
// import { Button } from "@/temp/button";
// import { AuthCard, AuthFooter } from "@/components/auth/AuthPrimitives";
// import { FormInput } from "../form/FormInput";

// interface ResetPasswordFormProps {
//   token: string;
// }

// export function ResetPasswordForm({ token }: ResetPasswordFormProps) {
//   const [isPending, startTransition] = useTransition();
//   const [isSuccess, setIsSuccess] = useState(false);

//   const form = useForm<ResetPasswordFormInput>({
//     resolver: zodResolver(resetPasswordFormSchema),
//     defaultValues: { password: "", confirmPassword: "" },
//   });

//   function onSubmit(values: ResetPasswordFormInput) {
//     startTransition(async () => {
//       const result = await resetPassword(token, values.password);
//       if (result.status !== "success") {
//         toast.error(result.message);
//         return;
//       }
//       setIsSuccess(true);
//     });
//   }

//   // ── Success state ─────────────────────────────────────────────
//   if (isSuccess) {
//     return (
//       <AuthCard className="text-center space-y-4">
//         <div className="flex justify-center">
//           <div className="flex h-14 w-14 items-center justify-center rounded-full bg-success/10">
//             <CheckCircle2 className="h-7 w-7 text-success" />
//           </div>
//         </div>
//         <div>
//           <h2 className="text-base font-semibold text-foreground mb-1">
//             تم تغيير كلمة المرور بنجاح
//           </h2>
//           <p className="text-sm text-muted-foreground">
//             يمكنك الآن تسجيل الدخول بكلمة المرور الجديدة.
//           </p>
//         </div>
//         <RedirectTimer href="/login?reset=true" seconds={5} />
//       </AuthCard>
//     );
//   }

//   // ── Default form state ────────────────────────────────────────
//   return (
//     <AuthCard>
//       <form
//         onSubmit={form.handleSubmit(onSubmit)}
//         className="space-y-4"
//         noValidate
//       >
//         <FormInput
//           control={form.control}
//           name="password"
//           label="كلمة المرور الجديدة"
//           type="password"
//         />
//         <FormInput
//           control={form.control}
//           name="confirmPassword"
//           label="تأكيد كلمة المرور"
//           type="password"
//         />
//         <Button type="submit" className="w-full" size="lg" disabled={isPending}>
//           {isPending ? (
//             <>
//               <Loader2 className="h-4 w-4 animate-spin" />
//               جارٍ الحفظ...
//             </>
//           ) : (
//             "حفظ كلمة المرور الجديدة"
//           )}
//         </Button>
//       </form>

//       <AuthFooter>
//         <Link
//           href="/login"
//           className="font-medium text-primary hover:underline"
//         >
//           العودة لتسجيل الدخول
//         </Link>
//       </AuthFooter>
//     </AuthCard>
//   );
// }
