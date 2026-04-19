"use server";

/**
 * @file auth.actions.ts
 * @description Centralized Server Actions for user authentication, registration, and password management.
 * All functions return a unified JSend `ActionResponse`.
 */

// 1. Local Libraries & Auth
import { generateResetToken, hashToken } from "@/lib/auth/reset-token";
import { sendPasswordResetEmail } from "@/lib/mail";
import { signIn, signOut } from "@/lib/auth/auth";
import { connectDB } from "@/lib/db/db";
import {
  handleActionError,
  firstZodIssue,
  fail,
  ok,
} from "@/lib/action-response";
import type { ActionResponse } from "@/lib/action-response";
// 2. Models
import { User } from "@/models/user.model";
// 3. Schemas
import {
  forgotPasswordSchema,
  resetPasswordSchema,
  type RegisterInput,
  type LoginInput,
  registerSchema,
  loginSchema,
} from "@/schemas/auth.schema";

// ─── Authentication ──────────────────────────────────────────────────────────

/**
 * Authenticates a user with email and password.
 */
export async function loginUser(values: LoginInput): Promise<ActionResponse> {
  const parsed = loginSchema.safeParse(values);
  if (!parsed.success) return fail(firstZodIssue(parsed.error));

  try {
    await signIn("credentials", {
      email: parsed.data.email,
      password: parsed.data.password,
      redirect: false,
    });

    return ok(undefined, "مرحباً بعودتك! تم تسجيل الدخول بنجاح.");
  } catch (error) {
    return handleActionError(error, "loginUser");
  }
}

/**
 * Registers a new user and automatically logs them in upon success.
 */
export async function registerUser(
  data: RegisterInput,
): Promise<ActionResponse> {
  const parsed = registerSchema.safeParse(data);
  if (!parsed.success) return fail(firstZodIssue(parsed.error));

  try {
    await connectDB();

    const existingUser = await User.findOne({ email: parsed.data.email });
    if (existingUser) {
      return fail("عذراً، هذا البريد الإلكتروني مسجل لدينا بالفعل.");
    }

    await User.create({
      name: parsed.data.name,
      email: parsed.data.email,
      password: parsed.data.password, // Hook in the model handles hashing
      provider: "credentials",
    });

    // Auto sign-in
    await signIn("credentials", {
      email: parsed.data.email,
      password: parsed.data.password,
      redirect: false,
    });

    return ok(undefined, "أهلاً بك معنا! تم إنشاء حسابك وتسجيل دخولك بنجاح.");
  } catch (error) {
    // If auto sign-in fails after creation, we still want to inform the user it was created.
    if (
      error &&
      typeof error === "object" &&
      "name" in error &&
      error.name === "AuthError"
    ) {
      return ok(undefined, "تم إنشاء الحساب بنجاح، يرجى تسجيل الدخول يدوياً.");
    }
    return handleActionError(error, "registerUser");
  }
}

/**
 * Signs out the current user and redirects to the login page.
 */
export async function logoutUser(): Promise<void> {
  await signOut({ redirectTo: "/login" });
}

// ─── Password Management ─────────────────────────────────────────────────────

/**
 * Generates a reset token and sends a recovery email.
 * Prevents email enumeration by always returning a success message.
 */

export async function requestPasswordReset(
  email: string,
): Promise<ActionResponse> {
  const parsed = forgotPasswordSchema.safeParse({ email });
  if (!parsed.success) return fail("يرجى إدخال بريد إلكتروني صالح.");

  try {
    await connectDB();

    const user = await User.findOne({ email: parsed.data.email });

    // Security: Do not reveal if the email exists or not
    if (!user || user.provider !== "credentials") {
      return ok(
        undefined,
        "إذا كان البريد مسجلاً لدينا، سيصلك رابط إعادة التعيين قريباً.",
      );
    }

    const { token, hash } = generateResetToken();
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    user.resetPasswordToken = hash;
    user.resetPasswordExpires = expiresAt;
    await user.save();

    const emailResult = await sendPasswordResetEmail(user.email, token);

    if (!emailResult.success) {
      // Internal log for admins, generic fail for user
      console.error("[Mail Error]:", emailResult.error);
      return fail(
        "واجهنا مشكلة في إرسال البريد الإلكتروني، يرجى المحاولة لاحقاً.",
      );
    }

    return ok(
      undefined,
      "إذا كان البريد مسجلاً لدينا، سيصلك رابط إعادة التعيين قريباً.",
    );
  } catch (error) {
    return handleActionError(error, "requestPasswordReset");
  }
}

// // ─── Reset Password ────────────────────────────────────────────────────────


/**
 * Validates the reset token and updates the user's password.
 */
export async function resetPassword(
  token: string,
  password: string,
): Promise<ActionResponse> {
  const parsed = resetPasswordSchema.safeParse({ token, password });
  if (!parsed.success) return fail(firstZodIssue(parsed.error));

  try {
    await connectDB();
    const hash = hashToken(parsed.data.token);

    const user = await User.findOne({
      resetPasswordToken: hash,
      resetPasswordExpires: { $gt: new Date() },
    });

    if (!user) {
      return fail("رابط الاستعادة غير صالح أو منتهي الصلاحية.");
    }

    user.password = parsed.data.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    return ok(
      undefined,
      "تم تغيير كلمة المرور بنجاح، يمكنك الآن تسجيل الدخول.",
    );
  } catch (error) {
    return handleActionError(error, "resetPassword");
  }
}
