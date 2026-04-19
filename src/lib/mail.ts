// src/lib/mail.ts
import { Resend } from "resend";

export const resend = new Resend(process.env.RESEND_API_KEY!);

const domain =
  process.env.NODE_ENV === "production"
    ? "noreply@masjid-erp.com"
    : "onboarding@resend.dev";

export async function sendPasswordResetEmail(email: string, token: string) {
  const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${token}`;

  try {
    const { data, error } = await resend.emails.send({
      from: `Masjid ERP <${domain}>`,
      to: email,
      subject: "إعادة تعيين كلمة المرور - Masjid ERP",
      html: `
        <div style="font-family: Arial, sans-serif; dir: rtl; text-align: right;">
          <h2>إعادة تعيين كلمة المرور</h2>
          <p>لقد طلبنا إعادة تعيين كلمة المرور الخاصة بحسابك.</p>
          <p>اضغط على الرابط التالي لتعيين كلمة مرور جديدة:</p>
          <a href="${resetUrl}" style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: #fff; text-decoration: none; border-radius: 5px;">إعادة تعيين كلمة المرور</a>
          <p>الرابط صالح لمدة ساعة واحدة فقط.</p>
          <br>
          <p>إذا لم تقم بهذا الطلب، يمكنك تجاهل هذه الرسالة.</p>
        </div>
      `,
    });

    if (error) {
      console.error("[Resend Error]:", error);
      return { success: false, error: error.message };
    }

    console.log("[Resend Success]:", data);
    return { success: true, data };
  } catch (error) {
    console.error("[Mail Function Error]:", error);
    return { success: false, error: "حدث خطأ غير متوقع أثناء إرسال البريد" };
  }
}
