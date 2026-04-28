"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { studentSchema, type StudentInput } from "@/schemas/student.schema";
import { saveStudent } from "@/actions/student.actions";
import { StudentSerialized } from "@/lib/data/student.data";

import { Button } from "@/components/ui/button";
import { FormInput } from "@/components/form/FormInput";
import { FormRadioGroup } from "@/components/form/FormRadioGroup";
import { FormTextarea } from "@/components/form/FormTextarea";
import { FormDatePicker } from "@/components/form/FormDatePicker";
import { FormSelect } from "@/components/form/FormSelect";
import { SURAH_OPTIONS } from "@/lib/quran";
import { FormImageUpload } from "../form/form-image-upload";

interface Props {
  initialData?: StudentSerialized | null;
  studentId?: string;
}

const LEVEL_OPTIONS = [
  { label: "مبتدئ", value: "beginner" },
  { label: "متوسط", value: "intermediate" },
  { label: "متقدم", value: "advanced" },
];

export default function StudentForm({ initialData, studentId }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const isEdit = !!studentId;

  // 1. إعداد الهوك
  const form = useForm<StudentInput>({
    resolver: zodResolver(studentSchema),

    defaultValues: {
      name: initialData?.name ?? "",

      birthDate: initialData?.birthDate
        ? new Date(initialData.birthDate)
        : undefined,
      gender: initialData?.gender ?? undefined,
      level: initialData?.level ?? undefined,

      guardians: initialData?.guardians ?? [{ relation: "أب", phone: "" }],
      currentSurah: initialData?.currentSurah ?? "الفاتحة",
      currentAyah: initialData?.currentAyah ?? 1,
      image: initialData?.image ?? "",
      notes: initialData?.notes ?? "",
      phone: initialData?.phone ?? "",
      address: initialData?.address ?? "",
    },
  });

  // 2. التحكم في مصفوفة أولياء الأمور
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "guardians",
  });

  // 3. معالج الإرسال
  const onSubmit = (data: StudentInput) => {
    console.log("🚀 ~ onSubmit ~ data:", data);

    startTransition(async () => {
      const result = await saveStudent(data, studentId);

      if (result.status === "success") {
        toast.success(result.message);
        router.push("/dashboard/students");
        router.refresh();
      } else {
        toast.error(result.message);
      }
    });
  };

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="space-y-8 bg-white p-6 rounded-lg border"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormImageUpload
          control={form.control}
          name="image"
          label="صورة المعلم"
          folderCategory="students"
        />
      </div>

      <FormInput
        control={form.control}
        name="name"
        label="اسم الطالب"
        required
      />
      <FormDatePicker
        control={form.control}
        name="birthDate"
        label="تاريخ الميلاد"
        required
      />
      <FormInput
        control={form.control}
        name="phone"
        label="تليفون الطالب (إن وجد)"
        placeholder="01xxxxxxxxx"
        dir="ltr"
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

      <FormInput
        control={form.control}
        name="address"
        label="العنوان"
        placeholder="المنطقة / الشارع"
      />
      <FormRadioGroup
        control={form.control}
        name="level"
        label="المستوى"
        options={LEVEL_OPTIONS}
      />

      <hr />

      {/* قسم أولياء الأمور (Dynamic Field Array) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium">
            بيانات التواصل (أولياء الأمور)
          </h3>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => append({ relation: "", phone: "" })}
          >
            <Plus size={16} className="ml-1" /> إضافة ولي أمر
          </Button>
        </div>

        {fields.map((field, index) => (
          <div
            key={field.id}
            className="flex gap-4 items-end border p-4 rounded-md bg-gray-50"
          >
            <div className="flex-1">
              <FormInput
                control={form.control}
                name={`guardians.${index}.relation`}
                label="صلة القرابة"
                placeholder="أب، أم، أخ..."
              />
            </div>
            <div className="flex-1">
              <FormInput
                control={form.control}
                name={`guardians.${index}.phone`}
                label="رقم الهاتف"
                placeholder="01xxxxxxxxx"
              />
            </div>
            {fields.length > 1 && (
              <Button
                type="button"
                variant="destructive"
                size="icon"
                onClick={() => remove(index)}
              >
                <Trash2 size={18} />
              </Button>
            )}
          </div>
        ))}
      </div>

      <hr />

      {/* متابعة الحفظ */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormSelect
          control={form.control}
          name="currentSurah"
          label="السورة الحالية"
          options={SURAH_OPTIONS}
        />

        <FormInput
          control={form.control}
          name="currentAyah"
          label="رقم الآية"
          type="number"
        />
      </div>

      <FormTextarea
        control={form.control}
        name="notes"
        label="ملاحظات إضافية"
      />

      {/* الأزرار */}
      <div className="flex justify-end gap-3">
        {/* <Button type="button" variant="ghost" onClick={() => router.back()}>
          إلغاء
        </Button> */}
        <Button type="submit" disabled={isPending}>
          {isPending && <Loader2 className="ml-2 animate-spin" size={16} />}
          {isEdit ? "تحديث البيانات" : "تسجيل الطالب"}
        </Button>
      </div>
    </form>
  );
}
