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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
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
} from "lucide-react";
import { QRDialog } from "./QRDialog";

const ACTIVITY_LABELS: Record<string, string> = {
  quran: "قرآن",
  tarbiya: "تربية",
  tajweed: "تجويد",
  maqraa: "مقرأة",
  playground: "ملعب",
};

const LEVEL_LABELS: Record<
  string,
  { label: string; variant: "default" | "secondary" | "outline" }
> = {
  beginner: { label: "مبتدئ", variant: "outline" },
  intermediate: { label: "متوسط", variant: "secondary" },
  advanced: { label: "متقدم", variant: "default" },
};

interface Student {
  _id: string;
  name: string;
  birthDate: Date;
  level: string;
  enrollments: string[];
  guardianPhone: string;
  photo?: string;
}

interface Props {
  students: Student[];
  total: number;
  page: number;
  limit: number;
}

export function StudentsTable({ students, total, page, limit }: Props) {
  const router = useRouter();
  const [qrId, setQrId] = useState<string | null>(null);
  const [qrName, setQrName] = useState("");

  const totalPages = Math.ceil(total / limit);

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`هل تريد حذف الطالب "${name}"؟`)) return;
    const res = await fetch(`/api/students/${id}`, { method: "DELETE" });
    if (res.ok) {
      toast.success("تم حذف الطالب");
      router.refresh();
    } else {
      toast.error("حدث خطأ");
    }
  };

  // const currentYear = new Date().getFullYear();

  // const age =new Date().getFullYear() - new Date(student.birthDate).getFullYear();
  return (
    <>
      {/* QR Dialog */}
      <QRDialog
        studentId={qrId}
        studentName={qrName}
        open={!!qrId}
        onClose={() => setQrId(null)}
      />

      <div className="rounded-lg border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>الطالب</TableHead>
              <TableHead>السن</TableHead>
              <TableHead>المستوى</TableHead>
              <TableHead>الأنشطة</TableHead>
              <TableHead>هاتف ولي الأمر</TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {students.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center py-12 text-muted-foreground"
                >
                  لا يوجد طلاب
                </TableCell>
              </TableRow>
            )}
            {students.map((s) => {
              const lvl = LEVEL_LABELS[s.level] ?? LEVEL_LABELS.beginner;
              console.log("Student birthDate:", s.birthDate);
              //console result => Student birthDate: Wed Jun 20 2018 00:00:00 GMT+0200 (Eastern European Standard Time)
              const age =
                new Date().getFullYear() - new Date(s.birthDate).getFullYear();
              // const { years, months } = getAge(new Date(s.birthDate));
              // const ageText = formatAge(years, months);
              // console.log("Student age:", currentYear - s.birthDate);
              return (
                <TableRow key={s._id} className="hover:bg-muted/30">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="w-8 h-8">
                        <AvatarImage src={s.photo} alt={s.name} />
                        <AvatarFallback className="bg-primary/10 text-primary text-xs font-bold">
                          {s.name.slice(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-medium text-sm">{s.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {age} سنة
                    {/* {ageText} */}
                  </TableCell>

                  <TableCell>
                    <Badge variant={lvl.variant} className="text-xs">
                      {lvl.label}
                    </Badge>
                  </TableCell>

                  <TableCell>
                    <div className="flex gap-1 flex-wrap">
                      {s.enrollments.map((act) => (
                        <Badge key={act} variant="outline" className="text-xs">
                          {ACTIVITY_LABELS[act] ?? act}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>

                  <TableCell
                    className="text-sm text-muted-foreground"
                    // dir="ltr"
                  >
                    {s.guardianPhone}
                  </TableCell>

                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal size={14} />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link href={`/students/${s._id}`}>
                            <Eye size={14} className="ml-2" /> عرض
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href={`/students/${s._id}/edit`}>
                            <Pencil size={14} className="ml-2" /> تعديل
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => {
                            setQrId(s._id);
                            setQrName(s.name);
                          }}
                        >
                          <QrCode size={14} className="ml-2" /> عرض QR
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-destructive focus:text-destructive"
                          onClick={() => handleDelete(s._id, s.name)}
                        >
                          <Trash2 size={14} className="ml-2" /> حذف
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-2">
          <p className="text-sm text-muted-foreground">
            صفحة {page} من {totalPages}
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page <= 1}
              onClick={() => router.push(`?page=${page - 1}`)}
            >
              <ChevronRight size={14} />
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={page >= totalPages}
              onClick={() => router.push(`?page=${page + 1}`)}
            >
              <ChevronLeft size={14} />
            </Button>
          </div>
        </div>
      )}
    </>
  );
}

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

export function formatAge(years: number, months: number) {
  const yearText = years <= 10 ? "سنوات" : "سنة";

  let result = `${years} ${yearText}`;

  if (months > 0) {
    const monthText = months === 1 ? "شهر" : "شهور";
    result += ` و ${months} ${monthText}`;
  }

  return result;
}
