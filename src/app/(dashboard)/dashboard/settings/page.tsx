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
    <div className="container mx-auto py-8 px-4" dir="rtl">
      <header className="mb-6">
        <h1 className="text-2xl font-bold">إعدادات المسجد</h1>
        <p className="text-muted-foreground text-sm">
          إدارة تفاصيل المسجد، الأعضاء، وصلاحيات الوصول.
        </p>
      </header>

      <SettingsTabs
        mosque={data.mosque}
        users={data.users}
        currentUserId={data.currentUserId}
      />
    </div>
  );
}
