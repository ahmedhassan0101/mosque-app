/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/temp/client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import type { StudentFormData } from "@/lib/validations/student";
import type { AppError } from "@/temp/errors-one";

export function useStudentMutation(studentId?: string) {
  const isEdit = !!studentId;
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation<any, AppError, StudentFormData>({
    mutationFn: async (data) => {
      const url = isEdit ? `/api/students/${studentId}` : "/api/students";
      const method = isEdit ? "put" : "post";
      const { data: res } = await api({ method, url, data });
      return res;
    },

    onSuccess: () => {
      // Invalidate list + individual cache
      queryClient.invalidateQueries({ queryKey: ["students"] });
      toast.success(
        isEdit ? "تم تحديث بيانات الطالب" : "تم تسجيل الطالب بنجاح",
      );
      router.push("/students");
    },

    onError: (error: AppError) => {
      // لو في field معين فيه مشكلة → رسالة محددة
      if (error.field) {
        toast.error(`خطأ في حقل "${error.field}": ${error.message}`);
      } else {
        toast.error(error.message);
      }
    },
  });
}
