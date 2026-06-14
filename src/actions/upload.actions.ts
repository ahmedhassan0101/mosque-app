// src/actions/upload.actions.ts
"use server";

import {
  ok,
  fail,
  handleActionError,
  ActionResponse,
} from "@/lib/utils/action-response";
import { getMosqueId } from "@/lib/auth/get-context";
import { cloudinary, UPLOAD_CONFIG } from "@/lib/cloudinary/config";

type UploadData = { url: string; publicId: string };

export async function uploadImageAction(
  formData: FormData,
): Promise<ActionResponse<UploadData>> {
  try {
    const mosqueId = await getMosqueId();

    // استخراج الملف واسم المجلد من الـ FormData
    const file = formData.get("file") as File | null;
    const folderPath = (formData.get("folderPath") as string) || "general"; // general كقيمة افتراضية

    if (!file || file.size === 0) {
      return fail("لم يتم إرسال أي ملف صالح.");
    }

    // Server-side Validation
    const MAX_SIZE = 5 * 1024 * 1024; // 5MB
    const ALLOWED_MIME = ["image/jpeg", "image/png", "image/webp"];

    if (file.size > MAX_SIZE) {
      return fail("حجم الصورة يجب أن يكون أقل من 5 ميجابايت.");
    }

    if (!ALLOWED_MIME.includes(file.type)) {
      return fail("يُسمح فقط بصيغ JPG و PNG و WebP.");
    }

    // Convert File → Buffer → base64
    const buffer = Buffer.from(await file.arrayBuffer());
    const base64 = `data:${file.type};base64,${buffer.toString("base64")}`;

    // Upload to Cloudinary with Dynamic Folder
    const result = await cloudinary.uploader.upload(base64, {
      ...UPLOAD_CONFIG,
      folder: `mosque-app/${mosqueId}/${folderPath}`,
      public_id: `${folderPath}_${Date.now()}`,
    });

    return ok({
      url: result.secure_url,
      publicId: result.public_id,
    });
  } catch (error) {
    return handleActionError(error, "uploadImageAction");
  }
}
