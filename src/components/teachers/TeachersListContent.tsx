// src/components/teacher/TeachersListContent.tsx
import { Users } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getTeachersList } from "@/queries/teacher.queries";
import { TeacherCard } from "./TeacherCard";

interface TeachersListContentProps {
  query?: string;
}

/**
 * Async Server Component — fetches and renders the teachers list.
 * Wrapped in Suspense by the parent page for streaming.
 */
export async function TeachersListContent({ query }: TeachersListContentProps) {
  const teachers = await getTeachersList();

  // Client-side filter by query (simple name search)
  // For production scale: move filtering to the DB query
  const filtered = query
    ? teachers.filter((t) => t.name.toLowerCase().includes(query.toLowerCase()))
    : teachers;

  if (filtered.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
          <Users size={28} className="text-muted-foreground" />
        </div>
        <h3 className="font-semibold text-foreground mb-1">
          {query ? "لا توجد نتائج مطابقة" : "لا يوجد معلمون بعد"}
        </h3>
        <p className="text-sm text-muted-foreground mb-6">
          {query
            ? `لم يتم العثور على معلم بالاسم "${query}"`
            : "ابدأ بإضافة أول معلم في المسجد"}
        </p>
        {!query && (
          <Button asChild>
            <Link href="/dashboard/teachers/new">إضافة معلم</Link>
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {filtered.map((teacher) => (
        <TeacherCard key={teacher._id.toString()} teacher={teacher} />
      ))}
    </div>
  );
}
