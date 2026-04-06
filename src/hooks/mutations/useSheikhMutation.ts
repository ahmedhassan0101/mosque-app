// src\hooks\mutations\useSheikhMutation.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api/client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import type { AppError } from "@/lib/api/errors";
import type { SheikhFormData } from "@/lib/validations/sheikh";

/**
 * Mutation for creating or updating a sheikh
 * - on success: invalidate cache and navigate to the sheikhs list
 */
export function useSheikhMutation(sheikhId?: string) {
  const isEdit = !!sheikhId;
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation<{ sheikh: unknown }, AppError, SheikhFormData>({
    mutationFn: async (data) => {
      const url = isEdit ? `/api/sheikhs/${sheikhId}` : "/api/sheikhs";
      const method = isEdit ? "put" : "post";
      const { data: res } = await api({ method, url, data });
      return res;
    },

    onSuccess: () => {
      // Invalidate list + individual cache
      queryClient.invalidateQueries({ queryKey: ["sheikhs"] });
      if (isEdit && sheikhId)
        queryClient.invalidateQueries({ queryKey: ["sheikhs", sheikhId] });

      toast.success(isEdit ? "تم تحديث بيانات الشيخ" : "تم إضافة الشيخ بنجاح");
      router.push("/sheikhs");
    },

    onError: (error: AppError) => {
      toast.error(error.message ?? "حدث خطأ، حاول مرة أخرى");
    },
  });
}

/**
 * Mutation to delete a sheikh
 */
export function useDeleteSheikh() {
  const queryClient = useQueryClient();
  // const router      = useRouter();

  return useMutation<void, AppError, string>({
    mutationFn: async (id) => {
      await api.delete(`/api/sheikhs/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sheikhs"] });
      toast.success("تم حذف الشيخ");
    },
    onError: (error: AppError) => {
      toast.error(error.message ?? "تعذّر الحذف");
    },
  });
}
