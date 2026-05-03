// src/app/(dashboard)/dashboard/teachers/page.tsx
import { Suspense } from "react";
import Link from "next/link";
import { Plus, Search } from "lucide-react";
import type { Metadata } from "next";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TeachersListContent } from "@/components/teacher/TeachersListContent";
import { TeachersListSkeleton } from "@/components/teacher/TeachersListSkeleton";

export const metadata: Metadata = { title: "إدارة المعلمين" };

type TeachersPageProps = {
  searchParams: Promise<{ query?: string }>;
};

export default async function TeachersPage({ searchParams }: TeachersPageProps) {
  const { query } = await searchParams;

  return (
    <main className="space-y-6 p-6" dir="rtl">
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">المعلمون</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            إدارة بيانات المعلمين والشيوخ
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/teachers/new">
            <Plus size={16} className="ml-2" />
            إضافة معلم
          </Link>
        </Button>
      </div>

      {/* ── Search ── */}
      <form method="GET" className="relative max-w-sm">
        <Search
          size={15}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
        />
        <Input
          name="query"
          defaultValue={query ?? ""}
          placeholder="ابحث باسم المعلم..."
          className="pr-9"
          aria-label="البحث في قائمة المعلمين"
        />
      </form>

      {/* ── List — streamed ── */}
      <section aria-label="قائمة المعلمين">
        {/*
          key={query} forces Suspense to re-show the skeleton on each new search,
          giving immediate visual feedback instead of stale data during fetch.
        */}
        <Suspense key={query} fallback={<TeachersListSkeleton />}>
          <TeachersListContent query={query} />
        </Suspense>
      </section>
    </main>
  );
}