"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { toast } from "sonner";
import { Loader2, CheckCircle2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { FieldGroup } from "@/components/ui/field";
import { ControlledInput } from "@/components/form-fields/ControlledInput";
import { useRegister, RegisterForm, registerSchema } from "@/hooks/useAuth"; // استيراد الهوك

export default function RegisterPage() {
  const router = useRouter();
  const [done, setDone] = useState(false);

  const { mutate: registerMosque, isPending } = useRegister();

  const { control, handleSubmit } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      mosqueName: "",
      address: "",
      phone: "",
      adminName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: RegisterForm) => {
    registerMosque(data, {
      onSuccess: () => {
        setDone(true);
      },
      onError: (error) => {
        toast.error(error.message);
      },
    });
  };

  if (done) {
    return (
      <div className="w-full max-w-sm text-center space-y-6">
        <div className="flex justify-center">
          <CheckCircle2 size={64} className="text-primary" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold">تم التسجيل بنجاح!</h2>
          <p className="text-muted-foreground text-sm">
            تم إنشاء حساب مسجدك. يمكنك الآن تسجيل الدخول.
          </p>
        </div>
        <Button className="w-full" onClick={() => router.push("/login")}>
          انتقل لتسجيل الدخول
        </Button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md space-y-6">
      <div className="flex lg:hidden items-center gap-2 justify-center">
        <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center text-primary-foreground font-bold">
          م
        </div>
        <span className="text-lg font-bold">إدارة المسجد</span>
      </div>

      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-xl">تسجيل مسجد جديد</CardTitle>
          <CardDescription>
            أنشئ حساباً لمسجدك وابدأ المتابعة الآن
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-5"
            noValidate
          >
            <div className="space-y-1">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                بيانات المسجد
              </p>
              <Separator />
            </div>

            <FieldGroup>
              <ControlledInput
                control={control}
                name="mosqueName"
                label="اسم المسجد"
                required
                placeholder="مسجد النور"
              />
              <div className="grid grid-cols-2 gap-3">
                <ControlledInput
                  control={control}
                  name="address"
                  label="العنوان"
                  placeholder="القاهرة"
                />
                <ControlledInput
                  control={control}
                  name="phone"
                  label="رقم التليفون"
                  placeholder="01xxxxxxxxx"
                  dir="ltr"
                />
              </div>
            </FieldGroup>

            <div className="space-y-1 pt-2">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                بيانات المسؤول
              </p>
              <Separator />
            </div>

            <FieldGroup>
              <ControlledInput
                control={control}
                name="adminName"
                label="الاسم"
                required
                placeholder="أحمد محمد"
              />
              <ControlledInput
                control={control}
                name="email"
                label="البريد الإلكتروني"
                type="email"
                required
                dir="ltr"
                placeholder="admin@mosque.com"
              />

              <div className="grid grid-cols-2 gap-3">
                <ControlledInput
                  control={control}
                  name="password"
                  label="كلمة المرور"
                  type="password"
                  required
                  dir="ltr"
                />
                <ControlledInput
                  control={control}
                  name="confirmPassword"
                  label="تأكيد المرور"
                  type="password"
                  required
                  dir="ltr"
                />
              </div>
            </FieldGroup>

            <Button type="submit" className="w-full mt-2" disabled={isPending}>
              {isPending && <Loader2 size={16} className="animate-spin ml-2" />}
              إنشاء الحساب
            </Button>
          </form>

          <p className="mt-4 text-center text-sm text-muted-foreground">
            عندك حساب بالفعل؟{" "}
            <Link
              href="/login"
              className="text-primary hover:underline font-medium"
            >
              سجّل دخولك
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
