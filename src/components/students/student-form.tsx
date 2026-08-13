"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { studentSchema, type StudentInput } from "@/schemas/student.schema";
import { saveStudent } from "@/actions/student.actions";
import { StudentSerialized } from "@/queries/student.queries";

import { Button } from "@/components/ui/button";
import { FormInput } from "@/components/form/FormInput";
import { FormRadioGroup } from "@/components/form/FormRadioGroup";
import { FormTextarea } from "@/components/form/FormTextarea";
import { FormDatePicker } from "@/components/form/FormDatePicker";
import { FormSelect } from "@/components/form/FormSelect";
import { SURAH_OPTIONS } from "@/constants/quran";
import { FormImageUpload } from "@/components/form/form-image-upload";
import { GENDERS, LEVELS } from "@/constants";

// ─── Types ───────────────────────────────────────────────────────────────────

interface StudentFormProps {
  /** Provided in edit mode. Undefined when creating a new student. */
  initialData?: StudentSerialized | null;
  /** The student's MongoDB ID. Undefined in create mode. */
  studentId?: string;
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function StudentForm({
  initialData,
  studentId,
}: StudentFormProps) {
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
      level: initialData?.level ?? "beginner",
      guardians: initialData?.guardians?.length
        ? initialData.guardians
        : [{ relation: "أب", phone: "" }],
      currentSurah: initialData?.currentSurah ?? "",
      currentAyah: initialData?.currentAyah ?? undefined,
      phone: initialData?.phone ?? "",
      image: initialData?.image ?? "",
      address: initialData?.address ?? "",
      notes: initialData?.notes ?? "",
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "guardians",
  });

  const onSubmit = (data: StudentInput) => {
    startTransition(async () => {
      const result = await saveStudent(data, studentId);

      if (result.status !== "success") {
        toast.error(result.message ?? "حدث خطأ غير متوقع.");
        return;
      }

      toast.success(result.message);
      // No router.refresh() — revalidatePath() in the action handles cache purge.
      router.push("/dashboard/students");
    });
  };

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="flex flex-col gap-6"
    >
      ── الصورة ──
      <FormImageUpload
        control={form.control}
        name="image"
        label="صورة الطالب"
        folderCategory="students"
      />
      ── البيانات الأساسية ──
      <section className="space-y-4">
        <h2 className="text-base font-semibold text-muted-foreground border-b pb-2">
          البيانات الأساسية
        </h2>

        <FormInput
          control={form.control}
          name="name"
          label="اسم الطالب"
          placeholder="أحمد محمد"
          required
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* <FormDatePicker
            control={form.control}
            name="birthDate"
            label="تاريخ الميلاد"
            required
          /> */}
          <FormDatePicker
            control={form.control}
            name="birthDate"
            label="تاريخ الميلاد"
            required
            maxDate={new Date()}
            minDate={new Date("1900-01-01")}
          />
          <FormInput
            control={form.control}
            name="phone"
            label="هاتف الطالب (اختياري)"
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

        <FormRadioGroup
          control={form.control}
          name="gender"
          label="النوع"
          orientation="horizontal"
          options={GENDERS.options}
          required
        />

        <FormRadioGroup
          control={form.control}
          name="level"
          label="المستوى"
          orientation="horizontal"
          options={LEVELS.options}
        />
      </section>
      ── أولياء الأمور ──
      <section className="space-y-4">
        <div className="flex items-center justify-between border-b pb-2">
          <h2 className="text-base font-semibold text-muted-foreground">
            بيانات أولياء الأمور
          </h2>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => append({ relation: "", phone: "" })}
          >
            <Plus size={16} className="ml-1" />
            إضافة ولي أمر
          </Button>
        </div>

        {fields.map((field, index) => (
          <div
            key={field.id}
            className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-lg border bg-muted/30"
          >
            <FormInput
              control={form.control}
              name={`guardians.${index}.relation`}
              label="صلة القرابة"
              placeholder="أب، أم، أخ..."
            />
            <FormInput
              control={form.control}
              name={`guardians.${index}.phone`}
              label="رقم الهاتف"
              placeholder="01xxxxxxxxx"
              dir="ltr"
            />
            {/* Always keep at least one guardian row */}
            {fields.length > 1 && (
              <div className="md:col-span-2 flex justify-end">
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={() => remove(index)}
                >
                  <Trash2 size={14} className="ml-1" />
                  حذف
                </Button>
              </div>
            )}
          </div>
        ))}
      </section>
      ── متابعة الحفظ ──
      <section className="space-y-4">
        <h2 className="text-base font-semibold text-muted-foreground border-b pb-2">
          متابعة الحفظ
        </h2>

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
      </section>
      ── الأنشطة المسجّل فيها ── ── ملاحظات ──
      <FormTextarea
        control={form.control}
        name="notes"
        label="ملاحظات إضافية"
        placeholder="أي ملاحظات تخص الطالب..."
        maxLength={500}
      />
      ── أزرار الإرسال ──
      <div className="flex justify-end gap-3 pt-2">
        <Button
          type="button"
          variant="ghost"
          onClick={() => router.back()}
          disabled={isPending}
        >
          إلغاء
        </Button>
        <Button type="submit" disabled={isPending}>
          {isPending && <Loader2 className="ml-2 animate-spin" size={16} />}
          {isEdit ? "تحديث البيانات" : "تسجيل الطالب"}
        </Button>
      </div>
    </form>
  );
}
