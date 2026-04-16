import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db/connect";
import User from "@/models/User";
import {
  generateResetToken,
  RESET_TOKEN_EXPIRES_HOURS,
} from "@/lib/auth/reset-token";
import { Resend } from "resend";
import { z } from "zod";
import { apiError } from "@/lib/errors";

const resend = new Resend(process.env.RESEND_API_KEY);

const schema = z.object({
  email: z.email(),
});

/**
 * POST /api/auth/forgot-password
 * Generates a reset token, stores its hash, sends email with plain token.
 *
 * Always returns 200 — we don't reveal whether email exists (security).
 */

export async function POST(req: NextRequest) {
  try {
    const parsed = schema.safeParse(await req.json());
    if (!parsed.success) return apiError("بريد إلكتروني غير صحيح", 400);

    await connectDB();

    const user = await User.findOne({ email: parsed.data.email });

    // Always 200 — don't reveal if email exists
    if (!user || user.provider !== "credentials") {
      return NextResponse.json({
        message: "إذا كان البريد مسجلاً، ستصلك رسالة",
      });
    }

    const { token, hash } = generateResetToken();
    const expires = new Date(
      Date.now() + RESET_TOKEN_EXPIRES_HOURS * 60 * 60 * 1000,
    );

    await User.findByIdAndUpdate(user._id, {
      passwordResetToken: hash,
      passwordResetExpires: expires,
    });

    const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password/${token}`;

    await resend.emails.send({
      from: "noreply@yourdomain.com",
      to: user.email,
      subject: "إعادة تعيين كلمة المرور",
      html: `
        <div dir="rtl" style="font-family: sans-serif; max-width: 500px; margin: auto;">
          <h2>إعادة تعيين كلمة المرور</h2>
          <p>اضغط على الرابط التالي لإعادة تعيين كلمة المرور. صالح لمدة ساعة واحدة.</p>
          <a href="${resetUrl}" style="
            display: inline-block;
            background: #1B6B3A;
            color: white;
            padding: 12px 24px;
            border-radius: 8px;
            text-decoration: none;
            margin: 16px 0;
          ">إعادة تعيين كلمة المرور</a>
          <p style="color: #666; font-size: 14px;">
            إذا لم تطلب ذلك، تجاهل هذه الرسالة.
          </p>
        </div>
      `,
    });

    return NextResponse.json({ message: "إذا كان البريد مسجلاً، ستصلك رسالة" });
  } catch (err) {
    console.error("[POST /api/auth/forgot-password]", err);
    return apiError("خطأ في الخادم", 500);
  }
}
