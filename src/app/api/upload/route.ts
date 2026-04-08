/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { cloudinary, UPLOAD_CONFIG } from "@/lib/cloudinary/config";
import { getMosqueId } from "@/lib/auth/get-context";

export async function POST(req: NextRequest) {
  try {
    const mosqueId = await getMosqueId();

    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { error: "لم يتم إرسال أي ملف" },
        { status: 400 },
      );
    }

    // Validate client-side before upload
    const MAX_SIZE = 5 * 1024 * 1024;
    const ALLOWED_MIME = ["image/jpeg", "image/png", "image/webp"];

    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { error: "حجم الصورة يجب أن يكون أقل من 5MB" },
        { status: 400 },
      );
    }

    if (!ALLOWED_MIME.includes(file.type)) {
      return NextResponse.json(
        { error: "يُسمح فقط بصيغ JPG و PNG و WebP" },
        { status: 400 },
      );
    }

    // Convert File → Buffer → base64
    const buffer = Buffer.from(await file.arrayBuffer());
    const base64 = `data:${file.type};base64,${buffer.toString("base64")}`;

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(base64, {
      ...UPLOAD_CONFIG,
      folder: `mosque-app/${mosqueId}/students`, // مجلد لكل مسجد
      public_id: `student_${Date.now()}`,
    });

    return NextResponse.json({
      url: result.secure_url,
      publicId: result.public_id,
    });
  } catch (e: any) {
    if (e.message === "UNAUTHORIZED")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    console.error("[POST /api/upload]", e);
    return NextResponse.json(
      { error: "فشل رفع الصورة، حاول مرة أخرى" },
      { status: 500 },
    );
  }
}
