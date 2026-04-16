"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import {
  resetPasswordSchema,
  ResetPasswordForm,
  resetPassword,
} from "@/hooks/mutations/useAuth";

export default function ResetPasswordPage({
  params,
}: {
  params: { token: string };
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const { control, handleSubmit } = useForm<ResetPasswordForm>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: "", confirmPassword: "" },
  });

  const onSubmit = async (data: ResetPasswordForm) => {
    setLoading(true);
    const error = await resetPassword(params.token, data);
    setLoading(false);
    if (error) {
      toast.error(error);
      return;
    }
    toast.success("تم تغيير كلمة المرور بنجاح");
    router.push("/login");
  };

  return (
    <div className="w-full max-w-sm space-y-6">
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-xl">كلمة مرور جديدة</CardTitle>
          <CardDescription>اختر كلمة مرور قوية لحسابك</CardDescription>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-4"
            noValidate
          >
            <FieldGroup>
              <FormInput
                control={control}
                name="password"
                label="كلمة المرور الجديدة"
                type="password"
                dir="ltr"
                required
              />
              <FormInput
                control={control}
                name="confirmPassword"
                label="تأكيد كلمة المرور"
                type="password"
                dir="ltr"
                required
              />
            </FieldGroup>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading && <Loader2 size={16} className="animate-spin ml-2" />}
              تغيير كلمة المرور
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
