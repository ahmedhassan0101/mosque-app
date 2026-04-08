"use client"; // ملفات الإيرور لازم تكون كلاينت

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Dashboard Error:", error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-100 bg-red-50/50 rounded-2xl border border-red-100 p-8 text-center">
      <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
      <h2 className="text-xl font-bold text-red-900 mb-2">
        عذراً، حدث خطأ غير متوقع!
      </h2>
      <p className="text-sm text-red-700/80 mb-6 max-w-md">
        يبدو أن هناك مشكلة في الاتصال بقاعدة البيانات أو جلب البيانات. يرجى
        المحاولة مرة أخرى.
      </p>
      <Button onClick={() => reset()} variant="destructive">
        إعادة المحاولة
      </Button>
    </div>
  );
}
