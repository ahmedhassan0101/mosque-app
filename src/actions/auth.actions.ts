"use server";

/**
 * @file auth.actions.ts
 * @description Centralized Server Actions for user authentication, registration, and password management.
 * All functions return a unified JSend `ActionResponse`.
 */

// 1. Local Libraries & Auth
import {
  generateVerifyToken,
  generateVerifyTokenExpiry,
} from "@/lib/auth/verify-token";
import { generateResetToken, hashToken } from "@/lib/auth/reset-token";
import { sendPasswordResetEmail, sendVerificationEmail } from "@/lib/mail";
import { signIn, signOut } from "@/lib/auth/auth";
import { connectDB } from "@/lib/db/client";
import {
  handleActionError,
  firstZodIssue,
  fail,
  ok,
} from "@/lib/utils/action-response";
import type { ActionResponse } from "@/lib/utils/action-response";
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
  verifyEmailSchema,
  resendVerificationSchema,
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
 * Registers a new user, creates a verification token, and sends an email.
 * Note: Auto sign-in is disabled to ensure email verification first (UX Best Practice).
 */
export async function registerUser(
  data: RegisterInput,
): Promise<ActionResponse<{ email: string }>> {
  // Added generic type to fix TS error

  // 1. Validate input data using Zod schema
  const parsed = registerSchema.safeParse(data);
  if (!parsed.success) return fail(firstZodIssue(parsed.error));

  try {
    await connectDB();

    // 2. Check if user already exists in the database
    const existingUser = await User.findOne({ email: parsed.data.email });
    if (existingUser) {
      return fail("عذراً، هذا البريد الإلكتروني مسجل لدينا بالفعل.");
    }

    // 3. Generate secure verification token and expiry (24 hours)
    const verifyToken = generateVerifyToken();
    const verifyTokenExpiry = generateVerifyTokenExpiry(24);

    // 4. Create the user record (Password hashing is handled by Mongoose pre-save hook)
    await User.create({
      name: parsed.data.name,
      email: parsed.data.email,
      password: parsed.data.password,
      provider: "credentials",
      verifyToken,
      verifyTokenExpiry,
    });

    // 5. Send the verification email using Resend
    // This is non-blocking to the user flow; if it fails, they can resend from the waiting page
    const emailResult = await sendVerificationEmail(
      parsed.data.email,
      verifyToken,
    );

    if (!emailResult.success) {
      console.error("[Mail Error - register]:", emailResult.error);
    }

    // 6. Return success response with user email for potential UI feedback
    return ok(
      { email: parsed.data.email },
      "تم إنشاء حسابك بنجاح! يرجى التحقق من بريدك الإلكتروني لتفعيل الحساب.",
    );
  } catch (error) {
    // 7. Centralized error handling (Database errors, server crashes, etc.)
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

/**
 * @file actions/email-verify.actions.ts
 * @description Server Actions for email verification flow:
 *  - verifyEmailToken: validates token and marks user as verified
 *  - resendVerificationEmail: generates a fresh token and resends the email
 */

// ─── Verify Token ─────────────────────────────────────────────────────────────

/**
 * Verifies a user's email address using the token from their email link.
 * Finds the user by token, checks expiry, marks emailVerified, and clears tokens.
 * @param token - The raw UUID token from the URL search param
 */
export async function verifyEmailToken(token: string): Promise<ActionResponse> {
  const parsed = verifyEmailSchema.safeParse({ token });
  if (!parsed.success) return fail("رمز التحقق غير صالح أو مشوّه.");

  try {
    await connectDB();

    const user = await User.findOne({
      verifyToken: parsed.data.token,
      verifyTokenExpiry: { $gt: new Date() },
    });

    if (!user) {
      return fail("رابط التحقق غير صالح أو انتهت صلاحيته. يرجى طلب رابط جديد.");
    }

    // Already verified (idempotent check)
    if (user.emailVerified) {
      return ok(
        undefined,
        "بريدك الإلكتروني مؤكَّد بالفعل. يمكنك تسجيل الدخول.",
      );
    }

    user.emailVerified = new Date();
    user.verifyToken = undefined;
    user.verifyTokenExpiry = undefined;
    await user.save();

    return ok(
      undefined,
      "تم تأكيد بريدك الإلكتروني بنجاح! يمكنك الآن تسجيل الدخول.",
    );
  } catch (error) {
    return handleActionError(error, "verifyEmailToken");
  }
}

// ─── Resend Verification Email ────────────────────────────────────────────────

/**
 * Generates a new verification token and resends the verification email.
 * Prevents resending if the user is already verified.
 * @param email - The email address to resend the verification link to
 */
export async function resendVerificationEmail(
  email: string,
): Promise<ActionResponse> {
  const parsed = resendVerificationSchema.safeParse({ email });
  if (!parsed.success) return fail("بريد إلكتروني غير صالح.");

  try {
    await connectDB();

    const user = await User.findOne({ email: parsed.data.email });

    // Security: Do not reveal if user exists
    if (!user) {
      return ok(undefined, "إذا كان البريد مسجلاً، ستصلك رسالة التحقق قريباً.");
    }

    if (user.emailVerified) {
      return fail("هذا البريد الإلكتروني مؤكَّد بالفعل. يمكنك تسجيل الدخول.");
    }

    // Generate fresh token
    const token = generateVerifyToken();
    user.verifyToken = token;
    user.verifyTokenExpiry = generateVerifyTokenExpiry(24);
    await user.save();

    const emailResult = await sendVerificationEmail(user.email, token);

    if (!emailResult.success) {
      console.error("[Resend Error - resendVerification]:", emailResult.error);
      return fail("واجهنا مشكلة في إرسال البريد، يرجى المحاولة بعد قليل.");
    }

    return ok(
      undefined,
      "تم إرسال رابط التحقق إلى بريدك الإلكتروني. يرجى التحقق من صندوق الوارد.",
    );
  } catch (error) {
    return handleActionError(error, "resendVerificationEmail");
  }
}
