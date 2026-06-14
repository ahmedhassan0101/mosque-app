// src/app/(dashboard)/dashboard/sessions/new/page.tsx
import type { Metadata } from "next";
import { getTeachersList } from "@/queries/teacher.queries";
import SessionForm from "@/components/sessions/SessionForm";
import { getGroupOptions } from "@/queries/group.queries";

export const metadata: Metadata = { title: "تسجيل جلسة جديدة" };

export default async function NewSessionPage() {
  // Both fetched server-side — no client fetch needed for these

  const [teachers, groups] = await Promise.all([
    getTeachersList(),
    getGroupOptions(),
  ]);

  return (
    <div className="max-w-3xl mx-auto py-6 px-4">
      <h1 className="text-xl font-semibold mb-6">تسجيل جلسة جديدة</h1>
      <SessionForm teachers={teachers} groups={groups} />
    </div>
  );
}
