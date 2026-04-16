// src\app\onboarding\page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
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
  onboardingSchema,
  OnboardingForm,
  completeOnboarding,
} from "@/hooks/mutations/useAuth";

export default function OnboardingPage() {
  const router = useRouter();
  const { update } = useSession(); // refresh JWT after onboarding
  const [loading, setLoading] = useState(false);

  const { control, handleSubmit } = useForm<OnboardingForm>({
    resolver: zodResolver(onboardingSchema),
    defaultValues: { mosqueName: "", address: "", phone: "" },
  });

  const onSubmit = async (data: OnboardingForm) => {
    setLoading(true);
    const error = await completeOnboarding(data);
    if (error) {
      toast.error(error);
      setLoading(false);
      return;
    }

    // Refresh JWT so session.user.mosqueId is updated
    // await update();
    await update({ mosqueId: "pending" });
    toast.success("مرحباً! تم إعداد المسجد بنجاح");
    window.location.href = "/";
    //     Modifying a variable defined outside a component or hook is not allowed. Consider using an effect.

    // H:\mosque-app\src\app\onboarding\page.tsx:51:5
    //   49 |     await update({ mosqueId: "pending" });
    //   50 |     toast.success("مرحباً! تم إعداد المسجد بنجاح");
    // > 51 |     window.location.href = "/";
    //      |     ^^^^^^^^^^^^^^^ value cannot be modified
    //   52 |     // router.push("/");
    //   53 |     // router.refresh();
    //   54 |   };eslint(react-hooks/immutability)
    // router.push("/");
    // router.refresh();
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-muted/30">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center text-primary-foreground font-bold text-xl mx-auto">
            م
          </div>
          <h1 className="text-2xl font-bold">مرحباً بك!</h1>
          <p className="text-muted-foreground text-sm">
            أدخل بيانات مسجدك لإكمال الإعداد
          </p>
        </div>

        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-lg">بيانات المسجد</CardTitle>
            <CardDescription>
              هذه المعلومات ستظهر في لوحة التحكم
            </CardDescription>
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
                  name="mosqueName"
                  label="اسم المسجد"
                  placeholder="مسجد النور"
                  required
                />
                <div className="grid grid-cols-2 gap-3">
                  <FormInput
                    control={control}
                    name="address"
                    label="العنوان"
                    placeholder="القاهرة"
                  />
                  <FormInput
                    control={control}
                    name="phone"
                    label="رقم التليفون"
                    placeholder="01xxxxxxxxx"
                    dir="ltr"
                  />
                </div>
              </FieldGroup>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading && <Loader2 size={16} className="animate-spin ml-2" />}
                إكمال الإعداد
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
