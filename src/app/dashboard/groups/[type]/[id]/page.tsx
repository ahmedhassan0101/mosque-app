// src/app/(dashboard)/dashboard/groups/[type]/[id]/page.tsx
import { Suspense } from "react";
import Link from "next/link";
import { ChevronLeft, Home } from "lucide-react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { getGroupById } from "@/queries/group.queries";
import { GroupProfileContent } from "@/components/groups/GroupProfileContent";
import { GroupProfileSkeleton } from "@/components/groups/GroupProfileSkeleton";
import { ACTIVITIES, type ActivityType } from "@/constants";

type Props = { params: Promise<{ type: string; id: string }> };

function assertActivityType(type: string): type is ActivityType {
  return (ACTIVITIES.values as readonly string[]).includes(type);
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { type, id } = await params;
  if (!assertActivityType(type)) return { title: "غير موجود" };
  const group = await getGroupById(id);
  return {
    title: group
      ? `${group.name} — ${ACTIVITIES.labels[type]}`
      : "تفاصيل المجموعة",
  };
}

export default async function GroupDetailsPage({ params }: Props) {
  const { type, id } = await params;
  if (!assertActivityType(type)) notFound();

  // Pre-fetch for breadcrumb name — deduplicated by React cache()
  const group = await getGroupById(id);

  return (
    <div className="container-detail flex flex-col gap-6" dir="rtl">
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
          {ACTIVITIES.labels[type]}
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
    </div>
  );
}
