
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { groupSchema, GroupInput } from "@/schemas/group.schema";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { FormInput } from "../form/FormInput";
import { FormSelect } from "../form/FormSelect";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Serialize } from "@/types/serialized";
import { IGroup } from "@/models/group.model";
import { saveGroup } from "@/actions/group.actions";
import { useTransition } from "react";

interface Props {
  initialData?: Serialize<IGroup>;
  groupId?: string;
  category: string;
  teachers: { label: string; value: string }[];
  students: { label: string; value: string }[];
}

export default function GroupForm({
  initialData,
  groupId,
  category,
  teachers,
  students,
}: Props) {
  const router = useRouter();
  const isEdit = !!groupId;
  const [isPending, startTransition] = useTransition();
  const form = useForm<GroupInput>({
    resolver: zodResolver(groupSchema),
    defaultValues: {
      name: initialData?.name || "",
      activity: (initialData?.activity || category) as GroupInput["activity"],
      teacherId: initialData?.teacherId || "",
      studentIds: (initialData?.studentIds as unknown as string[]) || [],

      // Conversion of type 'Serialize<ObjectId>[] | undefined' to type 'string[]' may be a mistake because neither type sufficiently overlaps with the other. If this was intentional, convert the expression to 'unknown' first.
      //   Type 'Serialize<ObjectId>[]' is not comparable to type 'string[]'.
      //     Type 'Serialize<ObjectId>' is not comparable to type 'string'.

      appointment: initialData?.appointment || "",
      notes: initialData?.notes || "",
    },
  });

  const onSubmit = async (data: GroupInput) => {
    startTransition(async () => {
      const result = await saveGroup(data, groupId);

      if (result.status !== "success") {
        toast.error(result.message);
        return;
      }

      toast.success(result.message);
      router.push(`/dashboard/groups/${category}`);
    });
  };
  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      //     Argument of type '(data: GroupInput) => Promise<void>' is not assignable to parameter of type 'SubmitHandler<TFieldValues>'.
      // Types of parameters 'data' and 'data' are incompatible.
      //   Type 'TFieldValues' is not assignable to type '{ name: string; activity: "quran" | "tarbiya" | "tajweed" | "maqraa" | "playground"; teacherId: string; studentIds: string[]; appointment?: string | undefined; notes?: string | undefined; }'.
      //     Type 'FieldValues' is missing the following properties from type '{ name: string; activity: "quran" | "tarbiya" | "tajweed" | "maqraa" | "playground"; teacherId: string; studentIds: string[]; appointment?: string | undefined; notes?: string | undefined; }': name, activity, teacherId, studentIds

      className="space-y-8 bg-white p-6 rounded-xl border shadow-sm"
    >
      {/* حقل النشاط: مخفي كـ Input، ومعروض كـ Badge للقراءة فقط */}
      <div className="bg-gray-50 p-4 rounded-lg flex items-center justify-between border">
        <span className="text-sm text-gray-500 font-medium">نوع النشاط</span>
        <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-bold">
          {category === "quran" ? "قرآن كريم" : category}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormInput
          control={form.control}
          name="name"
          label="اسم المجموعة / الحلقة"
          placeholder="مثال: حلقة الفجر"
        />

        <FormSelect
          control={form.control}
          name="teacherId"
          label="المعلم المسؤول"
          options={teachers}
          placeholder="-- اختر معلماً --" // لو الـ FormSelect بتاعك بيدعم الـ placeholder
        />

        <FormInput
          control={form.control}
          name="appointment"
          label="المواعيد (اختياري)"
          placeholder="مثال: السبت والثلاثاء بعد العصر"
        />
      </div>

      {/* منطقة اختيار الطلاب - هنا نستخدم Checkboxes مخصصة لأنها مصفوفة (Array of IDs) */}
      <div className="space-y-3">
        <Label className="text-lg font-semibold border-b pb-2 block">
          الطلاب المقيدين في هذه المجموعة
        </Label>
        {form.formState.errors.studentIds && (
          <span className="text-destructive text-sm font-medium block">
            {form.formState.errors.studentIds.message}
          </span>
        )}

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 border p-4 rounded-lg max-h-72 overflow-y-auto bg-gray-50/50">
          {students.map((student) => (
            <div
              key={student.value}
              className="flex items-center gap-3 bg-white p-2 rounded border hover:border-primary transition-colors"
            >
              <Checkbox
                id={`student-${student.value}`}
                checked={form.watch("studentIds")?.includes(student.value)}
                onCheckedChange={(checked) => {
                  const current = form.getValues("studentIds") || [];
                  if (checked) {
                    form.setValue("studentIds", [...current, student.value], {
                      shouldValidate: true,
                    });
                  } else {
                    form.setValue(
                      "studentIds",
                      current.filter((id) => id !== student.value),
                      { shouldValidate: true },
                    );
                  }
                }}
              />
              <label
                htmlFor={`student-${student.value}`}
                className="text-sm cursor-pointer select-none flex-1"
              >
                {student.label}
              </label>
            </div>
          ))}
          {students.length === 0 && (
            <div className="col-span-full text-center text-gray-500 py-4">
              لا يوجد طلاب مسجلين في المسجد حالياً.
            </div>
          )}
        </div>
      </div>

      <div className="space-y-2">
        {/* لو عندك FormTextarea استخدمه هنا بدل الـ Input العادي */}
        <FormInput
          control={form.control}
          name="notes"
          label="ملاحظات (اختياري)"
        />
      </div>

      <div className="flex justify-end gap-4 pt-4 border-t">
        <Button type="button" variant="outline" onClick={() => router.back()}>
          إلغاء
        </Button>
        <Button type="submit" disabled={isPending}>
          {isPending
            ? "جاري الحفظ..."
            : isEdit
              ? "تحديث البيانات"
              : "إنشاء المجموعة"}
        </Button>
      </div>
    </form>
  );
}
