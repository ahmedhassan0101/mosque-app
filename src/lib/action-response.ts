/**
 * @file action-response.ts
 * @description Centralized JSend-style response formatters and global error handler for Server Actions.
 */
/**
 * @file action-response.ts
 * @description Factory helpers that eliminate JSend boilerplate in Server Actions.
 * Import and use these instead of manually constructing response objects.
 *
 * @example
 * return ok({ userId: user.id }, "تم التسجيل بنجاح");
 * return fail("البريد الإلكتروني مستخدم بالفعل");
 * return err("حدث خطأ غير متوقع");
 */
import { AuthError } from "next-auth";
import { ZodError } from "zod";

// ─── Types ──────────────────────────────────────────────────────────────

export type ActionResponse<T = undefined> =
  | { status: "success"; data?: T; message?: string }
  | { status: "fail"; message: string }
  | { status: "error"; message: string };

// ─── Response Factories ──────────────────────────────────────────────────

export function ok<T = undefined>(
  data?: T,
  message?: string,
): ActionResponse<T> {
  return { status: "success", ...(data !== undefined && { data }), message };
}

export function fail(message: string): ActionResponse<never> {
  return { status: "fail", message };
}

export function err(message: string): ActionResponse<never> {
  return { status: "error", message };
}

// ─── Error Handlers ──────────────────────────────────────────────────────

/**
 * Extracts the first human-readable message from a Zod validation error.
 */
export function firstZodIssue(
  error: ZodError | { issues: { message: string }[] },
): string {
  return error.issues[0]?.message ?? "البيانات المدخلة غير صالحة.";
}

/**
 * A centralized global error handler for Server Actions catch blocks.
 * Parses NextAuth errors, standard errors, and logs them appropriately.
 * @param error - The error object caught in the catch block.
 * @param context - The name of the function where the error occurred (for debugging).
 */
export function handleActionError(
  error: unknown,
  context: string,
): ActionResponse<never> {
  // 1. Log the error internally for the dev team
  console.error(`[Error in ${context}]:`, error);

  // 2. Handle Next.js Redirects (Crucial: Next.js uses errors to throw redirects)
  // If you ever use redirect() inside an action, you MUST re-throw the error.
  if (error instanceof Error && error.message === "NEXT_REDIRECT") {
    throw error;
  }

  // 3. Handle NextAuth specific errors
  if (error instanceof AuthError) {
    switch (error.type) {
      case "CredentialsSignin":
        return fail("البريد الإلكتروني أو كلمة المرور غير صحيحة.");
      case "AccessDenied":
        return fail("عذراً، ليس لديك الصلاحية للدخول.");
      default:
        return err("حدث خطأ أثناء المصادقة، يرجى المحاولة لاحقاً.");
    }
  }

  // 4. Handle generic server errors
  return err("حدث خطأ غير متوقع في الخادم، جاري العمل على إصلاحه.");
}

// /**
//  * @file action-response.ts
//  * @description Centralized JSend-style response formatters and global error handler for Server Actions.
//  */

// import { AuthError } from "next-auth";
// import { ZodError } from "zod";

// import type {
//   ActionResponse,
//   ErrorResponse,
//   FailResponse,
//   SuccessResponse,
// } from "@/types/action.types";

// /**
//  * Builds a JSend "success" response.
//  * @param data   - Optional payload to return to the client.
//  * @param message - Optional human-readable success message.
//  */
// export function ok<T = undefined>(
//   data?: T,
//   message?: string,
// ): SuccessResponse<T> {
//   return { status: "success", ...(data !== undefined && { data }), message };
// }

// /**
//  * Builds a JSend "fail" response (client-side / validation errors).
//  * @param message - Human-readable reason the request failed.
//  */
// export function fail(message: string): FailResponse {
//   return { status: "fail", message };
// }

// /**
//  * Builds a JSend "error" response (unexpected server errors).
//  * @param message - Human-readable error description.
//  */
// export function err(message: string): ErrorResponse {
//   return { status: "error", message };
// }

// /**
//  * Extracts the first Zod issue message from a safeParse result.
//  * @param error - The ZodError object from `safeParse(...).error`.
//  * @returns The first human-readable validation message.
//  */
// export function firstZodIssue(error: {
//   issues: { message: string }[];
// }): string {
//   return error.issues[0]?.message ?? "بيانات غير صالحة";
// }

// /**
//  * Type-guard: checks if an ActionResponse is a success.
//  */
// export function isSuccess<T>(
//   response: ActionResponse<T>,
// ): response is SuccessResponse<T> {
//   return response.status === "success";
// }
