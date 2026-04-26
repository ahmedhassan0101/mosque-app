import { redirect } from "next/navigation";
import { getMosqueSettingsData } from "@/lib/data/mosque.data";
import { SettingsTabs } from "@/components/settings/settings-tabs";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "الإعدادات | Masjid ERP" };

export default async function SettingsPage() {
  const data = await getMosqueSettingsData();

  if (!data) {
    redirect("/dashboard");
  }

  return (
    <div dir="rtl" className="space-y-6">
      {/* ── Page header ─────────────────────────────────────────── */}
      <div>
        <h1 className="text-xl font-bold tracking-tight text-foreground">
          إعدادات المسجد
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          إدارة تفاصيل المسجد، الأعضاء، وصلاحيات الوصول.
        </p>
      </div>

      {/* ── Tabs ────────────────────────────────────────────────── */}
      <SettingsTabs
        mosque={data.mosque}
        users={data.users}
        currentUserId={data.currentUserId}
      />
    </div>
  );
}
