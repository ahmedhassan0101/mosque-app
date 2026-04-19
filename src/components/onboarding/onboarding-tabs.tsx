"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CreateMosqueForm } from "./create-mosque-form";
import { JoinMosqueForm } from "./join-mosque-form";

export function OnboardingTabs() {
  return (
    <Tabs defaultValue="create" dir="rtl">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="create">إنشاء مسجد جديد</TabsTrigger>
        <TabsTrigger value="join">الانضمام برمز دعوة</TabsTrigger>
      </TabsList>
      <TabsContent value="create" className="mt-4">
        <CreateMosqueForm />
      </TabsContent>
      <TabsContent value="join" className="mt-4">
        <JoinMosqueForm />
      </TabsContent>
    </Tabs>
  );
}
