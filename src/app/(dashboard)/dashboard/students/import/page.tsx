// src/app/(dashboard)/students/import/page.tsx
import { BulkImport } from "@/components/students/BulkImport";

export const metadata = { title: "استيراد الطلاب" };

export default function ImportStudentsPage() {
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold">استيراد الطلاب</h1>
        <p className="text-muted-foreground text-sm">
          استيراد بيانات طلاب متعددين دفعة واحدة من ملف Excel أو CSV
        </p>
      </div>
      <BulkImport />
    </div>
  );
}
