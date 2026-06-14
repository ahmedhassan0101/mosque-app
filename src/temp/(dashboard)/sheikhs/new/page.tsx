import { SheikhForm } from "@/temp/sheikhs/SheikhForm";

export const metadata = { title: "إضافة شيخ جديد" };

export default function NewSheikhPage() {
  return (
    <div className="max-w-lg mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold">إضافة شيخ جديد</h1>
        <p className="text-muted-foreground text-sm">أدخل بيانات الشيخ</p>
      </div>
      <SheikhForm />
    </div>
  );
}
