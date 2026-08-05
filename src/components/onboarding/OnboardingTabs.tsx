// src/components/onboarding/OnboardingTabs.tsx
"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Building2, KeyRound } from "lucide-react";
import { CreateMosqueForm } from "./CreateMosqueForm";
import { JoinMosqueForm } from "./JoinMosqueForm";
import {
  Card,
  CardHeader,
  CardSysLabel,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";


export function OnboardingTabs() {
  return (
    <Card className="w-full max-w-lg animate-scale-in">

      {/* ── Header ─────────────────────────────────────────────── */}
      <CardHeader>
        <CardSysLabel>نظام إدارة المسجد</CardSysLabel>
        <div className="flex flex-col gap-1 pt-2">
          <CardTitle>مرحباً، لنبدأ الإعداد</CardTitle>
          <CardDescription>
            اختر الطريقة التي تناسبك للبدء في استخدام النظام
          </CardDescription>
        </div>
      </CardHeader>

      <CardContent>
        <Tabs defaultValue="create" dir="rtl" className="flex flex-col gap-5">

          {/* ── Trigger Cards — variant="cards" من المكون نفسه ──── */}
          <TabsList variant="cards">

            <TabsTrigger
              value="create"
              className="group h-auto flex-col items-start gap-3"
            >
              <span className="flex size-9 items-center justify-center rounded-md bg-primary/10 transition-colors group-data-[state=active]:bg-primary group-data-[state=active]:[&>svg]:text-primary-foreground">
                <Building2 size={18} className="text-primary" aria-hidden="true" />
              </span>
              <span className="flex flex-col gap-1">
                <span className="flex items-center gap-1.5 text-sm font-medium text-foreground">
                  إنشاء مسجد جديد
                  <span
                    className="hidden size-1.5 rounded-full bg-primary group-data-[state=active]:inline-block"
                    aria-hidden="true"
                  />
                </span>
                <span className="text-xs leading-relaxed text-muted-foreground">
                  سجّل مسجدك وابدأ ك مدير
                </span>
              </span>
            </TabsTrigger>

            <TabsTrigger
              value="join"
              className="group h-auto flex-col items-start gap-3"
            >
              <span className="flex size-9 items-center justify-center rounded-md bg-muted transition-colors group-data-[state=active]:bg-primary group-data-[state=active]:[&>svg]:text-primary-foreground">
                <KeyRound size={18} className="text-muted-foreground group-data-[state=active]:text-primary-foreground" aria-hidden="true" />
              </span>
              <span className="flex flex-col gap-1">
                <span className="flex items-center gap-1.5 text-sm font-medium text-foreground">
                  الانضمام برمز دعوة
                  <span
                    className="hidden size-1.5 rounded-full bg-primary group-data-[state=active]:inline-block"
                    aria-hidden="true"
                  />
                </span>
                <span className="text-xs leading-relaxed text-muted-foreground">
                  لديك رمز من مدير مسجدك؟
                </span>
              </span>
            </TabsTrigger>

          </TabsList>

          {/* ── Forms ──────────────────────────────────────────── */}
          <TabsContent value="create" className="animate-fade-up">
            <CreateMosqueForm />
          </TabsContent>

          <TabsContent value="join" className="animate-fade-up">
            <JoinMosqueForm />
          </TabsContent>

        </Tabs>
      </CardContent>

    </Card>
  );
}