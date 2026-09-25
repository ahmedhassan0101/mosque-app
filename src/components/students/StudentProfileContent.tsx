// // src/components/students/StudentProfileContent.tsx
// import Image from "next/image";
// import Link from "next/link";
// import { notFound } from "next/navigation";
// import {
//   Pencil,
//   Phone,
//   MapPin,
//   FileText,
//   BookMarked,
//   Hash,
//   BookOpen,
//   Users,
//   Calendar,
// } from "lucide-react";

// import { getStudentProfile } from "@/queries/student.queries";
// import { calculateAge } from "@/lib/utils/age";
// import { ACTIVITIES, GENDERS, LEVELS, type ActivityType } from "@/constants";

// import { Card, CardHeader, CardContent } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
// import { SectionTitle } from "@/components/shared/SectionTitle";
// import { DeleteStudentButton } from "./DeleteStudentButton";

// interface StudentProfileContentProps {
//   id: string;
// }

// interface StudentGroupSummary {
//   _id: string;
//   name: string;
//   activity: ActivityType;
//   teacherName: string;
//   appointment?: string;
// }

// export async function StudentProfileContent({
//   id,
// }: StudentProfileContentProps) {
//   const data = await getStudentProfile(id);
//   if (!data) notFound();

//   const { student, groups } = data;
//   const age = calculateAge(student.birthDate);
//   const initials = student.name[0];
//   const [primaryGuardian, ...otherGuardians] = student.guardians ?? [];

//   return (
//     <div className="detail-grid" dir="rtl">
//       {/* ── العمود الثابت — هوية الطالب وطرق التواصل ── */}
//       <div className="flex flex-col gap-4">
//         <Card>
//           <CardContent className="flex flex-col items-center gap-3 pt-6 text-center">
//             <div className="relative flex size-20 shrink-0 items-center justify-center overflow-hidden rounded-full bg-primary/10">
//               {student.image ? (
//                 <Image
//                   src={student.image}
//                   alt={student.name}
//                   fill
//                   sizes="80px"
//                   className="object-cover"
//                 />
//               ) : (
//                 <span className="text-2xl font-bold text-primary">
//                   {initials}
//                 </span>
//               )}
//             </div>

//             <div>
//               <h2 className="text-section-title">{student.name}</h2>
//               <p className="text-sm text-muted-foreground">
//                 {GENDERS.labels[student.gender]}
//                 {age !== null ? ` · ${age} سنة` : ""}
//               </p>
//             </div>

//             <div className="flex items-center gap-2">
//               <Badge variant={student.isActive ? "success" : "neutral"}>
//                 {student.isActive ? "نشط" : "غير نشط"}
//               </Badge>
//               <Badge variant="outline">{LEVELS.labels[student.level]}</Badge>
//             </div>

//             <div className="flex items-center gap-2 pt-1">
//               <Button variant="outline" size="sm" asChild>
//                 <Link href={`/dashboard/students/${id}/edit`}>
//                   <Pencil size={13} className="me-1.5" />
//                   تعديل
//                 </Link>
//               </Button>
//               <DeleteStudentButton
//                 id={id}
//                 name={student.name}
//                 redirectAfterDelete
//                 variant="icon"
//               />
//             </div>

//             {student.notes && (
//               <div className="mt-1 flex w-full items-start gap-2 rounded-lg bg-muted/40 p-3 text-start">
//                 <FileText
//                   size={13}
//                   className="mt-0.5 shrink-0 text-muted-foreground"
//                 />
//                 <p className="text-sm leading-relaxed text-muted-foreground">
//                   {student.notes}
//                 </p>
//               </div>
//             )}
//           </CardContent>
//         </Card>

//         <Card>
//           <CardHeader divider>
//             <SectionTitle icon={Phone}>بيانات التواصل</SectionTitle>
//           </CardHeader>
//           <CardContent className="flex flex-col gap-3">
//             {student.phone && (
//               <div className="flex items-center gap-2 text-sm">
//                 <Phone size={13} className="shrink-0 text-muted-foreground" />
//                 <span dir="ltr">{student.phone}</span>
//               </div>
//             )}

//             {student.address && (
//               <div className="flex items-start gap-2 text-sm">
//                 <MapPin
//                   size={13}
//                   className="mt-0.5 shrink-0 text-muted-foreground"
//                 />
//                 <span>{student.address}</span>
//               </div>
//             )}

//             {primaryGuardian ? (
//               <div className="flex flex-col gap-1 border-t border-border pt-3">
//                 <p className="text-xs text-muted-foreground">
//                   ولي الأمر ({primaryGuardian.relation})
//                 </p>
//                 <p className="flex items-center gap-1.5 text-sm font-medium">
//                   <Phone size={12} className="text-muted-foreground" />
//                   <span dir="ltr">{primaryGuardian.phone}</span>
//                 </p>
//               </div>
//             ) : (
//               !student.phone &&
//               !student.address && (
//                 <p className="text-sm text-muted-foreground">
//                   لا توجد بيانات تواصل مسجّلة
//                 </p>
//               )
//             )}

//             {otherGuardians.length > 0 && (
//               <div className="flex flex-col gap-2 border-t border-border pt-3">
//                 {otherGuardians.map((g) => (
//                   <div key={g.phone} className="flex flex-col gap-0.5">
//                     <p className="text-xs text-muted-foreground">
//                       {g.relation}
//                     </p>
//                     <p className="text-sm" dir="ltr">
//                       {g.phone}
//                     </p>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </CardContent>
//         </Card>
//       </div>

//       {/* ── العمود المرن — النشاط والتقدّم ── */}
//       <div className="flex flex-col gap-4">
//         <Card>
//           <CardHeader divider>
//             <SectionTitle icon={BookMarked}>متابعة الحفظ</SectionTitle>
//           </CardHeader>
//           <CardContent>
//             {student.currentSurah ? (
//               <div className="flex flex-col gap-3">
//                 <div className="flex items-center gap-2">
//                   <BookMarked size={16} className="shrink-0 text-primary" />
//                   <div>
//                     <p className="text-xs text-muted-foreground">
//                       السورة الحالية
//                     </p>
//                     <p className="font-semibold">{student.currentSurah}</p>
//                   </div>
//                 </div>
//                 {student.currentAyah && (
//                   <div className="flex items-center gap-2">
//                     <Hash
//                       size={14}
//                       className="shrink-0 text-muted-foreground"
//                     />
//                     <div>
//                       <p className="text-xs text-muted-foreground">رقم الآية</p>
//                       <p className="font-medium">{student.currentAyah}</p>
//                     </div>
//                   </div>
//                 )}
//               </div>
//             ) : (
//               <div className="flex flex-col items-center justify-center gap-2 py-6 text-center">
//                 <BookOpen size={24} className="text-muted-foreground" />
//                 <p className="text-sm text-muted-foreground">
//                   لم يُسجَّل تقدم في الحفظ بعد
//                 </p>
//               </div>
//             )}
//           </CardContent>
//         </Card>

//         <Card>
//           <CardHeader divider className="flex-row items-center justify-between">
//             <SectionTitle icon={Users}>المجموعات المسجّل بها</SectionTitle>
//             {groups.length > 0 && (
//               <Badge variant="secondary">{groups.length}</Badge>
//             )}
//           </CardHeader>
//           <CardContent>
//             {groups.length === 0 ? (
//               <div className="flex flex-col items-center justify-center gap-2 py-8 text-center">
//                 <Users size={24} className="text-muted-foreground" />
//                 <p className="text-sm text-muted-foreground">
//                   الطالب غير مسجّل في أي مجموعة حالياً
//                 </p>
//               </div>
//             ) : (
//               <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
//                 {groups.map((group) => (
//                   <GroupCard key={group._id} group={group} />
//                 ))}
//               </div>
//             )}
//           </CardContent>
//         </Card>
//       </div>
//     </div>
//   );
// }

// function GroupCard({ group }: { group: StudentGroupSummary }) {
//   return (
//     <Link
//       href={`/dashboard/groups/${group.activity}/${group._id}`}
//       className="flex items-start justify-between gap-2 rounded-lg border border-border bg-muted/20 p-3 transition-all hover:border-primary/40 hover:bg-muted/40"
//     >
//       <div className="flex flex-col gap-1">
//         <p className="text-sm font-medium">{group.name}</p>
//         <p className="text-xs text-muted-foreground">
//           المعلم: {group.teacherName}
//         </p>
//         {group.appointment && (
//           <p className="flex items-center gap-1 text-xs text-muted-foreground">
//             <Calendar size={11} />
//             {group.appointment}
//           </p>
//         )}
//       </div>
//       <Badge variant="secondary" className="shrink-0 text-xs">
//         {ACTIVITIES.labels[group.activity]}
//       </Badge>
//     </Link>
//   );
// }
// src/components/students/StudentProfileContent.tsx
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Pencil,
  Phone,
  MapPin,
  FileText,
  BookMarked,
  Hash,
  BookOpen,
  Users,
  Calendar,
} from "lucide-react";

import { getStudentProfile } from "@/queries/student.queries";
import { calculateAge } from "@/lib/utils/age";
import { ACTIVITIES, GENDERS, LEVELS, type ActivityType } from "@/constants";

import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SectionTitle } from "@/components/shared/SectionTitle";
import { DeleteStudentButton } from "./DeleteStudentButton";
import MonthlyReports from "./MonthlyReports";

interface StudentProfileContentProps {
  id: string;
}

interface StudentGroupSummary {
  _id: string;
  name: string;
  activity: ActivityType;
  teacherName: string;
  appointment?: string;
}

export async function StudentProfileContent({
  id,
}: StudentProfileContentProps) {
  const data = await getStudentProfile(id);
  if (!data) notFound();

  const { student, groups } = data;
  const age = calculateAge(student.birthDate);
  const initials = student.name[0];
  const [primaryGuardian, ...otherGuardians] = student.guardians ?? [];

  return (
    <div className="detail-grid" dir="rtl">
      {/* ── العمود الثابت — هوية الطالب وطرق التواصل ── */}
      <div className="flex flex-col gap-4">
        <Card className="overflow-hidden border-none shadow-sm ring-1 ring-border/50">
          {/* لمسة فنية: خلفية متدرجة علوية للبطاقة */}
          <div className="h-20 w-full bg-gradient-to-r from-primary/10 via-primary/5 to-transparent relative">
            <div className="absolute inset-0 bg-[url('/noise.png')] opacity-10 mix-blend-overlay"></div>
          </div>

          <CardContent className="flex flex-col items-center gap-4 px-6 pb-6 pt-0 text-center">
            {/* لمسة فنية: توهج خلف الصورة وإطار */}
            <div className="relative -mt-10 mb-2">
              <div className="absolute left-1/2 top-1/2 h-20 w-20 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/20 blur-xl"></div>
              <div className="relative flex size-24 shrink-0 items-center justify-center overflow-hidden rounded-full border-4 border-background bg-primary/10 shadow-lg transition-transform hover:scale-105 duration-300">
                {student.image ? (
                  <Image
                    src={student.image}
                    alt={student.name}
                    fill
                    sizes="96px"
                    className="object-cover"
                  />
                ) : (
                  <span className="text-3xl font-bold text-primary">
                    {initials}
                  </span>
                )}
              </div>
            </div>

            <div className="space-y-1">
              {/* لمسة فنية: تدرج لوني خفيف على الاسم */}
              <h2 className="text-2xl font-bold tracking-tight bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent">
                {student.name}
              </h2>
              <p className="text-sm font-medium text-muted-foreground flex items-center justify-center gap-1.5">
                {GENDERS.labels[student.gender]}
                {age !== null && (
                  <>
                    <span className="size-1 rounded-full bg-muted-foreground/30"></span>
                    <span>{age} سنة</span>
                  </>
                )}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Badge
                variant={student.isActive ? "success" : "neutral"}
                className={
                  student.isActive
                    ? "bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 shadow-none border-none"
                    : ""
                }
              >
                {student.isActive ? "نشط" : "غير نشط"}
              </Badge>
              <Badge variant="outline" className="bg-background">
                {LEVELS.labels[student.level]}
              </Badge>
            </div>

            <div className="flex w-full items-center justify-center gap-2 pt-2">
              <Button
                variant="outline"
                size="sm"
                className="w-full transition-colors hover:bg-primary hover:text-primary-foreground"
                asChild
              >
                <Link href={`/dashboard/students/${id}/edit`}>
                  <Pencil size={14} className="me-2" />
                  تعديل البيانات
                </Link>
              </Button>
              <DeleteStudentButton
                id={id}
                name={student.name}
                redirectAfterDelete
                variant="icon"
              />
            </div>

            {student.notes && (
              <div className="mt-2 flex w-full items-start gap-2.5 rounded-xl border border-amber-500/20 bg-amber-500/5 p-3.5 text-start transition-colors hover:bg-amber-500/10">
                <FileText
                  size={16}
                  className="mt-0.5 shrink-0 text-amber-600/80"
                />
                <p className="text-sm leading-relaxed text-amber-900/80 dark:text-amber-200/80">
                  {student.notes}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader divider className="bg-muted/30">
            <SectionTitle icon={Phone}>بيانات التواصل</SectionTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4 pt-5">
            {/* بقية كود بيانات التواصل كما هو بدون تغيير تقريباً مع تنسيقات أهدى */}
            {student.phone && (
              <div className="group flex items-center gap-3 text-sm">
                <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  <Phone size={14} />
                </div>
                <span dir="ltr" className="font-medium">
                  {student.phone}
                </span>
              </div>
            )}

            {student.address && (
              <div className="group flex items-start gap-3 text-sm">
                <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  <MapPin size={14} />
                </div>
                <span className="mt-1.5 leading-relaxed">
                  {student.address}
                </span>
              </div>
            )}

            {primaryGuardian ? (
              <div className="flex flex-col gap-2 border-t border-dashed border-border pt-4">
                <p className="text-xs font-medium text-primary">
                  ولي الأمر ({primaryGuardian.relation})
                </p>
                <div className="flex items-center gap-2 text-sm font-medium">
                  <Phone size={14} className="text-muted-foreground" />
                  <span dir="ltr">{primaryGuardian.phone}</span>
                </div>
              </div>
            ) : (
              !student.phone &&
              !student.address && (
                <div className="flex flex-col items-center justify-center py-4 text-center">
                  <p className="text-sm text-muted-foreground">
                    لا توجد بيانات تواصل
                  </p>
                </div>
              )
            )}

            {otherGuardians.length > 0 && (
              <div className="flex flex-col gap-3 border-t border-dashed border-border pt-4">
                {otherGuardians.map((g) => (
                  <div
                    key={g.phone}
                    className="flex items-center justify-between"
                  >
                    <p className="text-xs font-medium text-muted-foreground">
                      {g.relation}
                    </p>
                    <p className="text-sm font-medium" dir="ltr">
                      {g.phone}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* ── العمود المرن — النشاط والتقدّم ── */}
      <div className="flex flex-col gap-4">
        <Card className="overflow-hidden shadow-sm">
          <CardHeader divider className="bg-primary/5">
            <SectionTitle icon={BookMarked}>
              متابعة الحفظ
            </SectionTitle>
          </CardHeader>
          <CardContent className="relative pt-6">
            {/* لمسة فنية: Watermark أيقونة شفافة في الخلفية */}
            <div className="absolute -start-4 -top-4 opacity-[0.03] pointer-events-none">
              <BookOpen size={140} />
            </div>

            {student.currentSurah ? (
              <div className="relative z-10 flex flex-col gap-4 md:flex-row md:items-center md:gap-8">
                <div className="flex flex-1 items-center gap-4 rounded-xl bg-background p-4 shadow-sm ring-1 ring-border">
                  <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <BookMarked size={20} />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-muted-foreground mb-1">
                      السورة الحالية
                    </p>
                    <p className="text-lg font-bold text-foreground">
                      {student.currentSurah}
                    </p>
                  </div>
                </div>

                {student.currentAyah && (
                  <div className="flex flex-1 items-center gap-4 rounded-xl bg-background p-4 shadow-sm ring-1 ring-border">
                    <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <Hash size={20} />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-muted-foreground mb-1">
                        رقم الآية
                      </p>
                      <p className="text-lg font-bold text-foreground">
                        {student.currentAyah}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center gap-3 py-10 text-center">
                <div className="rounded-full bg-muted/50 p-4">
                  <BookOpen size={28} className="text-muted-foreground/50" />
                </div>
                <p className="text-sm font-medium text-muted-foreground">
                  لم يُسجَّل تقدم في الحفظ بعد
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader
            divider
            className="flex-row items-center justify-between bg-muted/30"
          >
            <SectionTitle icon={Users}>المجموعات المسجّل بها</SectionTitle>
            {groups.length > 0 && (
              <Badge variant="secondary" className="font-mono shadow-sm">
                {groups.length}
              </Badge>
            )}
          </CardHeader>
          <CardContent className="pt-6">
            {groups.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-3 py-10 text-center">
                <div className="rounded-full bg-muted/50 p-4">
                  <Users size={28} className="text-muted-foreground/50" />
                </div>
                <p className="text-sm font-medium text-muted-foreground">
                  الطالب غير مسجّل في أي مجموعة حالياً
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {groups.map((group) => (
                  <GroupCard key={group._id} group={group} />
                ))}
              </div>
            )}
          </CardContent>
        </Card>
        <MonthlyReports/>
      </div>
    </div>
  );
}

function GroupCard({ group }: { group: StudentGroupSummary }) {
  return (
    <Link
      href={`/dashboard/groups/${group.activity}/${group._id}`}
      // لمسة فنية: Interactive Hover Card مع خط جانبي
      className="group relative flex items-start justify-between gap-3 overflow-hidden rounded-xl border border-border bg-background p-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md"
    >
      <div className="absolute inset-y-0 start-0 w-1 bg-primary/20 transition-colors group-hover:bg-primary" />

      <div className="flex flex-col gap-1.5 ps-2">
        <p className="font-semibold text-foreground transition-colors group-hover:text-primary">
          {group.name}
        </p>
        <p className="text-xs font-medium text-muted-foreground">
          المعلم:{" "}
          <span className="text-foreground/80">{group.teacherName}</span>
        </p>
        {group.appointment && (
          <div className="mt-1 flex items-center gap-1.5 text-xs font-medium text-muted-foreground bg-muted/50 w-fit px-2 py-1 rounded-md">
            <Calendar size={12} className="text-primary/70" />
            {group.appointment}
          </div>
        )}
      </div>
      <Badge
        variant="secondary"
        className="shrink-0 text-[11px] font-medium shadow-sm transition-colors group-hover:bg-primary/10 group-hover:text-primary border-none"
      >
        {ACTIVITIES.labels[group.activity]}
      </Badge>
    </Link>
  );
}
