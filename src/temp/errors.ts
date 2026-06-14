/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Central error utilities used across:
 * - API routes (Route Handlers)
 * - Server Actions
 * - Client hooks (Axios interceptor)
 *
 * Keep it simple — no class hierarchy, just functions and types.
 */

import { NextResponse } from "next/server";

// ── Error codes ────────────────────────────────────────────────
export type AppErrorCode =
  | "VALIDATION_ERROR"
  | "UNAUTHORIZED"
  | "FORBIDDEN"
  | "NOT_FOUND"
  | "CONFLICT"
  | "SERVER_ERROR"
  | "NETWORK_ERROR";

// ── HTTP status → code mapping ─────────────────────────────────
const STATUS_MAP: Record<number, { code: AppErrorCode; message: string }> = {
  400: { code: "VALIDATION_ERROR", message: "البيانات المدخلة غير صحيحة" },
  401: { code: "UNAUTHORIZED",     message: "يرجى تسجيل الدخول أولاً" },
  403: { code: "FORBIDDEN",        message: "ليس لديك صلاحية لهذا الإجراء" },
  404: { code: "NOT_FOUND",        message: "العنصر المطلوب غير موجود" },
  409: { code: "CONFLICT",         message: "هذا العنصر موجود بالفعل" },
};

// ── API route error response (server-side) ─────────────────────
export function apiError(
  message: string,
  status: 400 | 401 | 403 | 404 | 409 | 500
): NextResponse {
  return NextResponse.json({ error: message }, { status });
}

// ── Server Action error result ─────────────────────────────────
export type ActionResult<T = void> =
  | { success: true;  data: T }
  | { success: false; error: string };

export function actionError(message: string): ActionResult<never> {
  return { success: false, error: message };
}

export function actionSuccess<T>(data: T): ActionResult<T> {
  return { success: true, data };
}

// ── Parse Axios error on client ────────────────────────────────
export function parseAxiosError(error: unknown): string {
  if (typeof error === "object" && error !== null) {
    // Axios error with response
    const axiosError = error as any;
    if (axiosError.response?.data?.error) {
      return axiosError.response.data.error;
    }
    if (axiosError.message) {
      return axiosError.message;
    }
  }
  return "حدث خطأ غير متوقع";
}