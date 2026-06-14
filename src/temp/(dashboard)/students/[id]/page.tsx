/* eslint-disable @typescript-eslint/no-explicit-any */

// src/app/(dashboard)/students/[id]/page.tsx
import { getStudentById } from "@/temp/services/student.service";
import { notFound } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Phone } from "lucide-react";

export default async function StudentProfilePage({ params }: any) {
  const { id } = await params;
  const student = await getStudentById(id);
  if (!student) notFound();

  return (
    <div className="max-w-4xl mx-auto space-y-8 p-4">
      {/* Profile Header Card */}
      <div className="relative bg-linear-to-l from-emerald-600 to-accent rounded-3xl p-8 text-white shadow-2xl overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-6">
          <Avatar className="w-32 h-32 border-4 border-white/30 shadow-xl">
            <AvatarImage src={student.photo} className="object-cover" />
            <AvatarFallback className="text-4xl bg-emerald-700">
              {student.name[0]}
            </AvatarFallback>
          </Avatar>

          <div className="text-center md:text-right space-y-2">
            <h1 className="text-3xl font-bold">{student.name}</h1>
            <div className="flex flex-wrap justify-center md:justify-start gap-2">
              <Badge className="bg-white/20 hover:bg-white/30 text-white border-0 backdrop-blur-md">
                {student.level}
              </Badge>
              {student.enrollments.map((e: string) => (
                <Badge
                  key={e}
                  variant="secondary"
                  className="bg-amber-400 text-amber-950 border-0"
                >
                  {e}
                </Badge>
              ))}
            </div>
          </div>
        </div>
        {/* Decorative groups */}
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
      </div>

      {/* Grid for Details */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="p-6 rounded-2xl border-none shadow-sm bg-gray-50/50">
          <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
            <Phone className="w-5 h-5 text-primary" /> معلومات التواصل
          </h3>
          <div className="space-y-4">
            <DetailRow label="ولي الأمر" value={student.guardianName} />
            <DetailRow label="رقم الهاتف" value={student.guardianPhone} isLtr />
            <DetailRow label="العنوان" value={student.address} />
            <DetailRow label="العنوان" value={student.address} />
            <DetailRow label="العنوان" value={student.address} />
          </div>
        </Card>

        <Card className="p-6 rounded-2xl border-none shadow-sm bg-gray-50/50">
          <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-primary" /> الموقف التعليمي
          </h3>
          <div className="space-y-4">
            <DetailRow
              label="السورة الحالية"
              value={student.currentSurah || "غير محدد"}
            />
            <DetailRow
              label="رقم الآية"
              value={student.currentAyah?.toString() || "1"}
            />
            <div className="pt-2">
              <Badge variant={student.trackIbadah ? "default" : "secondary"}>
                {student.trackIbadah ? "متابع للعبادات" : "بدون متابعة عبادات"}
              </Badge>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

function DetailRow({
  label,
  value,
  isLtr,
}: {
  label: string;
  value?: string;
  isLtr?: boolean;
}) {
  return (
    <div className="flex justify-between items-center border-b border-gray-100 pb-2">
      <span className="text-muted-foreground text-sm">{label}</span>
      <span
        className={`font-semibold ${isLtr ? "font-mono" : ""}`}
        dir={isLtr ? "ltr" : "rtl"}
      >
        {value || "—"}
      </span>
    </div>
  );
}
