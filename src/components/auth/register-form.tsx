// "use client";

// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { registerSchema, type RegisterInput } from "@/schemas/auth.schema";
// import { registerUser } from "@/actions/auth.actions";
// import { Button } from "@/components/ui/button";
// import { toast } from "sonner";
// import { useRouter } from "next/navigation";
// import { useTransition } from "react";
// import Link from "next/link";
// import { FormInput } from "../form/FormInput";
// import { GoogleAuth } from "./google-auth";

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

//       // Early Return on Failure
//       if (result.status !== "success") {
//         toast.error(result.message);
//         return;
//       }

//       // Success Logic
//       toast.success(result.message);
//       router.push(
//         `/waiting-verification?email=${encodeURIComponent(values.email)}`,
//       );
//       // router.push("/login");
//       // router.refresh();
//     });
//   }

//   return (
//     <form
//       onSubmit={form.handleSubmit(onSubmit)}
//       className="space-y-4"
//       dir="rtl"
//     >
//       <FormInput
//         control={form.control}
//         name="name"
//         label="الاسم الكامل"
//         placeholder="محمد أحمد"
//       />
//       <FormInput
//         control={form.control}
//         name="email"
//         label="البريد الإلكتروني"
//         placeholder="example@email.com"
//         type="email"
//       />
//       <FormInput
//         control={form.control}
//         name="password"
//         label="كلمة المرور"
//         type="password"
//       />
//       <FormInput
//         control={form.control}
//         name="confirmPassword"
//         label="تأكيد كلمة المرور"
//         type="password"
//       />
//       <Button type="submit" className="w-full" disabled={isPending}>
//         {isPending ? "جاري الإنشاء..." : "إنشاء حساب"}
//       </Button>
//       <GoogleAuth />

//       <p className="text-center text-sm text-muted-foreground">
//         لديك حساب؟{" "}
//         <Link href="/login" className="text-primary hover:underline">
//           تسجيل الدخول
//         </Link>
//       </p>
//     </form>
//   );
// }

// app/(auth)/register/register-form.tsx
"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import Link from "next/link";

// import { registerSchema, type RegisterInput } from "@/lib/validations/auth";
import { registerUser } from "@/actions/auth.actions";
import { Button } from "@/components/ui/button";
// import { FormInput } from "@/components/auth/form-input";
import { GoogleAuth } from "@/components/auth/google-auth";
import { AuthCard, AuthFooter } from "@/components/auth/auth-primitives";
import { FormInput } from "../form/FormInput";
import { type RegisterInput, registerSchema } from "@/schemas/auth.schema";

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
    <AuthCard>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4"
        noValidate
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
          dir="ltr"
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

        <Button type="submit" className="w-full" size="lg" disabled={isPending}>
          {isPending ? "جارٍ الإنشاء..." : "إنشاء الحساب"}
        </Button>

        <GoogleAuth />
      </form>

      <AuthFooter>
        لديك حساب؟{" "}
        <Link
          href="/login"
          className="font-medium text-primary hover:underline"
        >
          تسجيل الدخول
        </Link>
      </AuthFooter>
    </AuthCard>
  );
}
