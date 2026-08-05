// src/components/auth/ForgotPasswordForm.tsx
"use client";

import { useTransition, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { MailCheck } from "lucide-react";
import Link from "next/link";

import {
  type ForgotPasswordInput,
  forgotPasswordSchema,
} from "@/schemas/auth.schema";
import { requestPasswordReset } from "@/actions/auth.actions";
import { useCountdown } from "@/hooks/use-countdown";

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
import { Alert, AlertDescription } from "../ui/alert";

export function ForgotPasswordForm() {
  const [isPending, startTransition] = useTransition();
  const [sentEmail, setSentEmail] = useState<string | null>(null);
  const { seconds, start, isActive } = useCountdown(60);

  const form = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  function onSubmit(values: ForgotPasswordInput) {
    startTransition(async () => {
      const result = await requestPasswordReset(values.email);
      if (result.status !== "success") {
        toast.error(result.message);
        return;
      }
      setSentEmail(values.email);
      start(60);
    });
  }

  /* ── State 2: Email Sent ──────────────────────────────────────
  */
  if (sentEmail) {
    return (
      <Card className="w-full max-w-md animate-scale-in">
        <CardHeader>
          <CardSysLabel>نظام إدارة المسجد</CardSysLabel>
          <div className="flex flex-col gap-1 pt-2">
            <CardTitle>تفقّد بريدك الإلكتروني</CardTitle>
            <CardDescription>
              أرسلنا رابط الاستعادة إلى{" "}
              {/* الإيميل بـ dir="ltr" عشان يظهر صح */}
              <span dir="ltr" className="font-medium text-foreground">
                {sentEmail}
              </span>
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent>
          <div className="flex flex-col gap-5">
            {/* Icon block — بسيط ووظيفي */}
            {/* <div className="flex items-center gap-3 rounded-md border border-border bg-muted/40 p-4">
              <MailCheck
                size={20}
                className="shrink-0 text-success"
                aria-hidden="true"
              />
              <p className="text-sm text-muted-foreground leading-relaxed">
              </p>
            </div> */}
            <Alert variant="success">
              <MailCheck />
              <AlertDescription>
                قد يصل إلى صندوق البريد العشوائي — تحقق منه لو ما وصلك الإيميل
              </AlertDescription>
            </Alert>

            {/* Resend — disabled أثناء الـ countdown */}
            <Button
              variant="secondary"
              className="w-full"
              disabled={isActive || isPending}
              onClick={() => onSubmit({ email: sentEmail })}
            >
              {isActive
                ? `إعادة الإرسال بعد ${seconds} ثانية`
                : "إعادة إرسال الرابط"}
            </Button>
          </div>
        </CardContent>

        <CardFooter className="justify-center">
          <Button
            variant="link"
            size="sm"
            asChild
          >
            <Link href="/login">العودة لتسجيل الدخول</Link>
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
          <CardTitle>نسيت كلمة المرور؟</CardTitle>
          <CardDescription>
            أدخل بريدك الإلكتروني وسنرسل لك رابط إعادة التعيين
          </CardDescription>
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
            name="email"
            label="البريد الإلكتروني"
            type="email"
            placeholder="admin@mosque.com"
            dir="ltr"
            disabled={isPending}
          />

          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? "جارٍ الإرسال..." : "إرسال رابط الاستعادة"}
          </Button>
        </form>
      </CardContent>

      <CardFooter className="justify-center">
        <p className="text-xs text-muted-foreground">
          تذكرت كلمة المرور؟{" "}
          <Link
            href="/login"
            className="font-medium text-foreground underline-offset-4 hover:underline"
          >
            تسجيل الدخول
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
// app/(auth)/forgot-password/forgot-password-form.tsx
// "use client";

// import { useTransition, useState } from "react";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { toast } from "sonner";
// import { MailCheck, Loader2 } from "lucide-react";
// import Link from "next/link";

// import {
//   type ForgotPasswordInput,
//   forgotPasswordSchema,
// } from "@/schemas/auth.schema";
// import { requestPasswordReset } from "@/actions/auth.actions";
// import { useCountdown } from "@/hooks/use-countdown";
// import { Button } from "@/temp/button";
// import { AuthCard, AuthFooter } from "@/components/auth/AuthPrimitives";
// import { FormInput } from "../form/FormInput";

// export function ForgotPasswordForm() {
//   const [isPending, startTransition] = useTransition();
//   const [sentEmail, setSentEmail] = useState<string | null>(null);
//   const { seconds, start, isActive } = useCountdown(60);

//   const form = useForm<ForgotPasswordInput>({
//     resolver: zodResolver(forgotPasswordSchema),
//     defaultValues: { email: "" },
//   });

//   function onSubmit(values: ForgotPasswordInput) {
//     startTransition(async () => {
//       const result = await requestPasswordReset(values.email);
//       if (result.status !== "success") {
//         toast.error(result.message);
//         return;
//       }
//       toast.success(result.message);
//       setSentEmail(values.email);
//       start(60);
//     });
//   }

//   // ── Sent state ────────────────────────────────────────────────
//   if (sentEmail) {
//     return (
//       <AuthCard className="text-center">
//         <div className="flex justify-center mb-4">
//           <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
//             <MailCheck className="h-7 w-7 text-primary" />
//           </div>
//         </div>
//         <h2 className="text-base font-semibold text-foreground mb-1">
//           تفقّد بريدك الإلكتروني
//         </h2>
//         <p className="text-sm text-muted-foreground mb-5 leading-relaxed">
//           أرسلنا رابط الاستعادة إلى{" "}
//           <span className="font-medium text-foreground" dir="ltr">
//             {sentEmail}
//           </span>
//         </p>
//         <Button
//           variant="outline"
//           className="w-full"
//           disabled={isActive || isPending}
//           onClick={() => onSubmit({ email: sentEmail })}
//         >
//           {isActive ? `إعادة الإرسال بعد ${seconds}ث` : "إعادة إرسال الرابط"}
//         </Button>

//         <AuthFooter>
//           <Link
//             href="/login"
//             className="font-medium text-primary hover:underline"
//           >
//             العودة لتسجيل الدخول
//           </Link>
//         </AuthFooter>
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
//           name="email"
//           label="البريد الإلكتروني"
//           type="email"
//           placeholder="admin@mosque.com"
//           dir="ltr"
//         />
//         <Button type="submit" className="w-full" size="lg" disabled={isPending}>
//           {isPending ? (
//             <>
//               <Loader2 className="h-4 w-4 animate-spin" />
//               جارٍ الإرسال...
//             </>
//           ) : (
//             "إرسال رابط الاستعادة"
//           )}
//         </Button>
//       </form>

//       <AuthFooter>
//         تذكرت كلمة المرور؟{" "}
//         <Link
//           href="/login"
//           className="font-medium text-primary hover:underline"
//         >
//           تسجيل الدخول
//         </Link>
//       </AuthFooter>
//     </AuthCard>
//   );
// }
