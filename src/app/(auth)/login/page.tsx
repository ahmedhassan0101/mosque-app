"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { FieldGroup } from "@/components/ui/field";
import { FormInput } from "@/components/form/FormInput";
import { useLogin, LoginForm, loginSchema } from "@/hooks/useAuth";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/";

  const { mutate: login, isPending } = useLogin();

  const { control, handleSubmit } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (data: LoginForm) => {
    login(data, {
      onSuccess: () => {
        toast.success("مرحباً بك!");
        router.push(callbackUrl);
        router.refresh();
      },
      onError: (error) => {
        toast.error(error.message);
      },
    });
  };

  return (
    <div className="w-full max-w-sm space-y-6">
      <div className="flex lg:hidden items-center gap-2 justify-center">
        <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center text-primary-foreground font-bold">
          م
        </div>
        <span className="text-lg font-bold">إدارة المسجد</span>
      </div>

      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-xl">تسجيل الدخول</CardTitle>
          <CardDescription>أدخل بياناتك للوصول إلى لوحة التحكم</CardDescription>
        </CardHeader>

        <CardContent>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-5"
            noValidate
          >
            <FieldGroup>
              <FormInput
                control={control}
                name="email"
                label="البريد الإلكتروني"
                type="email"
                dir="ltr"
                placeholder="admin@mosque.com"
              />

              <FormInput
                control={control}
                name="password"
                label="كلمة المرور"
                type="password"
                dir="ltr"
              />
            </FieldGroup>

            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending && <Loader2 size={16} className="animate-spin ml-2" />}
              دخول
            </Button>
          </form>

          <p className="mt-4 text-center text-sm text-muted-foreground">
            مسجد جديد؟{" "}
            <Link
              href="/register"
              className="text-primary hover:underline font-medium"
            >
              سجّل مسجدك الآن
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
