"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";

import { studentSchema, StudentFormData } from "@/lib/validations/student";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { FormInput } from "@/components/form/FormInput";
import { FormRadioGroup } from "@/components/form/FormRadioGroup";
import { FormCheckboxGroup } from "@/components/form/FormCheckboxGroup";
import { FormSwitch } from "@/components/form/FormSwitch";
import { FormTextarea } from "@/components/form/FormTextarea";

import { FormDatePicker } from "../form/FormDatePicker";
import { SURAH_OPTIONS } from "@/lib/quran";
import { FormSelect } from "../form/FormSelect";
import { FormImageUpload } from "../form/FormImageUpload";
import { useTransition } from "react";
import { saveStudentAction } from "@/lib/services/student.actions";
import { toast } from "sonner";

interface StudentFormProps {
  defaultValues?: Partial<StudentFormData>;
  studentId?: string;
}

const ACTIVITY_OPTIONS = [
  { label: "حلقة القرآن", value: "quran" },
  { label: "حلقة التربية", value: "tarbiya" },
  { label: "حلقة التجويد", value: "tajweed" },
  { label: "المقرأة", value: "maqraa" },
  { label: "الملعب", value: "playground" },
];

const LEVEL_OPTIONS = [
  { label: "مبتدئ", value: "beginner" },
  { label: "متوسط", value: "intermediate" },
  { label: "متقدم", value: "advanced" },
];

export function StudentForm({ defaultValues, studentId }: StudentFormProps) {
  const router = useRouter();
  const isEdit = !!studentId;

  const [isPending, startTransition] = useTransition();


  const form = useForm<StudentFormData>({
    resolver: zodResolver(studentSchema),
    defaultValues: {
      name: "",
      phone: "",
      guardianName: "",
      guardianPhone: "",
      address: "",
      level: "beginner",
      enrollments: [],
      trackIbadah: false,
      currentSurah: "",
      photo: "",
      ...defaultValues,
    },
  });

  const onSubmit = async (data: StudentFormData) => {
    // await mutateAsync(data);
    startTransition(async () => {
      const result = await saveStudentAction(data, studentId);

      if (result?.error) {
        toast.error(result.error);
      } else {
        toast.success(isEdit ? "تم تحديث البيانات بنجاح" : "تمت الإضافة بنجاح");
      }
    });
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      {/* ── الصورة الشخصية ── */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">الصورة الشخصية</CardTitle>
        </CardHeader>
        <CardContent>
          <FormImageUpload
            control={form.control}
            name="photo"
            label="صورة الطالب"
          />
        </CardContent>
      </Card>

      {/* ── البيانات الأساسية ── */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">البيانات الأساسية للطالب</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <FormInput
            control={form.control}
            name="name"
            label="الاسم كاملاً"
            placeholder="أحمد محمد علي"
            required
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormDatePicker
              control={form.control}
              name="birthDate"
              label="تاريخ الميلاد"
              required
              placeholder="2012"
            />
            <FormInput
              control={form.control}
              name="phone"
              label="تليفون الطالب (إن وجد)"
              placeholder="01xxxxxxxxx"
              dir="ltr"
            />
          </div>

          <FormInput
            control={form.control}
            name="address"
            label="العنوان"
            placeholder="المنطقة / الشارع"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormRadioGroup
              control={form.control}
              name="level"
              label="مستوى الطالب"
              orientation="horizontal"
              options={LEVEL_OPTIONS}
              required
            />
            <FormRadioGroup
              control={form.control}
              name="gender"
              label="نوع الطالب"
              orientation="horizontal"
              options={[
                { label: "ذكر", value: "male" },
                { label: "أنثى", value: "female" },
              ]}
              required
            />
          </div>
        </CardContent>
      </Card>

      {/* ── بيانات ولي الأمر ── */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">بيانات ولي الأمر</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <FormInput
            control={form.control}
            name="guardianName"
            label="اسم ولي الأمر"
            placeholder="محمد علي"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormInput
              control={form.control}
              name="guardianPhone"
              label="تليفون ولي الأمر الرئيسي"
              placeholder="01xxxxxxxxx"
              dir="ltr"
              required
            />
            <FormInput
              control={form.control}
              name="guardianPhone2"
              label="تليفون احتياطي"
              placeholder="01xxxxxxxxx"
              dir="ltr"
            />
          </div>
        </CardContent>
      </Card>

      {/* ── الأنشطة المسجل فيها ── */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">الأنشطة والاشتراكات</CardTitle>
        </CardHeader>
        <CardContent>
          <FormCheckboxGroup
            control={form.control}
            name="enrollments"
            label="الأنشطة المتاحة"
            description="اختر الأنشطة التي يشارك فيها الطالب حالياً"
            options={ACTIVITY_OPTIONS}
            required
          />
        </CardContent>
      </Card>

      {/* ── متابعة القرآن والعبادات ── */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">متابعة القرآن والعبادات</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormSelect
              control={form.control}
              name="currentSurah"
              label="السورة الحالية"
              placeholder="اختر السورة..."
              options={SURAH_OPTIONS}
              required
            />
            <FormInput
              control={form.control}
              name="currentAyah"
              type="number"
              label="رقم الآية"
              placeholder="1"
            />
          </div>

          <div className="p-4 border rounded-md bg-muted/20">
            <FormSwitch
              control={form.control}
              name="trackIbadah"
              label="متابعة العبادات"
              description="تفعيل متابعة الصلاة والعبادات لهذا الطالب"
            />
          </div>
        </CardContent>
      </Card>

      {/* ── ملاحظات ── */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">ملاحظات إضافية</CardTitle>
        </CardHeader>
        <CardContent>
          <FormTextarea
            control={form.control}
            name="notes"
            label="ملاحظات"
            placeholder="اكتب أي ملاحظات سلوكية أو تعليمية تخص الطالب..."
          />
        </CardContent>
      </Card>

      {/* ── أزرار التحكم ── */}
      <div className="flex gap-3 justify-end pb-10">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={isPending}
        >
          إلغاء
        </Button>
        <Button type="submit" disabled={isPending}>
          {isPending && <Loader2 size={14} className="animate-spin ml-2" />}
          {isEdit ? "حفظ التعديلات" : "إضافة الطالب"}
        </Button>
      </div>
    </form>
  );
}
