/* eslint-disable @typescript-eslint/no-explicit-any */
// ── Error Types ──────────────────────────────────────────────
export type ErrorCode =
  | "VALIDATION_ERROR"    // خطأ في البيانات المدخلة
  | "UNAUTHORIZED"        // غير مسجل دخول
  | "FORBIDDEN"           // ليس لديك صلاحية
  | "NOT_FOUND"           // العنصر غير موجود
  | "CONFLICT"            // تعارض (مثل email مكرر)
  | "UPLOAD_ERROR"        // خطأ في رفع الصورة
  | "SERVER_ERROR"        // خطأ في الخادم
  | "NETWORK_ERROR";      // خطأ في الشبكة

export interface AppError {
  code:    ErrorCode;
  message: string;       // للمستخدم (عربي)
  detail?: string;       // للـ developer (console)
  field?:  string;       // لو الخطأ متعلق بـ field معين
}

// خريطة HTTP status → AppError
const STATUS_MAP: Record<number, { code: ErrorCode; message: string }> = {
  400: { code: "VALIDATION_ERROR", message: "البيانات المدخلة غير صحيحة" },
  401: { code: "UNAUTHORIZED",     message: "يرجى تسجيل الدخول أولاً" },
  403: { code: "FORBIDDEN",        message: "ليس لديك صلاحية لهذا الإجراء" },
  404: { code: "NOT_FOUND",        message: "العنصر المطلوب غير موجود" },
  409: { code: "CONFLICT",         message: "هذا العنصر موجود بالفعل" },
  500: { code: "SERVER_ERROR",     message: "خطأ في الخادم، حاول مرة أخرى" },
};

// تحويل Axios error → AppError
export function parseAxiosError(error: unknown): AppError {
  // Network error (no response)
  if (!isAxiosError(error)) {
    return {
      code:    "NETWORK_ERROR",
      message: "تعذّر الاتصال بالخادم، تحقق من اتصالك بالإنترنت",
      detail:  String(error),
    };
  }

  const status  = error.response?.status ?? 0;
  const data    = error.response?.data;

  // Server returned a specific error message
  const serverMessage = typeof data?.error === "string" ? data.error : null;
  const field         = data?.field ?? null;

  const mapped = STATUS_MAP[status] ?? {
    code:    "SERVER_ERROR" as ErrorCode,
    message: "حدث خطأ غير متوقع",
  };

  return {
    code:    mapped.code,
    message: serverMessage ?? mapped.message,
    detail:  `HTTP ${status}`,
    field:   field ?? undefined,
  };
}

// Type guard
function isAxiosError(e: unknown): e is {
  response?: { status: number; data?: any };
  message:   string;
} {
  return typeof e === "object" && e !== null && "response" in e;
}