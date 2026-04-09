// src\app\(dashboard)\sheikhs\[id]\page.tsx
import { notFound } from "next/navigation";
import { SheikhProfileClient } from "@/components/sheikhs/SheikhProfileClient";
import { getSheikhById, getSheikhProfile } from "@/lib/services/sheikh.service";

type SheikhProfileProps = { params: Promise<{ id: string }> };

/**
 * generateMetadata: runs on the server
 * fetches the sheikh's name to put in the page title
 */
export async function generateMetadata({ params }: SheikhProfileProps) {
  const { id } = await params;
  const sheikh = await getSheikhById(id);
  return { title: sheikh?.name ?? "الشيخ" };
}

export default async function SheikhProfilePage({
  params,
}: SheikhProfileProps) {
  const { id } = await params;
  const profile = await getSheikhProfile(id);
  if (!profile) notFound();

  return <SheikhProfileClient data={profile} sheikhId={id} />;
}
