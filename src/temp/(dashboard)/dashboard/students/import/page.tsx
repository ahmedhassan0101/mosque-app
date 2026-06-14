// src/app/(dashboard)/dashboard/students/import/page.tsx
import type { Metadata } from "next";
import { BulkImport } from "@/components/students/import/BulkImport";

export const metadata: Metadata = { title: "استيراد الطلاب" };

export default function ImportStudentsPage() {
  return (
    <main className="max-w-2xl mx-auto py-6 px-4 space-y-6" dir="rtl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">استيراد الطلاب</h1>
        <p className="text-sm text-muted-foreground mt-1">
          استيراد بيانات طلاب متعددين دفعة واحدة من ملف Excel
        </p>
      </div>
      <BulkImport />
    </main>
  );
}
