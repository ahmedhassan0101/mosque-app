"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

// استدعاء كل الـ Components اللي عملناها
import { FormInput } from "@/components/form/FormInput";
import { FormSelect } from "@/components/form/FormSelect";
import { FormTextarea } from "@/components/form/FormTextarea";
import { FormDatePicker } from "@/components/form/FormDatePicker";
import { FormRadioGroup } from "@/components/form/FormRadioGroup";
import { FormCheckboxGroup } from "@/components/form/FormCheckboxGroup";
import { FormCheckbox } from "@/components/form/FormCheckbox";
import { FormSwitch } from "@/components/form/FormSwitch";

// 1. تعريف الـ Schema
const formSchema = z.object({
  fullName: z.string().min(3, "الاسم يجب أن يكون 3 أحرف على الأقل"),
  password: z.string().min(6, "كلمة المرور 6 أحرف على الأقل"),
  role: z.string().min(1, "يرجى اختيار الصلاحية"),
  bio: z.string().optional(),
  birthDate: z
    .date()
    .refine((val) => val !== null, "يرجى اختيار تاريخ الميلاد"),
  level: z.string().min(1, "يرجى اختيار المستوى"),
  hobbies: z.array(z.string()).min(1, "اختر هواية واحدة على الأقل"),
  terms: z.boolean().refine((val) => val === true, "يجب الموافقة على الشروط"),
  notifications: z.boolean().default(false),
});

type FormInput = z.input<typeof formSchema>;

export function FormExamples() {
  // 2. إعداد الـ Form

  const { control, handleSubmit } = useForm<FormInput>({
    resolver: zodResolver(formSchema),

    defaultValues: {
      fullName: "",
      password: "",
      role: "",
      bio: "",
      level: "",
      hobbies: [], // المصفوفة فاضية في الأول
      terms: false,
      notifications: false,
      birthDate: new Date(),
    },
  });

  const onSubmit = (data: FormInput) => {
    console.log("✅ Form Submitted Successfully!");
    console.log("📦 Data:", data);
  };

  return (
    <Card className="max-w-2xl mx-auto my-8">
      <CardHeader>
        <CardTitle>مرجع حقول الإدخال (Playground)</CardTitle>
        <CardDescription>
          هذا النموذج يحتوي على جميع الحقول القابلة لإعادة الاستخدام بالنظام
          الجديد
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* 1. Input العادي */}
          <FormInput
            control={control}
            name="fullName"
            label="الاسم بالكامل"
            placeholder="أدخل اسمك هنا..."
            required
          />

          {/* 2. Password */}
          <FormInput
            control={control}
            name="password"
            label="كلمة المرور"
            type="password"
            dir="ltr"
            required
          />

          {/* 3. Select */}
          <FormSelect
            control={control}
            name="role"
            label="الصلاحية"
            placeholder="اختر دور المستخدم..."
            options={[
              { label: "مدير النظام", value: "admin" },
              { label: "مستخدم عادي", value: "user" },
            ]}
            required
          />

          {/* 4. Textarea */}
          <FormTextarea
            control={control}
            name="bio"
            label="نبذة عنك"
            placeholder="اكتب بضعة أسطر عن نفسك..."
          />

          {/* 5. DatePicker */}
          <FormDatePicker
            control={control}
            name="birthDate"
            label="تاريخ الميلاد"
            required
          />

          {/* 6. Radio Group */}
          <FormRadioGroup
            control={control}
            name="level"
            label="مستوى الخبرة"
            orientation="horizontal"
            options={[
              { label: "مبتدئ", value: "beginner" },
              { label: "متوسط", value: "mid" },
              { label: "خبير", value: "senior" },
            ]}
            required
          />

          {/* 7. Checkbox Group */}
          <FormCheckboxGroup
            control={control}
            name="hobbies"
            label="الهوايات المفضلة"
            description="يمكنك اختيار أكثر من عنصر."
            options={[
              { label: "القراءة", value: "reading" },
              { label: "الرياضة", value: "sports" },
              { label: "البرمجة", value: "coding" },
            ]}
            required
          />

          {/* 8. Single Checkbox */}
          <div className="p-4 border rounded-md bg-muted/30">
            <FormCheckbox
              control={control}
              name="terms"
              label="أوافق على الشروط والأحكام"
              description="بموافقتك، أنت تقر بقراءة كافة سياسات الاستخدام الخاصة بنا."
            />
          </div>

          {/* 9. Switch */}
          <div className="p-4 border rounded-md bg-muted/30">
            <FormSwitch
              control={control}
              name="notifications"
              label="تفعيل الإشعارات"
              description="سنقوم بإرسال تنبيهات على بريدك الإلكتروني بكل جديد."
            />
          </div>

          {/* زر الإرسال */}
          <Button type="submit" className="w-full">
            طباعة النتيجة في الكونسول
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
