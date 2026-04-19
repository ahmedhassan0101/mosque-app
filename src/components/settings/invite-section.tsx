"use client";

import { refreshInviteCode } from "@/actions/settings.actions";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useState, useTransition } from "react";
import { Copy, RefreshCw } from "lucide-react";

interface InviteSectionProps {
  mosqueId: string;
  initialCode: string;
}

export function InviteSection({ mosqueId, initialCode }: InviteSectionProps) {
  const [code, setCode] = useState(initialCode);
  const [isPending, startTransition] = useTransition();

  const handleGenerate = () => {
    startTransition(async () => {
      const result = await refreshInviteCode(mosqueId);

      if (result.status !== "success") {
        toast.error(result.message);
        return;
      }

      setCode(result.data!.inviteCode);
      toast.success(result.message);
    });
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    toast.success("تم نسخ الرمز إلى الحافظة.");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>رمز الدعوة</CardTitle>
        <CardDescription>
          شارك هذا الرمز مع المستخدمين للانضمام إلى مسجدك
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Input
            value={code}
            readOnly
            className="font-mono text-center text-lg tracking-widest"
          />
          <Button variant="outline" size="icon" onClick={handleCopy}>
            <Copy className="h-4 w-4" />
          </Button>
        </div>

        <Button
          variant="secondary"
          onClick={handleGenerate}
          disabled={isPending}
          className="gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${isPending ? "animate-spin" : ""}`} />
          توليد رمز جديد
        </Button>
      </CardContent>
    </Card>
  );
}
