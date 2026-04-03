import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useRouter } from "next/navigation";
import { toast } from "sonner";


type SheikhData = { name: string; phone?: string; notes?: string };


export function useSheikhMutation(sheikhId?: string) {
  const router = useRouter();
  const isEdit = !!sheikhId;

  return useMutation({
    mutationFn: async (data: SheikhData) => {
      const url = isEdit ? `/api/sheikhs/${sheikhId}` : "/api/sheikhs";
      const method = isEdit ? "put" : "post";

      const response = await axios({ method, url, data });
      return response.data;
    },
    onSuccess: () => {
      toast.success(
        isEdit ? "تم تحديث البيانات بنجاح" : "تم إضافة الشيخ بنجاح"
      );
      router.push("/sheikhs");
      router.refresh();
    },
    onError: (error) => {
      console.error("Mutation error:", error);
      toast.error("حدث خطأ أثناء حفظ البيانات");
    },
  });
}