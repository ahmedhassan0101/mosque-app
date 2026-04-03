import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { StudentFormData } from "@/lib/validations/student";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
export function useStudentMutation(studentId?: string) {
  const isEdit = !!studentId;
  const router = useRouter();

  return useMutation({
    mutationFn: async (data: StudentFormData) => {
      console.log("🚀 ~ useStudentMutation ~ data:", data);
      const url = isEdit ? `/api/students/${studentId}` : "/api/students";
      const method = isEdit ? "put" : "post";

      const response = await axios({ method, url, data });
      return response.data;
    },
    onSuccess: () => {
      toast.success(
        isEdit ? "تم تحديث بيانات الطالب" : "تم تسجيل الطالب بنجاح",
      );
      router.push("/students");
      router.refresh();
    },
    onError: (error) => {
      console.error("Error submitting student form:", error);
      
      toast.error("حدث خطأ أثناء حفظ البيانات");
    },
  });
}
// data.birthDate.getFullYear()
