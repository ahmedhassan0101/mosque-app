// src/components/students/StudentsTable.tsx
"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  MoreHorizontal,
  Eye,
  Pencil,
  QrCode,
  Trash2,
  ChevronRight,
  ChevronLeft,
  Users,
  Loader2,
} from "lucide-react";
import { QRDialog } from "./QRDialog";
import ProfileImage from "../global/profileImage";
import { deleteStudentAction } from "@/lib/services/student.actions";
import type { StudentSerialized } from "@/types/serialized";

// --- Configuration & Constants ---
const ACTIVITY_LABELS: Record<
  string,
  { label: string; bg: string; text: string }
> = {
  quran: { label: "قرآن", bg: "bg-emerald-100", text: "text-emerald-800" },
  tarbiya: { label: "تربية", bg: "bg-blue-100", text: "text-blue-800" },
  tajweed: { label: "تجويد", bg: "bg-purple-100", text: "text-purple-800" },
  maqraa: { label: "مقرأة", bg: "bg-amber-100", text: "text-amber-800" },
  playground: { label: "ملعب", bg: "bg-rose-100", text: "text-rose-800" },
};

const LEVEL_LABELS: Record<
  string,
  { label: string; variant: "default" | "secondary" | "outline" }
> = {
  beginner: { label: "مبتدئ", variant: "outline" },
  intermediate: { label: "متوسط", variant: "secondary" },
  advanced: { label: "متقدم", variant: "default" },
};

// --- Types ---
// interface Student {
//   _id: string;
//   name: string;
//   birthDate: Date | string; // Handled dynamically
//   level: string;
//   enrollments: string[];
//   guardianPhone: string;
//   photo?: string;
// }

// interface Props {
//   students: Student[];
//   total: number;
//   page: number;
//   limit: number;
// }
interface Props {
  students: StudentSerialized[];
  totalPages: number;
  page: number;
}
// --- Main Component ---
export function StudentsTable({ students, totalPages, page }: Props) {
  const router = useRouter();
  const [qrId, setQrId] = useState<string | null>(null);
  const [qrName, setQrName] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // const totalPages = Math.ceil(total / limit);

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`هل أنت متأكد من حذف بيانات الطالب "${name}" بشكل نهائي؟`))
      return;
    setDeletingId(id);
    try {
      const result = await deleteStudentAction(id);
      if (result && result.error) {
        toast.error(result.error);
      } else {
        toast.success(`تم حذف الطالب ${name} بنجاح`);
        router.refresh();
      }
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <>
      <QRDialog
        studentId={qrId}
        studentName={qrName}
        open={!!qrId}
        onClose={() => setQrId(null)}
      />

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden transition-all">
        <Table>
          <TableHeader className="bg-gray-50/80">
            <TableRow className="hover:bg-transparent">
              <TableHead className="font-bold text-gray-700 w-75">
                بيانات الطالب
              </TableHead>
              <TableHead className="font-bold text-gray-700">السن</TableHead>
              <TableHead className="font-bold text-gray-700">المستوى</TableHead>
              <TableHead className="font-bold text-gray-700">
                الأنشطة المسجلة
              </TableHead>
              <TableHead className="font-bold text-gray-700">
                هاتف ولي الأمر
              </TableHead>
              <TableHead className="w-20"></TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {students.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6}>
                  <div className="flex flex-col items-center justify-center py-16 text-center animate-in fade-in zoom-in duration-500">
                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                      <Users className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      لا يوجد طلاب حالياً
                    </h3>
                    <p className="text-sm text-gray-500 max-w-sm">
                      لم يتم العثور على طلاب يطابقون معايير البحث الحالية، جرب
                      تغيير الفلاتر أو أضف طالباً جديداً.
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              students.map((s) => {
                const lvl = LEVEL_LABELS[s.level] ?? LEVEL_LABELS.beginner;
                const { years, months } = getAge(new Date(s.birthDate));
                const ageText = formatAgeAr(years, months);
                const isDeleting = deletingId === s._id;
                // const isDeleting = false;

                return (
                  <TableRow
                    key={s._id}
                    className={`group transition-colors hover:bg-emerald-50/40 ${isDeleting ? "opacity-50 pointer-events-none" : ""}`}
                  >
                    <TableCell>
                      <div className="flex items-center gap-4">
                        <div className="relative">
                          <ProfileImage photo={s.photo} name={s.name} />
                          {/* لمسة بصرية: مؤشر حالة نشط للطالب */}
                          <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
                        </div>
                        <div className="flex flex-col">
                          <span className="font-bold text-gray-900 group-hover:text-emerald-700 transition-colors">
                            {s.name}
                          </span>
                        </div>
                      </div>
                    </TableCell>

                    <TableCell>
                      <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-800">
                        {ageText}
                      </span>
                    </TableCell>

                    <TableCell>
                      <Badge
                        variant={lvl.variant}
                        className="shadow-sm font-semibold"
                      >
                        {lvl.label}
                      </Badge>
                    </TableCell>

                    <TableCell>
                      <div className="flex gap-1.5 flex-wrap">
                        {s.enrollments.map((act) => {
                          const config = ACTIVITY_LABELS[act];
                          if (config) {
                            return (
                              <Badge
                                key={act}
                                variant="secondary"
                                className={`${config.bg} ${config.text} border-none font-medium hover:bg-opacity-80`}
                              >
                                {config.label}
                              </Badge>
                            );
                          }
                          return (
                            <Badge
                              key={act}
                              variant="outline"
                              className="text-xs"
                            >
                              {act}
                            </Badge>
                          );
                        })}
                      </div>
                    </TableCell>

                    <TableCell>
                      <span
                        className="font-mono text-sm tracking-wide text-gray-600 bg-gray-50 px-2 py-1 rounded-md border border-gray-100"
                        dir="ltr"
                      >
                        {s.guardianPhone || "—"}
                      </span>
                    </TableCell>

                    <TableCell>
                      <DropdownMenu dir="rtl">
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-gray-500 hover:text-primary hover:bg-emerald-50"
                          >
                            {isDeleting ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <MoreHorizontal size={16} />
                            )}
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          // align="end"
                          className="w-48 font-medium rounded-xl shadow-lg"
                        >
                          <DropdownMenuItem
                            asChild
                            className="cursor-pointer hover:bg-emerald-50 focus:bg-emerald-50"
                          >
                            <Link href={`/students/${s._id}`}>
                              <Eye size={15} className="ml-2 text-primary" />{" "}
                              عرض الملف
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            asChild
                            className="cursor-pointer hover:bg-blue-50 focus:bg-blue-50"
                          >
                            <Link href={`/students/${s._id}/edit`}>
                              <Pencil
                                size={15}
                                className="ml-2 text-blue-600"
                              />{" "}
                              تعديل البيانات
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="cursor-pointer hover:bg-purple-50 focus:bg-purple-50"
                            onClick={() => {
                              setQrId(s._id);
                              setQrName(s.name);
                            }}
                          >
                            <QrCode
                              size={15}
                              className="ml-2 text-purple-600"
                            />{" "}
                            رمز الاستجابة (QR)
                          </DropdownMenuItem>

                          <DropdownMenuSeparator />

                          <DropdownMenuItem
                            className="cursor-pointer text-red-600 hover:bg-red-50 focus:bg-red-50 focus:text-red-700"
                            onClick={() => handleDelete(s._id, s.name)}
                          >
                            {/* <DeleteButton
                              deletedItem="student"
                              handleDelete={deleteStudentAction}
                              name={s.name}
                              id={s._id}
                            /> */}
                            <Trash2 size={15} className="ml-2" /> حذف الطالب
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      {/* RTL Aware Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-4 px-2">
          <p className="text-sm font-medium text-gray-500">
            الصفحة <span className="text-gray-900">{page}</span> من{" "}
            <span className="text-gray-900">{totalPages}</span>
          </p>
          <div className="flex gap-2" dir="ltr">
            {/* في RTL الـ Previous هو السهم لليمين، لذلك نعكس المنطق برمجياً ونتركه LTR لسهولة التحكم */}
            <Button
              variant="outline"
              size="sm"
              className="h-9 w-9 p-0 hover:bg-gray-100 hover:text-gray-900 rounded-lg"
              disabled={page >= totalPages}
              onClick={() => router.push(`?page=${page + 1}`)}
              title="الصفحة التالية"
            >
              <ChevronLeft size={16} /> {/* يتجه لليسار = التالي في العربي */}
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-9 w-9 p-0 hover:bg-gray-100 hover:text-gray-900 rounded-lg"
              disabled={page <= 1}
              onClick={() => router.push(`?page=${page - 1}`)}
              title="الصفحة السابقة"
            >
              <ChevronRight size={16} /> {/* يتجه لليمين = السابق في العربي */}
            </Button>
          </div>
        </div>
      )}
    </>
  );
}

// --- Helper Functions (Consider moving to src/lib/utils/date.ts) ---

export function getAge(birthDate: Date) {
  const today = new Date();
  let years = today.getFullYear() - birthDate.getFullYear();
  let months = today.getMonth() - birthDate.getMonth();

  if (months < 0) {
    years--;
    months += 12;
  }
  if (today.getDate() < birthDate.getDate()) {
    months--;
    if (months < 0) {
      years--;
      months += 12;
    }
  }
  return { years, months };
}

//   return { years, months };
// }
/**
 * دالة عبقرية لصياغة العمر بقواعد النحو العربي السليمة (التمييز)
 */
export function formatAgeAr(years: number, months: number) {
  const getYearText = (y: number) => {
    if (y === 0) return "";
    if (y === 1) return "سنة";
    if (y === 2) return "سنتان";
    if (y >= 3 && y <= 10) return `${y} سنوات`;
    return `${y} سنة`;
  };

  const getMonthText = (m: number) => {
    if (m === 0) return "";
    if (m === 1) return "شهر";
    if (m === 2) return "شهران";
    if (m >= 3 && m <= 10) return `${m} شهور`;
    return `${m} شهراً`;
  };

  const yText = getYearText(years);
  const mText = getMonthText(months);

  if (yText && mText) return `${yText}`;
  // if (yText && mText) return `${yText} و${mText}`;
  return yText || mText;
}

// export function formatAge(years: number, months: number) {
//   const yearText = years <= 10 ? "سنوات" : "سنة";

//   let result = `${years} ${yearText}`;

//   if (months > 0) {
//     const monthText = months === 1 ? "شهر" : "شهور";
//     result += ` و ${months} ${monthText}`;
//   }

//   return result;
// }
