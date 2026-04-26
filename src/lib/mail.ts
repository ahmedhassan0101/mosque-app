// src/lib/mail.ts
import { Resend } from "resend";

export const resend = new Resend(process.env.RESEND_API_KEY!);

const FROM_ADDRESS =
  process.env.NODE_ENV === "production"
    ? "noreply@masjid-erp.com"
    : "onboarding@resend.dev";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL!;

// ─── Password Reset ───────────────────────────────────────────────────────────

/**
 * Sends a password reset email with a secure link.
 * @param email - The recipient's email address
 * @param token - The plain-text reset token (not hashed)
 */
export async function sendPasswordResetEmail(email: string, token: string) {
  const resetUrl = `${APP_URL}/reset-password?token=${token}`;

  try {
    const { data, error } = await resend.emails.send({
      from: `Masjid ERP <${FROM_ADDRESS}>`,
      to: email,
      subject: "إعادة تعيين كلمة المرور - Masjid ERP",
      html: `
        <div style="font-family: Arial, sans-serif; direction: rtl; text-align: right; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #1a1a1a;">إعادة تعيين كلمة المرور</h2>
          <p>لقد تلقينا طلباً لإعادة تعيين كلمة المرور الخاصة بحسابك.</p>
          <p>اضغط على الزر أدناه لتعيين كلمة مرور جديدة:</p>
          <a href="${resetUrl}" style="display: inline-block; padding: 12px 24px; background-color: #2563eb; color: #fff; text-decoration: none; border-radius: 8px; margin: 16px 0; font-weight: bold;">
            إعادة تعيين كلمة المرور
          </a>
          <p style="color: #6b7280; font-size: 14px;">الرابط صالح لمدة ساعة واحدة فقط.</p>
          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 24px 0;" />
          <p style="color: #9ca3af; font-size: 12px;">إذا لم تقم بهذا الطلب، يمكنك تجاهل هذه الرسالة بأمان.</p>
        </div>
      `,
    });

    if (error) {
      console.error("[Resend Error - Reset]:", error);
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (error) {
    console.error("[Mail Function Error - Reset]:", error);
    return { success: false, error: "حدث خطأ غير متوقع أثناء إرسال البريد" };
  }
}

// ─── Email Verification ───────────────────────────────────────────────────────

/**
 * Sends an account verification email with a secure link.
 * @param email - The recipient's email address
 * @param token - The plain-text UUID verification token
 */

// export async function sendVerificationEmail(email: string, token: string) {
//   const verifyUrl = `${APP_URL}/verify-email?token=${token}&email=${encodeURIComponent(email)}`;

//   // ... باقي الكود كما هو
// }

export async function sendVerificationEmail(email: string, token: string) {
  const verifyUrl = `${APP_URL}/verify-email?token=${token}&email=${encodeURIComponent(email)}`;

  try {
    const { data, error } = await resend.emails.send({
      from: `Masjid ERP <${FROM_ADDRESS}>`,
      to: email,
      subject: "تأكيد البريد الإلكتروني - Masjid ERP",
      html: `
        <div style="font-family: Arial, sans-serif; direction: rtl; text-align: right; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #1e3a5f, #2563eb); padding: 32px; border-radius: 12px 12px 0 0; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 24px;">🕌 Masjid ERP</h1>
          </div>
          <div style="background: #ffffff; padding: 32px; border: 1px solid #e5e7eb; border-radius: 0 0 12px 12px;">
            <h2 style="color: #1a1a1a; margin-top: 0;">مرحباً بك! تأكيد البريد الإلكتروني</h2>
            <p style="color: #374151; line-height: 1.7;">
              شكراً لتسجيلك في منظومة Masjid ERP. خطوة واحدة تفصلك عن الدخول — يرجى تأكيد عنوان بريدك الإلكتروني.
            </p>
            <div style="text-align: center; margin: 32px 0;">
              <a href="${verifyUrl}" style="display: inline-block; padding: 14px 32px; background-color: #2563eb; color: #fff; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px;">
                تأكيد البريد الإلكتروني
              </a>
            </div>
            <p style="color: #6b7280; font-size: 14px;">هذا الرابط صالح لمدة <strong>24 ساعة</strong>.</p>
            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 24px 0;" />
            <p style="color: #9ca3af; font-size: 12px; text-align: center;">
              إذا لم تقم بإنشاء هذا الحساب، يمكنك تجاهل هذه الرسالة بأمان.
            </p>
          </div>
        </div>
      `,
    });

    if (error) {
      console.error("[Resend Error - Verify]:", error);
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (error) {
    console.error("[Mail Function Error - Verify]:", error);
    return {
      success: false,
      error: "حدث خطأ غير متوقع أثناء إرسال بريد التحقق",
    };
  }
}
