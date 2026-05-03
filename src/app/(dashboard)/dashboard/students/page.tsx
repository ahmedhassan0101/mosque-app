// src/app/(dashboard)/dashboard/students/page.tsx
import { Suspense } from "react";
import Link from "next/link";
import { Plus, Search, SlidersHorizontal } from "lucide-react";
import type { Metadata } from "next";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { StudentsTableContent } from "@/components/students/StudentsTableContent";
import { StudentsTableSkeleton } from "@/components/students/StudentsTableSkeleton";

export const metadata: Metadata = { title: "قائمة الطلاب" };

type StudentsPageProps = {
  searchParams: Promise<{ query?: string; level?: string }>;
};

export default async function StudentsPage({ searchParams }: StudentsPageProps) {
  const { query, level } = await searchParams;

  return (
    <main className="space-y-6 p-6" dir="rtl">
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">الطلاب</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            إدارة بيانات الطلاب المسجّلين
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/students/new">
            <Plus size={16} className="ml-2" />
            تسجيل طالب
          </Link>
        </Button>
      </div>

      {/* ── Filters ── */}
      <form method="GET" className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search
            size={15}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
          />
          <Input
            name="query"
            defaultValue={query ?? ""}
            placeholder="ابحث باسم الطالب..."
            className="pr-9"
            aria-label="البحث في قائمة الطلاب"
          />
        </div>

        <div className="flex items-center gap-2">
          <SlidersHorizontal size={15} className="text-muted-foreground shrink-0" />
          <Select name="level" defaultValue={level ?? "all"}>
            <SelectTrigger className="w-36" aria-label="فلترة حسب المستوى">
              <SelectValue placeholder="كل المستويات" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">كل المستويات</SelectItem>
              <SelectItem value="beginner">مبتدئ</SelectItem>
              <SelectItem value="intermediate">متوسط</SelectItem>
              <SelectItem value="advanced">متقدم</SelectItem>
            </SelectContent>
          </Select>

          <Button type="submit" variant="outline" size="sm">
            تطبيق
          </Button>

          {(query || (level && level !== "all")) && (
            <Button variant="ghost" size="sm" asChild>
              <Link href="/dashboard/students">مسح</Link>
            </Button>
          )}
        </div>
      </form>

      {/* ── Table — streamed ── */}
      <section aria-label="جدول الطلاب">
        {/* key forces Suspense to re-show skeleton on filter change */}
        <Suspense key={`${query}-${level}`} fallback={<StudentsTableSkeleton />}>
          <StudentsTableContent query={query} level={level} />
        </Suspense>
      </section>
    </main>
  );
}