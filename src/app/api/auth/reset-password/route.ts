import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db/connect";
import User from "@/models/User";
import { hashToken } from "@/lib/auth/reset-token";
import { z } from "zod";
import { apiError } from "@/lib/errors";

const schema = z.object({
  token: z.string().min(1),
  password: z.string().min(8, "كلمة المرور 8 أحرف على الأقل"),
});

/**
 * POST /api/auth/reset-password
 * Verifies token hash, checks expiry, updates password.
 */
export async function POST(req: NextRequest) {
  try {
    const parsed = schema.safeParse(await req.json());
    if (!parsed.success) {
      return apiError(parsed.error.issues[0].message, 400);
    }

    const hash = hashToken(parsed.data.token);

    await connectDB();

    const user = await User.findOne({
      passwordResetToken: hash,
      passwordResetExpires: { $gt: new Date() }, // not expired
    }).select("+passwordResetToken +passwordResetExpires");

    if (!user) {
      return apiError("الرابط غير صحيح أو منتهي الصلاحية", 400);
    }

    user.password = parsed.data.password; // pre-save hook hashes it
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    return NextResponse.json({ message: "تم تغيير كلمة المرور بنجاح" });
  } catch (err) {
    console.error("[POST /api/auth/reset-password]", err);
    return apiError("خطأ في الخادم", 500);
  }
}
