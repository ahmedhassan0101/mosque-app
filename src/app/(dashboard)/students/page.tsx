// import { Suspense } from "react";
// src\app\(dashboard)\students\page.tsx
import Link from "next/link";
import { connectDB } from "@/lib/db/connect";
import Student from "@/models/Student";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { UserPlus, Search } from "lucide-react";
import { StudentsTable } from "@/components/students/StudentsTable";
import { getMosqueId } from "@/lib/auth/get-context";

export const metadata = { title: "الطلاب" };

export default async function StudentsPage({
  searchParams,
}: {
  searchParams: { search?: string; activity?: string; page?: string };
}) {
   const mosqueId = await getMosqueId();

  await connectDB();

  const filter: Record<string, unknown> = { mosqueId, isActive: true };
  if (searchParams.activity) filter.enrollments = searchParams.activity;
  if (searchParams.search)
    filter.name = { $regex: searchParams.search, $options: "i" };

  const page = Number(searchParams.page ?? 1);
  const limit = 20;

  const [students, total] = await Promise.all([
    Student.find(filter)
      .sort({ name: 1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(),
    Student.countDocuments(filter),
  ]);

  // Serialize for client
  const serialized = students.map((s) => ({
    ...s,
    _id: s._id.toString(),
    mosqueId: s.mosqueId.toString(),
    groupId: s.groupId?.toString() ?? null,
  }));
  console.log("serialized", { serialized });
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">الطلاب</h1>
          <p className="text-muted-foreground text-sm">إجمالي {total} طالب</p>
        </div>
        <Button asChild>
          <Link href="/students/new">
            <UserPlus size={16} className="ml-2" />
            إضافة طالب
          </Link>
        </Button>
      </div>

      {/* Filters */}
      <div className="flex gap-3 flex-wrap">
        <form className="flex gap-2">
          <Input
            name="search"
            placeholder="ابحث باسم الطالب..."
            defaultValue={searchParams.search}
            className="w-64"
          />
          <Button type="submit" variant="outline" size="icon">
            <Search size={16} />
          </Button>
        </form>

        <div className="flex gap-2 flex-wrap">
          {[
            { label: "الكل", value: "" },
            { label: "قرآن", value: "quran" },
            { label: "تربية", value: "tarbiya" },
            { label: "تجويد", value: "tajweed" },
            { label: "مقرأة", value: "maqraa" },
            { label: "ملعب", value: "playground" },
          ].map(({ label, value }) => (
            <Link key={value} href={`/students?activity=${value}`}>
              <Badge
                variant={
                  searchParams.activity === value ||
                  (!searchParams.activity && !value)
                    ? "default"
                    : "outline"
                }
                className="cursor-pointer"
              >
                {label}
              </Badge>
            </Link>
          ))}
        </div>
      </div>

      {/* Table */}
      <StudentsTable
        students={serialized}
        total={total}
        page={page}
        limit={limit}
      />
    </div>
  );
}
