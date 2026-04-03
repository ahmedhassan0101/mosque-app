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

import { useStudentMutation } from "@/hooks/useStudentMutation";
import { FormDatePicker } from "../form/FormDatePicker";
import { SURAH_OPTIONS } from "@/lib/quran";
import { FormSelect } from "../form/FormSelect";

interface Props {
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

export function StudentForm({ defaultValues, studentId }: Props) {
  const router = useRouter();
  const isEdit = !!studentId;

  const { mutateAsync, isPending } = useStudentMutation(studentId);

  const form = useForm<StudentFormData>({
    resolver: zodResolver(studentSchema),
// Type 'Resolver<{ name: string; birthDate: unknown; gender: "male" | "female"; guardianPhone: string; level: "beginner" | "intermediate" | "advanced"; enrollments: ("quran" | "tarbiya" | "tajweed" | "maqraa" | "playground")[]; ... 7 more ...; notes?: string | undefined; }, any, { ...; }>' is not assignable to type 'Resolver<{ name: string; birthDate: Date; gender: "male" | "female"; guardianPhone: string; level: "beginner" | "intermediate" | "advanced"; enrollments: ("quran" | "tarbiya" | "tajweed" | "maqraa" | "playground")[]; ... 7 more ...; notes?: string | undefined; }, any, { ...; }>'.
//   Types of parameters 'options' and 'options' are incompatible.
//     Type 'ResolverOptions<{ name: string; birthDate: Date; gender: "male" | "female"; guardianPhone: string; level: "beginner" | "intermediate" | "advanced"; enrollments: ("quran" | "tarbiya" | "tajweed" | "maqraa" | "playground")[]; ... 7 more ...; notes?: string | undefined; }>' is not assignable to type 'ResolverOptions<{ name: string; birthDate: unknown; gender: "male" | "female"; guardianPhone: string; level: "beginner" | "intermediate" | "advanced"; enrollments: ("quran" | "tarbiya" | "tajweed" | "maqraa" | "playground")[]; ... 7 more ...; notes?: string | undefined; }>'.
//       Types of property 'names' are incompatible.
//         Type 'string[] | undefined' is not assignable to type '("name" | "birthDate" | "gender" | "phone" | "guardianName" | "guardianPhone" | "guardianPhone2" | "address" | "level" | "enrollments" | "trackIbadah" | "currentSurah" | "currentAyah" | "notes")[] | undefined'.
//           Type 'string[]' is not assignable to type '("name" | "birthDate" | "gender" | "phone" | "guardianName" | "guardianPhone" | "guardianPhone2" | "address" | "level" | "enrollments" | "trackIbadah" | "currentSurah" | "currentAyah" | "notes")[]'.
//             Type 'string' is not assignable to type '"name" | "birthDate" | "gender" | "phone" | "guardianName" | "guardianPhone" | "guardianPhone2" | "address" | "level" | "enrollments" | "trackIbadah" | "currentSurah" | "currentAyah" | "notes"'.ts(2322)
    defaultValues: {
      name: "",
      birthDate: undefined,
      phone: "",
      address: "",
      // level: "beginner",
      enrollments: [],
      trackIbadah: false,
      currentSurah: "",
      ...defaultValues,
    },
  });

  const onSubmit = async (data: StudentFormData) => {
    console.log("🚀 ~ onSubmit ~ data:", data);
    await mutateAsync(data);
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      {/* Argument of type '(data: StudentFormData) => Promise<void>' is not assignable to parameter of type 'SubmitHandler<TFieldValues>'.
  Types of parameters 'data' and 'data' are incompatible.
    Type 'TFieldValues' is not assignable to type '{ name: string; birthDate: Date; gender: "male" | "female"; guardianPhone: string; level: "beginner" | "intermediate" | "advanced"; enrollments: ("quran" | "tarbiya" | "tajweed" | "maqraa" | "playground")[]; ... 7 more ...; notes?: string | undefined; }'.
      Type 'FieldValues' is missing the following properties from type '{ name: string; birthDate: Date; gender: "male" | "female"; guardianPhone: string; level: "beginner" | "intermediate" | "advanced"; enrollments: ("quran" | "tarbiya" | "tajweed" | "maqraa" | "playground")[]; ... 7 more ...; notes?: string | undefined; }': name, birthDate, gender, guardianPhone, and 5 more.ts(2345) */}
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
//               "playground")[]; ... 7 more ...; notes?: string | undefined; }, any, TFieldValues> | undefined' is not assignable to type 'Resolver<{ name: string; birthDate: Date; gender: "male" | "female"; guardianPhone: string; level: "beginner" | "intermediate" | "advanced"; enrollments: ("quran" | "tarbiya" | "tajweed" | "maqraa" | "playground")[]; ... 7 more ...; notes?: string | undefined; }, any, { ...; }> | undefined'.
//       Type 'Resolver<{ name: string; birthDate: Date; gender: "male" | "female"; guardianPhone: string; level: "beginner" | "intermediate" | "advanced"; enrollments: ("quran" | "tarbiya" | "tajweed" | "maqraa" | "playground")[]; ... 7 more ...; notes?: string | undefined; }, any, TFieldValues>' is not assignable to type 'Resolver<{ name: string; birthDate: Date; gender: "male" | "female"; guardianPhone: string; level: "beginner" | "intermediate" | "advanced"; enrollments: ("quran" | "tarbiya" | "tajweed" | "maqraa" | "playground")[]; ... 7 more ...; notes?: string | undefined; }, any, { ...; }>'.
//         Type 'ResolverResult<{ name: string; birthDate: Date; gender: "male" | "female"; guardianPhone: string; level: "beginner" | "intermediate" | "advanced"; enrollments: ("quran" | "tarbiya" | "tajweed" | "maqraa" | "playground")[]; ... 7 more ...; notes?: string | undefined; }, TFieldValues> | Promise<...>' is not assignable to type 'ResolverResult<{ name: string; birthDate: Date; gender: "male" | "female"; guardianPhone: string; level: "beginner" | "intermediate" | "advanced"; enrollments: ("quran" | "tarbiya" | "tajweed" | "maqraa" | "playground")[]; ... 7 more ...; notes?: string | undefined; }, { ...; }> | Promise<...>'.
//           Type 'ResolverSuccess<TFieldValues>' is not assignable to type 'ResolverResult<{ name: string; birthDate: Date; gender: "male" | "female"; guardianPhone: string; level: "beginner" | "intermediate" | "advanced"; enrollments: ("quran" | "tarbiya" | "tajweed" | "maqraa" | "playground")[]; ... 7 more ...; notes?: string | undefined; }, { ...; }> | Promise<...>'.
//             Type 'ResolverSuccess<TFieldValues>' is not assignable to type 'ResolverSuccess<{ name: string; birthDate: Date; gender: "male" | "female"; guardianPhone: string; level: "beginner" | "intermediate" | "advanced"; enrollments: ("quran" | "tarbiya" | "tajweed" | "maqraa" | "playground")[]; ... 7 more ...; notes?: string | undefined; }>'.
//               Type 'TFieldValues' is not assignable to type '{ name: string; birthDate: Date; gender: "male" | "female"; guardianPhone: string; level: "beginner" | "intermediate" | "advanced"; enrollments: ("quran" | "tarbiya" | "tajweed" | "maqraa" | "playground")[]; ... 7 more ...; notes?: string | undefined; }'.
//                 Type 'FieldValues' is missing the following properties from type '{ name: string; birthDate: Date; gender: "male" | "female"; guardianPhone: string; level: "beginner" | "intermediate" | "advanced"; enrollments: ("quran" | "tarbiya" | "tajweed" | "maqraa" | "playground")[]; ... 7 more ...; notes?: string | undefined; }': name, birthDate, gender, guardianPhone, and 5 more.ts(2322)
// FormDatePicker.tsx(19, 3): The expected type comes from property 'control' which is declared here on type 'IntrinsicAttributes & FormDatePickerProps<{ name: string; birthDate: Date; gender: "male" | "female"; guardianPhone: string; level: "beginner" | "intermediate" | "advanced"; ... 8 more ...; notes?: string | undefined; }>'
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
              label="تفعيل متابعة العبادات"
              description="متابعة أداء الصلوات والسنن اليومية للطالب"
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
            label=""
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
