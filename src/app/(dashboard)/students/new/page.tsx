import { StudentForm } from "@/components/students/student-form";
export const metadata = { title: "إضافة طالب" };

export default function NewStudentPage() {
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold">إضافة طالب جديد</h1>
        <p className="text-muted-foreground text-sm">
          أدخل بيانات الطالب ونشاطاته
        </p>
      </div>
      <StudentForm />
    </div>
  );
}
