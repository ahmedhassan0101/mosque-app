// // src\app\(auth)\login\page.tsx
// "use client";

// // import { useRouter, useSearchParams } from "next/navigation";
// // import { useForm } from "react-hook-form";
// // import { zodResolver } from "@hookform/resolvers/zod";
// // import Link from "next/link";
// // import { toast } from "sonner";
// // import { Loader2 } from "lucide-react";

// // import { Button } from "@/components/ui/button";
// // import {
// //   Card,
// //   CardContent,
// //   CardHeader,
// //   CardTitle,
// //   CardDescription,
// // } from "@/components/ui/card";
// // import { FieldGroup } from "@/components/ui/field";
// // import { FormInput } from "@/components/form/FormInput";
// // import { useLogin, LoginForm, loginSchema } from "@/hooks/mutations/useAuth";

// import { useState } from "react";
// import { useRouter, useSearchParams } from "next/navigation";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { signIn } from "next-auth/react";
// import Link from "next/link";
// import { toast } from "sonner";
// import { Loader2 } from "lucide-react";

// import { Button } from "@/components/ui/button";
// import {
//   Card,
//   CardContent,
//   CardHeader,
//   CardTitle,
//   CardDescription,
// } from "@/components/ui/card";
// import { Separator } from "@/components/ui/separator";
// import { FieldGroup } from "@/components/ui/field";
// import { FormInput } from "@/components/form/FormInput";
// import {
//   loginSchema,
//   LoginForm,
//   loginWithCredentials,
// } from "@/hooks/mutations/useAuth";

// export default function LoginPage() {
//   const router = useRouter();
//   const searchParams = useSearchParams();
//   const callbackUrl = searchParams.get("callbackUrl") ?? "/";

//   const [loading, setLoading] = useState(false);
//   const [googleLoading, setGoogleLoading] = useState(false);

//   // const { mutate: login, isPending } = useLogin();

//   const { control, handleSubmit } = useForm<LoginForm>({
//     resolver: zodResolver(loginSchema),
//     defaultValues: { email: "", password: "" },
//   });

//   // const onSubmit = async (data: LoginForm) => {
//   //   login(data, {
//   //     onSuccess: () => {
//   //       toast.success("مرحباً بك!");
//   //       router.push(callbackUrl);
//   //       router.refresh();
//   //     },
//   //     onError: (error) => {
//   //       toast.error(error.message);
//   //     },
//   //   });
//   // };
//   const onSubmit = async (data: LoginForm) => {
//     setLoading(true);
//     const error = await loginWithCredentials(data, callbackUrl);
//     if (error) {
//       toast.error(error);
//       setLoading(false);
//       return;
//     }
//     // Redirect after successful login — middleware handles onboarding check
//     router.push(callbackUrl);
//     router.refresh();
//   };
//   const handleGoogle = async () => {
//     setGoogleLoading(true);
//     await signIn("google", { callbackUrl });
//     // page will redirect — no need to setLoading(false)
//   };
//   return (
//     <div className="w-full max-w-sm space-y-6">
//       {/* Mobile logo */}
//       <div className="flex lg:hidden items-center gap-2 justify-center">
//         <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center text-primary-foreground font-bold">
//           م
//         </div>
//         <span className="text-lg font-bold">إدارة المسجد</span>
//       </div>

//       <Card>
//         <CardHeader className="pb-4">
//           <CardTitle className="text-xl">تسجيل الدخول</CardTitle>
//           <CardDescription>أدخل بياناتك للوصول إلى لوحة التحكم</CardDescription>
//         </CardHeader>

//         <CardContent className="space-y-4">
//           {/* Google button */}
//           <Button
//             type="button"
//             variant="outline"
//             className="w-full gap-2"
//             onClick={handleGoogle}
//             disabled={googleLoading}
//           >
//             {googleLoading ? (
//               <Loader2 size={16} className="animate-spin" />
//             ) : (
//               <svg viewBox="0 0 24 24" className="w-4 h-4" aria-hidden>
//                 <path
//                   fill="#4285F4"
//                   d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
//                 />
//                 <path
//                   fill="#34A853"
//                   d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
//                 />
//                 <path
//                   fill="#FBBC05"
//                   d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
//                 />
//                 <path
//                   fill="#EA4335"
//                   d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
//                 />
//               </svg>
//             )}
//             الدخول بحساب Google
//           </Button>

//           <div className="flex items-center gap-2">
//             <Separator className="flex-1" />
//             <span className="text-xs text-muted-foreground">أو</span>
//             <Separator className="flex-1" />
//           </div>

//           <form
//             onSubmit={handleSubmit(onSubmit)}
//             className="space-y-4"
//             noValidate
//           >
//             <FieldGroup>
//               <FormInput
//                 control={control}
//                 name="email"
//                 label="البريد الإلكتروني"
//                 type="email"
//                 dir="ltr"
//                 placeholder="admin@mosque.com"
//               />
//               <FormInput
//                 control={control}
//                 name="password"
//                 label="كلمة المرور"
//                 type="password"
//                 dir="ltr"
//               />
//             </FieldGroup>

//             <div className="flex justify-end">
//               <Link
//                 href="/forgot-password"
//                 className="text-xs text-muted-foreground hover:text-primary"
//               >
//                 نسيت كلمة المرور؟
//               </Link>
//             </div>

//             <Button type="submit" className="w-full" disabled={loading}>
//               {loading && <Loader2 size={16} className="animate-spin ml-2" />}
//               دخول
//             </Button>
//           </form>

//           <p className="text-center text-sm text-muted-foreground">
//             مسجد جديد؟{" "}
//             <Link
//               href="/register"
//               className="text-primary hover:underline font-medium"
//             >
//               سجّل مسجدك الآن
//             </Link>
//           </p>
//         </CardContent>
//       </Card>
//     </div>
//   );
// }
// //  <div className="w-full max-w-sm space-y-6">
// //       <div className="flex lg:hidden items-center gap-2 justify-center">
// //         <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center text-primary-foreground font-bold">
// //           م
// //         </div>
// //         <span className="text-lg font-bold">إدارة المسجد</span>
// //       </div>

// //       <Card>
// //         <CardHeader className="pb-4">
// //           <CardTitle className="text-xl">تسجيل الدخول</CardTitle>
// //           <CardDescription>أدخل بياناتك للوصول إلى لوحة التحكم</CardDescription>
// //         </CardHeader>

// //         <CardContent>
// //           <form
// //             onSubmit={handleSubmit(onSubmit)}
// //             className="space-y-5"
// //             noValidate
// //           >
// //             <FieldGroup>
// //               <FormInput
// //                 control={control}
// //                 name="email"
// //                 label="البريد الإلكتروني"
// //                 type="email"
// //                 dir="ltr"
// //                 placeholder="admin@mosque.com"
// //               />

// //               <FormInput
// //                 control={control}
// //                 name="password"
// //                 label="كلمة المرور"
// //                 type="password"
// //                 dir="ltr"
// //               />
// //             </FieldGroup>

// //             <Button type="submit" className="w-full" disabled={isPending}>
// //               {isPending && <Loader2 size={16} className="animate-spin ml-2" />}
// //               دخول
// //             </Button>
// //           </form>

// //           <p className="mt-4 text-center text-sm text-muted-foreground">
// //             مسجد جديد؟{" "}
// //             <Link
// //               href="/register"
// //               className="text-primary hover:underline font-medium"
// //             >
// //               سجّل مسجدك الآن
// //             </Link>
// //           </p>
// //         </CardContent>
// //       </Card>
// //     </div>
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "تسجيل الدخول",
};

/**
 * LoginPage renders the sign-in form.
 * Form interaction logic is handled by a dedicated Client Component
 * (to be created in /components/auth/login-form.tsx) to keep this
 * Server Component clean.
 */
export default function LoginPage() {
  return (
    <div className="glass-card rounded-2xl p-6 shadow-lg">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-foreground">تسجيل الدخول</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          أدخل بيانات حسابك للوصول إلى لوحة التحكم
        </p>
      </div>

      {/* LoginForm Client Component goes here */}
      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-foreground">
            البريد الإلكتروني
          </label>
          <input
            type="email"
            placeholder="example@masjid.com"
            dir="ltr"
            className="w-full rounded-lg border-border bg-input px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-foreground">
            كلمة المرور
          </label>
          <input
            type="password"
            placeholder="••••••••"
            dir="ltr"
            className="w-full rounded-lg border-border bg-input px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
        <button
          type="submit"
          className="mt-2 w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 focus:ring-2 focus:ring-ring focus:ring-offset-2"
        >
          دخول
        </button>
      </div>
    </div>
  );
}
