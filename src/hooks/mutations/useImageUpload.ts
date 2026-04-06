import { useMutation } from "@tanstack/react-query";
import { api } from "@/lib/api/client";
import { toast } from "sonner";
import type { AppError } from "@/lib/api/errors";

interface UploadResult {
  url: string;
  publicId: string;
}

export function useImageUpload() {
  return useMutation<UploadResult, AppError, File>({
    mutationFn: async (file: File) => {
      // Validate client-side before upload
      const MAX_SIZE = 5 * 1024 * 1024; // 5MB
      const ALLOWED = ["image/jpeg", "image/png", "image/webp"];

      if (file.size > MAX_SIZE) {
        throw {
          code: "UPLOAD_ERROR",
          message: "حجم الصورة يجب أن يكون أقل من 5MB",
        } as AppError;
      }

      if (!ALLOWED.includes(file.type)) {
        throw {
          code: "UPLOAD_ERROR",
          message: "يُسمح فقط بصيغ JPG و PNG و WebP",
        } as AppError;
      }

      const formData = new FormData();
      formData.append("file", file);

      const { data } = await api.post("/api/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      return data;
    },

    onError: (error: AppError) => {
      toast.error(error.message);
    },
  });
}
