"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MosqueDetailsForm } from "./mosque-details-form";
import { UserManagement } from "./user-management";
import { InviteSection } from "./invite-section";

interface SettingsTabsProps {
  mosque: {
    id: string;
    name: string;
    address: string;
    phone: string;
    inviteCode: string;
  };
  users: {
    id: string;
    name: string;
    email: string;
    role: string;
    image: string | null;
  }[];
  currentUserId: string;
}

export function SettingsTabs({ mosque, users, currentUserId }: SettingsTabsProps) {
  return (
    <Tabs defaultValue="details" dir="rtl">
      <TabsList className="mb-6">
        <TabsTrigger value="details">بيانات المسجد</TabsTrigger>
        <TabsTrigger value="users">إدارة المستخدمين</TabsTrigger>
        <TabsTrigger value="invite">رمز الدعوة</TabsTrigger>
      </TabsList>

      <TabsContent value="details">
        <MosqueDetailsForm mosque={mosque} />
      </TabsContent>

      <TabsContent value="users">
        <UserManagement
          users={users}
          mosqueId={mosque.id}
          currentUserId={currentUserId}
        />
      </TabsContent>

      <TabsContent value="invite">
        <InviteSection mosqueId={mosque.id} initialCode={mosque.inviteCode} />
      </TabsContent>
    </Tabs>
  );
}