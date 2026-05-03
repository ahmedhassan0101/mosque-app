// src/app/(dashboard)/dashboard/groups/[type]/[id]/page.tsx
import { Suspense } from "react";
import Link from "next/link";
import { ChevronLeft, Home } from "lucide-react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ACTIVITIES, ACTIVITY_LABELS, type ActivityType } from "@/types";
import { getGroupById } from "@/lib/data/group.data";
import { GroupProfileContent } from "@/components/groups/GroupProfileContent";
import { GroupProfileSkeleton } from "@/components/groups/GroupProfileSkeleton";

type Props = { params: Promise<{ type: string; id: string }> };

function assertActivityType(type: string): type is ActivityType {
  return (ACTIVITIES as readonly string[]).includes(type);
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { type, id } = await params;
  if (!assertActivityType(type)) return { title: "غير موجود" };
  const group = await getGroupById(id);
  return {
    title: group
      ? `${group.name} — ${ACTIVITY_LABELS[type]}`
      : "تفاصيل المجموعة",
  };
}

export default async function GroupDetailsPage({ params }: Props) {
  const { type, id } = await params;
  if (!assertActivityType(type)) notFound();

  // Pre-fetch for breadcrumb name — deduplicated by React cache()
  const group = await getGroupById(id);

  return (
    <main className="max-w-5xl mx-auto px-4 py-6 space-y-5" dir="rtl">
      {/* ── Breadcrumb ── */}
      <nav
        aria-label="مسار التنقل"
        className="flex items-center gap-1.5 text-sm text-muted-foreground"
      >
        <Link
          href="/dashboard"
          className="hover:text-foreground transition-colors flex items-center gap-1"
        >
          <Home size={13} />
          <span>الرئيسية</span>
        </Link>
        <ChevronLeft size={13} className="rotate-180" />
        <Link
          href={`/dashboard/groups/${type}`}
          className="hover:text-foreground transition-colors"
        >
          {ACTIVITY_LABELS[type]}
        </Link>
        <ChevronLeft size={13} className="rotate-180" />
        <span className="text-foreground font-medium truncate max-w-50">
          {group?.name ?? "تفاصيل المجموعة"}
        </span>
      </nav>

      {/* ── Profile — streamed ── */}
      <Suspense fallback={<GroupProfileSkeleton />}>
        <GroupProfileContent id={id} type={type} />
      </Suspense>
    </main>
  );
}