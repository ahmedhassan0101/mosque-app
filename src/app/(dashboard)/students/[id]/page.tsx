// src\app\(dashboard)\students\[id]\page.tsx
import { connectDB } from "@/lib/db/connect";
import Student from "@/models/Student";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Separator } from "@/components/ui/separator";
import {
  Pencil,
  Phone,
  MapPin,
  BookOpen,
  Calendar,
  User,
  // QrCode,
} from "lucide-react";
import { StudentQRButton } from "@/components/students/StudentQRButton";
import { getMosqueId } from "@/lib/auth/get-context";

type PageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: PageProps) {
  const { id } = await params;
  await connectDB();
  const s = await Student.findById(id).select("name").lean();
  return { title: s?.name ?? "الطالب" };
}

const LEVEL_MAP: Record<
  string,
  { label: string; variant: "default" | "secondary" | "outline" }
> = {
  beginner: { label: "مبتدئ", variant: "outline" },
  intermediate: { label: "متوسط", variant: "secondary" },
  advanced: { label: "متقدم", variant: "default" },
};

const ACT_MAP: Record<string, string> = {
  quran: "القرآن",
  tarbiya: "التربية",
  tajweed: "التجويد",
  maqraa: "المقرأة",
  playground: "الملعب",
};

export default async function StudentProfilePage({ params }: PageProps) {
  const { id } = await params;

  const mosqueId = await getMosqueId();
  await connectDB();
  const student = await Student.findOne({ _id: id, mosqueId }).lean();

  // if (!student) notFound();
  if (!student) {
    console.log("❌ Student not found! Check if ID or MosqueID is correct.");
    console.log("-> Searching for ID:", id, "| MosqueID:", mosqueId);
    notFound();
  }
  const age = student.birthDate
    ? new Date().getFullYear() - new Date(student.birthDate).getFullYear()
    : null;

  const lvl = LEVEL_MAP[student.level] ?? LEVEL_MAP.beginner;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          {/* Avatar */}
          <div className="w-16 h-16 rounded-full overflow-hidden bg-muted border-2 border-border flex items-center justify-center shrink-0">
            {student.photo ? (
              <Image
                src={student.photo}
                alt={student.name}
                width={64}
                height={64}
                className="object-cover w-full h-full"
              />
            ) : (
              <User size={28} className="text-muted-foreground" />
            )}
          </div>
          <div>
            <h1 className="text-2xl font-bold">{student.name}</h1>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant={lvl.variant}>{lvl.label}</Badge>
              {age && (
                <span className="text-sm text-muted-foreground">{age} سنة</span>
              )}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <StudentQRButton studentId={id} studentName={student.name} />
          <Button asChild>
            <Link href={`/students/${id}/edit`}>
              <Pencil size={14} className="ml-2" />
              تعديل
            </Link>
          </Button>
        </div>
      </div>

      {/* الأنشطة */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm text-muted-foreground">
            الأنشطة
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 flex-wrap">
            {student.enrollments.map((act) => (
              <Badge key={act} variant="outline" className="gap-1">
                <BookOpen size={11} />
                {ACT_MAP[act] ?? act}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* بيانات التواصل */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm text-muted-foreground">
            بيانات التواصل
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {student.guardianName && (
            <InfoRow
              icon={User}
              label="ولي الأمر"
              value={student.guardianName}
            />
          )}
          <InfoRow
            icon={Phone}
            label="تليفون الولي"
            value={student.guardianPhone}
            dir="ltr"
          />
          {student.guardianPhone2 && (
            <InfoRow
              icon={Phone}
              label="تليفون احتياطي"
              value={student.guardianPhone2}
              dir="ltr"
            />
          )}
          {student.phone && (
            <InfoRow
              icon={Phone}
              label="تليفون الطالب"
              value={student.phone}
              dir="ltr"
            />
          )}
          {student.address && (
            <InfoRow icon={MapPin} label="العنوان" value={student.address} />
          )}
          {student.birthDate && (
            <InfoRow
              icon={Calendar}
              label="تاريخ الميلاد"
              value={new Date(student.birthDate).toLocaleDateString("ar-EG")}
            />
          )}
        </CardContent>
      </Card>

      {/* القرآن */}
      {(student.currentSurah || student.trackIbadah) && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">
              متابعة القرآن
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {student.currentSurah && (
              <InfoRow
                icon={BookOpen}
                label="الموقف الحالي"
                value={`سورة ${student.currentSurah}${student.currentAyah ? ` — الآية ${student.currentAyah}` : ""}`}
              />
            )}
            <div className="flex items-center gap-2">
              <div
                className={`w-2 h-2 rounded-full ${student.trackIbadah ? "bg-primary" : "bg-muted-foreground"}`}
              />
              <span className="text-sm">
                {student.trackIbadah
                  ? "يُتابع في العبادات"
                  : "لا تتم متابعته في العبادات"}
              </span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* ملاحظات */}
      {student.notes && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">
              ملاحظات
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm leading-relaxed">{student.notes}</p>
          </CardContent>
        </Card>
      )}

      {/* تاريخ التسجيل */}
      <p className="text-xs text-muted-foreground text-center">
        تسجيل في {new Date(student.createdAt).toLocaleDateString("ar-EG")}
      </p>
    </div>
  );
}

// Helper component
function InfoRow({
  icon: Icon,
  label,
  value,
  dir,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  dir?: "ltr" | "rtl";
}) {
  return (
    <div className="flex items-center gap-3">
      <Icon size={15} className="text-muted-foreground shrink-0" />
      <span className="text-sm text-muted-foreground w-28 shrink-0">
        {label}
      </span>
      <span className="text-sm font-medium" dir={dir}>
        {value}
      </span>
    </div>
  );
}
