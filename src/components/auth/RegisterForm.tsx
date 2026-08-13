// src/components/auth/RegisterForm.tsx
"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import Link from "next/link";

import { registerUser } from "@/actions/auth.actions";
import { registerSchema, type RegisterInput } from "@/schemas/auth.schema";

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
import { GoogleAuth } from "@/components/auth/GoogleAuth";

export function RegisterForm() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const form = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  function onSubmit(values: RegisterInput) {
    startTransition(async () => {
      const result = await registerUser(values);
      if (result.status !== "success") {
        toast.error(result.message);
        return;
      }
      toast.success(result.message);
      router.push(
        `/waiting-verification?email=${encodeURIComponent(values.email)}`,
      );
    });
  }

  return (
    <Card className="container-auth animate-scale-in">
      {/* ── Header ─────────────────────────────────────────────── */}
      <CardHeader>
        <CardSysLabel>نظام إدارة المسجد</CardSysLabel>
        <div className="flex flex-col gap-1 pt-2">
          <CardTitle>إنشاء حساب جديد</CardTitle>
          <CardDescription>
            أدخل بياناتك للبدء في استخدام النظام
          </CardDescription>
        </div>
      </CardHeader>

      {/* ── Content ────────────────────────────────────────────── */}
      <CardContent>
        <div className="flex flex-col gap-5">
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            noValidate
            className="flex flex-col gap-4"
          >
            <FormInput
              control={form.control}
              name="name"
              label="الاسم الكامل"
              placeholder="محمد أحمد"
              disabled={isPending}
            />

            <FormInput
              control={form.control}
              name="email"
              label="البريد الإلكتروني"
              type="email"
              placeholder="example@email.com"
              dir="ltr"
              disabled={isPending}
            />

            <FormInput
              control={form.control}
              name="password"
              label="كلمة المرور"
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
              {isPending ? "جارٍ إنشاء الحساب..." : "إنشاء الحساب"}
            </Button>
          </form>

          <div className="divider-label">أو</div>

          <GoogleAuth />
        </div>
      </CardContent>

      {/* ── Footer ─────────────────────────────────────────────── */}
      <CardFooter className="justify-center">
        <p className="text-xs text-muted-foreground">
          لديك حساب بالفعل؟{" "}
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

// app/(auth)/register/register-form.tsx
// "use client";

// import { useTransition } from "react";
// import { useRouter } from "next/navigation";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { toast } from "sonner";
// import Link from "next/link";

// // import { registerSchema, type RegisterInput } from "@/lib/validations/auth";
// import { registerUser } from "@/actions/auth.actions";
// import { Button } from "@/components/ui/button";
// // import { FormInput } from "@/components/auth/form-input";
// import { GoogleAuth } from "@/components/auth/GoogleAuth";
// import { AuthCard, AuthFooter } from "@/components/auth/AuthPrimitives";
// import { FormInput } from "../form/FormInput";
// import { type RegisterInput, registerSchema } from "@/schemas/auth.schema";

// export function RegisterForm() {
//   const router = useRouter();
//   const [isPending, startTransition] = useTransition();

//   const form = useForm<RegisterInput>({
//     resolver: zodResolver(registerSchema),
//     defaultValues: { name: "", email: "", password: "", confirmPassword: "" },
//   });

//   function onSubmit(values: RegisterInput) {
//     startTransition(async () => {
//       const result = await registerUser(values);
//       if (result.status !== "success") {
//         toast.error(result.message);
//         return;
//       }
//       toast.success(result.message);
//       router.push(
//         `/waiting-verification?email=${encodeURIComponent(values.email)}`,
//       );
//     });
//   }

//   return (
//     <AuthCard>
//       <form
//         onSubmit={form.handleSubmit(onSubmit)}
//         className="space-y-4"
//         noValidate
//       >
//         <FormInput
//           control={form.control}
//           name="name"
//           label="الاسم الكامل"
//           placeholder="محمد أحمد"
//         />
//         <FormInput
//           control={form.control}
//           name="email"
//           label="البريد الإلكتروني"
//           placeholder="example@email.com"
//           type="email"
//           dir="ltr"
//         />
//         <FormInput
//           control={form.control}
//           name="password"
//           label="كلمة المرور"
//           type="password"
//         />
//         <FormInput
//           control={form.control}
//           name="confirmPassword"
//           label="تأكيد كلمة المرور"
//           type="password"
//         />

//         <Button type="submit" className="w-full" size="lg" disabled={isPending}>
//           {isPending ? "جارٍ الإنشاء..." : "إنشاء الحساب"}
//         </Button>

//         <GoogleAuth />
//       </form>

//       <AuthFooter>
//         لديك حساب؟{" "}
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
