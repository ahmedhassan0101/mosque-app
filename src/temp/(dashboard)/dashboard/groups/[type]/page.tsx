// src/app/(dashboard)/dashboard/groups/[type]/page.tsx
import { Suspense } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { Button } from "@/components/ui/button";
import { GroupsGridContent } from "@/components/groups/GroupsGridContent";
import { GroupsGridSkeleton } from "@/components/groups/GroupsGridSkeleton";
import { ACTIVITIES, type ActivityType } from "@/constants";

type Props = { params: Promise<{ type: string }> };

function assertActivityType(type: string): type is ActivityType {
  return (ACTIVITIES.values as readonly string[]).includes(type);
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { type } = await params;
  if (!assertActivityType(type)) return { title: "غير موجود" };
  return { title: ACTIVITIES.labels[type] };
}

export default async function GroupsPage({ params }: Props) {
  const { type } = await params;
  if (!assertActivityType(type)) notFound();

  return (
    <main className="space-y-6 p-6" dir="rtl">
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            {ACTIVITIES.labels[type]}
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            إدارة مجموعات {ACTIVITIES.labels[type]}
          </p>
        </div>
        <Button asChild>
          <Link href={`/dashboard/groups/${type}/new`}>
            <Plus size={16} className="ml-2" />
            إنشاء مجموعة
          </Link>
        </Button>
      </div>

      {/* ── Grid — streamed ── */}
      <section aria-label={`قائمة مجموعات ${ACTIVITIES.labels[type]}`}>
        <Suspense fallback={<GroupsGridSkeleton />}>
          <GroupsGridContent type={type} />
        </Suspense>
      </section>
    </main>
  );
}
