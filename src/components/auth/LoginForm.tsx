// "use client";

// import { useTransition } from "react";
// import { useRouter, useSearchParams } from "next/navigation";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { toast } from "sonner";
// import Link from "next/link";
// import { CheckCircle } from "lucide-react";

// import { loginUser } from "@/actions/auth.actions";
// import { loginSchema, type LoginInput } from "@/schemas/auth.schema";

// import { Button } from "@/components/ui/button";
// import { Alert, AlertDescription } from "@/components/ui/alert";
// import {
//   Card,
//   CardHeader,
//   CardTitle,
//   CardDescription,
//   CardContent,
//   CardFooter,
// } from "@/components/ui/card";
// import { FormInput } from "@/components/form/FormInput";
// import { GoogleAuth } from "@/components/auth/GoogleAuth";

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

//       if (result.status !== "success") {
//         toast.error(result.message);
//         return;
//       }

//       toast.success(result.message);
//       router.push("/dashboard");
//       router.refresh();
//     });
//   }

//   return (
//     /*
//       max-w-sm = 384px — العرض المناسب لـ auth forms
//       w-full عشان يكون responsive على الـ mobile
//     */
//     <Card className="w-full max-w-sm">
//       {/* ── Header ─────────────────────────────── */}
//       <CardHeader>
//         <CardTitle>أهلاً بك مجدداً</CardTitle>
//         <CardDescription>أدخل بياناتك للوصول إلى لوحة التحكم</CardDescription>
//       </CardHeader>

//       {/* ── Body ───────────────────────────────── */}
//       <CardContent>
//         <div className="flex flex-col gap-5">
//           {/* Success alerts — تظهر من الـ URL params بعد redirect */}
//           {(isVerified || isReset) && (
//             <Alert variant="success">
//               <CheckCircle />
//               <AlertDescription>
//                 {isVerified
//                   ? "تم التحقق من بريدك الإلكتروني بنجاح، يمكنك تسجيل الدخول الآن."
//                   : "تم تغيير كلمة المرور بنجاح، سجّل الدخول بكلمة المرور الجديدة."}
//               </AlertDescription>
//             </Alert>
//           )}

//           {/* Form fields */}
//           <form
//             onSubmit={form.handleSubmit(onSubmit)}
//             noValidate
//             className="flex flex-col gap-4"
//           >
//             <FormInput
//               control={form.control}
//               name="email"
//               label="البريد الإلكتروني"
//               type="email"
//               placeholder="admin@mosque.com"
//               dir="ltr"
//               disabled={isPending}
//             />

//             {/* Password field + forgot password link */}
//             <div className="flex flex-col gap-1">
//               <FormInput
//                 control={form.control}
//                 name="password"
//                 label="كلمة المرور"
//                 type="password"
//                 autoComplete="current-password"
//                 disabled={isPending}
//               />
//               <div className="flex justify-start">
//                 <Button
//                   variant="link"
//                   size="sm"
//                   className="h-auto p-0 text-xs text-muted-foreground hover:text-primary"
//                   asChild
//                 >
//                   <Link href="/forgot-password">نسيت كلمة المرور؟</Link>
//                 </Button>
//               </div>
//             </div>

//             {/* Submit */}
//             <Button type="submit" className="w-full" disabled={isPending}>
//               {isPending ? "جارٍ تسجيل الدخول..." : "تسجيل الدخول"}
//             </Button>
//           </form>

//           {/* Divider */}
//           <div className="relative flex items-center gap-3 text-xs text-muted-foreground">
//             <span className="h-px flex-1 bg-border" />
//             <span>أو</span>
//             <span className="h-px flex-1 bg-border" />
//           </div>

//           {/* Google OAuth */}
//           <GoogleAuth />
//         </div>
//       </CardContent>

//       {/* ── Footer ─────────────────────────────── */}
//       <CardFooter className="justify-center">
//         <p className="text-xs text-muted-foreground">
//           ليس لديك حساب؟{" "}
//           <Link
//             href="/register"
//             className="font-medium text-primary underline-offset-4 hover:underline"
//           >
//             إنشاء حساب جديد
//           </Link>
//         </p>
//       </CardFooter>
//     </Card>
//   );
// }
// src/components/auth/LoginForm.tsx
// src/components/auth/LoginForm.tsx
"use client";

import { useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import Link from "next/link";
import { CheckCircle } from "lucide-react";

import { loginUser } from "@/actions/auth.actions";
import { loginSchema, type LoginInput } from "@/schemas/auth.schema";

import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
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
    <Card className="container-auth animate-scale-in">
      {/* ── Header — Option B ──────────────────────────────────── */}
      <CardHeader>
        <CardSysLabel>نظام إدارة المسجد</CardSysLabel>
        <div className="flex flex-col gap-1 pt-2">
          <CardTitle>أهلاً بك مجدداً</CardTitle>
          <CardDescription>أدخل بياناتك للوصول إلى لوحة التحكم</CardDescription>
        </div>
      </CardHeader>

      {/* ── Content ────────────────────────────────────────────── */}
      <CardContent>
        <div className="flex flex-col gap-5">
          {/* Success alerts من الـ redirect params */}
          {(isVerified || isReset) && (
            <Alert variant="success">
              <CheckCircle />
              <AlertDescription>
                {isVerified
                  ? "تم التحقق من بريدك الإلكتروني بنجاح، يمكنك تسجيل الدخول الآن."
                  : "تم تغيير كلمة المرور بنجاح، سجّل الدخول بكلمة المرور الجديدة."}
              </AlertDescription>
            </Alert>
          )}

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

            <div className="flex flex-col gap-1.5">
              <FormInput
                control={form.control}
                name="password"
                label="كلمة المرور"
                type="password"
                autoComplete="current-password"
                disabled={isPending}
              />
              <Button variant="link" size="sm" asChild>
                <Link href="/forgot-password">نسيت كلمة المرور؟</Link>
              </Button>
            </div>

            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? "جارٍ تسجيل الدخول..." : "تسجيل الدخول"}
            </Button>
          </form>

          {/* Divider من globals.css utility class */}
          <div className="divider-label">أو</div>

          <GoogleAuth />
        </div>
      </CardContent>

      {/* ── Footer ─────────────────────────────────────────────── */}
      <CardFooter className="justify-center gap-0.5">
        <p className="text-xs  font-medium">ليس لديك حساب؟</p>
        <Button variant="link" size="sm" asChild>
          <Link href="/register">إنشاء حساب جديد</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
