// "use client";

// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";

// import { Button } from "@/components/ui/button";
// import { toast } from "sonner";
// import { useTransition } from "react";
// import Link from "next/link";
// import { GoogleAuth } from "./google-auth";
// import { useRouter, useSearchParams } from "next/navigation";
// import { loginUser } from "@/actions/auth.actions";
// import { CheckCircle2 } from "lucide-react";

// export function LoginForm() {
//   const router = useRouter();
//   const searchParams = useSearchParams();
//   const [isPending, startTransition] = useTransition();

//   const isVerified = searchParams.get("verified") === "true";
//   const isReset = searchParams.get("reset") === "true";

//   const form = useForm<LoginInput>({
//     resolver: zodResolver(loginSchema),
//     defaultValues: { email: "", password: "" },
//   });

//   function onSubmit(values: LoginInput) {
//     startTransition(async () => {
//       const result = await loginUser(values);

//       // Early Return on Failure
//       if (result.status !== "success") {
//         toast.error(result.message);
//         return;
//       }

//       // Success Logic
//       toast.success(result.message);
//       router.push("/dashboard");
//       router.refresh();
//     });
//   }

//   return (
//     <form
//       onSubmit={form.handleSubmit(onSubmit)}
//       className="space-y-4"
//       dir="rtl"
//     >
//       {isVerified && (
//         <div className="flex items-center gap-3 rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-800 dark:border-green-900/50 dark:bg-green-900/20 dark:text-green-400">
//           <CheckCircle2 className="h-5 w-5 shrink-0" />
//           <p>تم التحقق من بريدك الإلكتروني بنجاح! يمكنك الآن تسجيل الدخول.</p>
//         </div>
//       )}
//       {isReset && (
//         <div className="flex items-center gap-3 rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-800 dark:border-green-900/50 dark:bg-green-900/20 dark:text-green-400">
//           <CheckCircle2 className="h-5 w-5 shrink-0" />
//           <p>
//             تم تغيير كلمة المرور بنجاح! يرجى تسجيل الدخول بكلمة المرور الجديدة.
//           </p>
//         </div>
//       )}
//       <FormInput
//         control={form.control}
//         name="email"
//         label="البريد الإلكتروني"
//         type="email"
//         placeholder="admin@mosque.com"
//         dir="ltr"
//       />

//       <FormInput
//         control={form.control}
//         name="password"
//         label="كلمة المرور"
//         type="password"
//       />

//       <div className="text-left">
//         <Link
//           href="/forgot-password"
//           className="text-sm text-primary hover:underline"
//         >
//           نسيت كلمة المرور؟
//         </Link>
//       </div>

//       <Button type="submit" className="w-full" disabled={isPending}>
//         {isPending ? "جاري الدخول..." : "تسجيل الدخول"}
//       </Button>
//       <GoogleAuth />

//       <p className="text-center text-sm text-muted-foreground">
//         ليس لديك حساب؟{" "}
//         <Link href="/register" className="text-primary hover:underline">
//           إنشاء حساب
//         </Link>
//       </p>
//     </form>
//   );
// }

// app/(auth)/login/login-form.tsx

"use client";

import { useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import Link from "next/link";

// import { loginSchema, type LoginInput } from "@/lib/validations/auth";
import { loginUser } from "@/actions/auth.actions";
import { Button } from "@/components/ui/button";
// import { FormInput } from "@/components/auth/form-input";
import { GoogleAuth } from "@/components/auth/GoogleAuth";
import {
  AuthCard,
  AuthAlert,
  AuthFooter,
} from "@/components/auth/AuthPrimitives";
import { loginSchema, type LoginInput } from "@/schemas/auth.schema";
import { FormInput } from "../form/FormInput";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const isVerified = searchParams.get("verified") === "true";
  const isReset = searchParams.get("reset") === "true";

  const form = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  function onSubmit(values: LoginInput) {
    startTransition(async () => {
      const result = await loginUser(values);
      if (result.status !== "success") {
        toast.error(result.message);
        return;
      }
      toast.success(result.message);
      router.push("/dashboard");
      router.refresh();
    });
  }

  return (
    <AuthCard>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4"
        noValidate
      >
        {/* Contextual success banners */}
        {isVerified && (
          <AuthAlert
            type="success"
            message="تم التحقق من بريدك الإلكتروني بنجاح! يمكنك الآن تسجيل الدخول."
          />
        )}
        {isReset && (
          <AuthAlert
            type="success"
            message="تم تغيير كلمة المرور بنجاح. يرجى تسجيل الدخول بكلمة المرور الجديدة."
          />
        )}

        <FormInput
          control={form.control}
          name="email"
          label="البريد الإلكتروني"
          type="email"
          placeholder="admin@mosque.com"
          dir="ltr"
        />

        {/* Password row with inline "forgot" link */}
        <div className="space-y-1">
          <FormInput
            control={form.control}
            name="password"
            label="كلمة المرور"
            type="password"
          />
          <div className="flex justify-start">
            <Link
              href="/forgot-password"
              className="text-xs text-muted-foreground hover:text-primary transition-colors"
            >
              نسيت كلمة المرور؟
            </Link>
          </div>
        </div>

        <Button type="submit" className="w-full" size="lg" disabled={isPending}>
          {isPending ? "جارٍ الدخول..." : "تسجيل الدخول"}
        </Button>

        <GoogleAuth />
      </form>

      <AuthFooter>
        ليس لديك حساب؟{" "}
        <Link
          href="/register"
          className="font-medium text-primary hover:underline"
        >
          إنشاء حساب
        </Link>
      </AuthFooter>
    </AuthCard>
  );
}
