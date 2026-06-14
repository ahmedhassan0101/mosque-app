// src/app/(dashboard)/dashboard/sessions/[id]/edit/page.tsx
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTeachersList } from "@/queries/teacher.queries";
import { getSessionById } from "@/queries/session.queries";
import SessionForm from "@/components/sessions/SessionForm";
import { getGroupOptions } from "@/queries/group.queries";

type EditSessionPageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({
  params,
}: EditSessionPageProps): Promise<Metadata> {
  const { id } = await params;
  const session = await getSessionById(id);
  return { title: session ? "تعديل الجلسة" : "جلسة غير موجودة" };
}

export default async function EditSessionPage({
  params,
}: EditSessionPageProps) {
  const { id } = await params;

  const [session, teachers, groups] = await Promise.all([
    getSessionById(id),
    getTeachersList(),
    getGroupOptions(),
  ]);

  if (!session) notFound();

  return (
    <div className="max-w-3xl mx-auto py-6 px-4">
      <h1 className="text-xl font-semibold mb-6">تعديل الجلسة</h1>
      <SessionForm
        initialData={session}
        sessionId={id}
        teachers={teachers}
        groups={groups}
      />
    </div>
  );
}
