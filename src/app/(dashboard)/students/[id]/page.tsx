/* eslint-disable @typescript-eslint/no-explicit-any */
// // src\app\(dashboard)\students\[id]\page.tsx
// import { connectDB } from "@/lib/db/connect";
// import Student from "@/models/Student";
// import { notFound } from "next/navigation";
// import Link from "next/link";
// import Image from "next/image";
// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// // import { Separator } from "@/components/ui/separator";
// import {
//   Pencil,
//   Phone,
//   MapPin,
//   BookOpen,
//   Calendar,
//   User,
//   // QrCode,
// } from "lucide-react";
// import { StudentQRButton } from "@/components/students/StudentQRButton";
// import { getMosqueId } from "@/lib/auth/get-context";

// type PageProps = {
//   params: Promise<{ id: string }>;
// };

// export async function generateMetadata({ params }: PageProps) {
//   const { id } = await params;
//   await connectDB();
//   const s = await Student.findById(id).select("name").lean();
//   return { title: s?.name ?? "الطالب" };
// }

// const LEVEL_MAP: Record<
//   string,
//   { label: string; variant: "default" | "secondary" | "outline" }
// > = {
//   beginner: { label: "مبتدئ", variant: "outline" },
//   intermediate: { label: "متوسط", variant: "secondary" },
//   advanced: { label: "متقدم", variant: "default" },
// };

// const ACT_MAP: Record<string, string> = {
//   quran: "القرآن",
//   tarbiya: "التربية",
//   tajweed: "التجويد",
//   maqraa: "المقرأة",
//   playground: "الملعب",
// };

// export default async function StudentProfilePage({ params }: PageProps) {
//   const { id } = await params;

//   const mosqueId = await getMosqueId();
//   await connectDB();
//   const student = await Student.findOne({ _id: id, mosqueId }).lean();

//   // if (!student) notFound();
//   if (!student) {
//     console.log("❌ Student not found! Check if ID or MosqueID is correct.");
//     console.log("-> Searching for ID:", id, "| MosqueID:", mosqueId);
//     notFound();
//   }
//   const age = student.birthDate
//     ? new Date().getFullYear() - new Date(student.birthDate).getFullYear()
//     : null;

//   const lvl = LEVEL_MAP[student.level] ?? LEVEL_MAP.beginner;

//   return (
//     <div className="max-w-2xl mx-auto space-y-6">
//       {/* Header */}
//       <div className="flex items-start justify-between">
//         <div className="flex items-center gap-4">
//           {/* Avatar */}
//           <div className="w-16 h-16 rounded-full overflow-hidden bg-muted border-2 border-border flex items-center justify-center shrink-0">
//             {student.photo ? (
//               <Image
//                 src={student.photo}
//                 alt={student.name}
//                 width={64}
//                 height={64}
//                 className="object-cover w-full h-full"
//               />
//             ) : (
//               <User size={28} className="text-muted-foreground" />
//             )}
//           </div>
//           <div>
//             <h1 className="text-2xl font-bold">{student.name}</h1>
//             <div className="flex items-center gap-2 mt-1">
//               <Badge variant={lvl.variant}>{lvl.label}</Badge>
//               {age && (
//                 <span className="text-sm text-muted-foreground">{age} سنة</span>
//               )}
//             </div>
//           </div>
//         </div>

//         {/* Actions */}
//         <div className="flex gap-2">
//           <StudentQRButton studentId={id} studentName={student.name} />
//           <Button asChild>
//             <Link href={`/students/${id}/edit`}>
//               <Pencil size={14} className="ml-2" />
//               تعديل
//             </Link>
//           </Button>
//         </div>
//       </div>

//       {/* الأنشطة */}
//       <Card>
//         <CardHeader className="pb-2">
//           <CardTitle className="text-sm text-muted-foreground">
//             الأنشطة
//           </CardTitle>
//         </CardHeader>
//         <CardContent>
//           <div className="flex gap-2 flex-wrap">
//             {student.enrollments.map((act) => (
//               <Badge key={act} variant="outline" className="gap-1">
//                 <BookOpen size={11} />
//                 {ACT_MAP[act] ?? act}
//               </Badge>
//             ))}
//           </div>
//         </CardContent>
//       </Card>

//       {/* بيانات التواصل */}
//       <Card>
//         <CardHeader className="pb-2">
//           <CardTitle className="text-sm text-muted-foreground">
//             بيانات التواصل
//           </CardTitle>
//         </CardHeader>
//         <CardContent className="space-y-3">
//           {student.guardianName && (
//             <InfoRow
//               icon={User}
//               label="ولي الأمر"
//               value={student.guardianName}
//             />
//           )}
//           <InfoRow
//             icon={Phone}
//             label="تليفون الولي"
//             value={student.guardianPhone}
//             dir="ltr"
//           />
//           {student.guardianPhone2 && (
//             <InfoRow
//               icon={Phone}
//               label="تليفون احتياطي"
//               value={student.guardianPhone2}
//               dir="ltr"
//             />
//           )}
//           {student.phone && (
//             <InfoRow
//               icon={Phone}
//               label="تليفون الطالب"
//               value={student.phone}
//               dir="ltr"
//             />
//           )}
//           {student.address && (
//             <InfoRow icon={MapPin} label="العنوان" value={student.address} />
//           )}
//           {student.birthDate && (
//             <InfoRow
//               icon={Calendar}
//               label="تاريخ الميلاد"
//               value={new Date(student.birthDate).toLocaleDateString("ar-EG")}
//             />
//           )}
//         </CardContent>
//       </Card>

//       {/* القرآن */}
//       {(student.currentSurah || student.trackIbadah) && (
//         <Card>
//           <CardHeader className="pb-2">
//             <CardTitle className="text-sm text-muted-foreground">
//               متابعة القرآن
//             </CardTitle>
//           </CardHeader>
//           <CardContent className="space-y-3">
//             {student.currentSurah && (
//               <InfoRow
//                 icon={BookOpen}
//                 label="الموقف الحالي"
//                 value={`سورة ${student.currentSurah}${student.currentAyah ? ` — الآية ${student.currentAyah}` : ""}`}
//               />
//             )}
//             <div className="flex items-center gap-2">
//               <div
//                 className={`w-2 h-2 rounded-full ${student.trackIbadah ? "bg-primary" : "bg-muted-foreground"}`}
//               />
//               <span className="text-sm">
//                 {student.trackIbadah
//                   ? "يُتابع في العبادات"
//                   : "لا تتم متابعته في العبادات"}
//               </span>
//             </div>
//           </CardContent>
//         </Card>
//       )}

//       {/* ملاحظات */}
//       {student.notes && (
//         <Card>
//           <CardHeader className="pb-2">
//             <CardTitle className="text-sm text-muted-foreground">
//               ملاحظات
//             </CardTitle>
//           </CardHeader>
//           <CardContent>
//             <p className="text-sm leading-relaxed">{student.notes}</p>
//           </CardContent>
//         </Card>
//       )}

//       {/* تاريخ التسجيل */}
//       <p className="text-xs text-muted-foreground text-center">
//         تسجيل في {new Date(student.createdAt).toLocaleDateString("ar-EG")}
//       </p>
//     </div>
//   );
// }

// // Helper component
// function InfoRow({
//   icon: Icon,
//   label,
//   value,
//   dir,
// }: {
//   icon: React.ElementType;
//   label: string;
//   value: string;
//   dir?: "ltr" | "rtl";
// }) {
//   return (
//     <div className="flex items-center gap-3">
//       <Icon size={15} className="text-muted-foreground shrink-0" />
//       <span className="text-sm text-muted-foreground w-28 shrink-0">
//         {label}
//       </span>
//       <span className="text-sm font-medium" dir={dir}>
//         {value}
//       </span>
//     </div>
//   );
// }
// src/app/(dashboard)/students/[id]/page.tsx
import { getStudentById } from "@/lib/services/student.service";
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
      <div className="relative bg-linear-to-l from-emerald-600 to-teal-500 rounded-3xl p-8 text-white shadow-2xl overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-6">
          <Avatar className="w-32 h-32 border-4 border-white/30 shadow-xl">
             <AvatarImage src={student.photo} className="object-cover" />
             <AvatarFallback className="text-4xl bg-emerald-700">{student.name[0]}</AvatarFallback>
          </Avatar>
          
          <div className="text-center md:text-right space-y-2">
            <h1 className="text-3xl font-bold">{student.name}</h1>
            <div className="flex flex-wrap justify-center md:justify-start gap-2">
              <Badge className="bg-white/20 hover:bg-white/30 text-white border-0 backdrop-blur-md">
                {student.level}
              </Badge>
              {student.enrollments.map((e: string) => (
                <Badge key={e} variant="secondary" className="bg-amber-400 text-amber-950 border-0">
                  {e}
                </Badge>
              ))}
            </div>
          </div>
        </div>
        {/* Decorative Circles */}
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
      </div>

      {/* Grid for Details */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="p-6 rounded-2xl border-none shadow-sm bg-gray-50/50">
          <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
            <Phone className="w-5 h-5 text-emerald-600" /> معلومات التواصل
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
            <BookOpen className="w-5 h-5 text-emerald-600" /> الموقف التعليمي
          </h3>
          <div className="space-y-4">
             <DetailRow label="السورة الحالية" value={student.currentSurah || "غير محدد"} />
             <DetailRow label="رقم الآية" value={student.currentAyah?.toString() || "1"} />
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

function DetailRow({ label, value, isLtr }: { label: string; value?: string; isLtr?: boolean }) {
  return (
    <div className="flex justify-between items-center border-b border-gray-100 pb-2">
      <span className="text-muted-foreground text-sm">{label}</span>
      <span className={`font-semibold ${isLtr ? "font-mono" : ""}`} dir={isLtr ? "ltr" : "rtl"}>
        {value || "—"}
      </span>
    </div>
  );
}