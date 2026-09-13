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
import { Copy, RefreshCw, KeyRound, AlertCircle } from "lucide-react";

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
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <KeyRound className="h-5 w-5 text-muted-foreground" />
          رمز الدعوة
        </CardTitle>
        <CardDescription className="text-sm">
          شارك هذا الرمز مع المشرفين الجدد للانضمام إلى مسجدك عبر صفحة الإعداد.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="flex max-w-md items-center gap-3">
          <Input
            value={code}
            readOnly
            dir="ltr"
            className="
              flex-1 font-mono text-center text-base
              tracking-[0.4em] font-semibold
              bg-muted/50 border border-dashed
              focus-visible:ring-0 focus-visible:border-input
            "
          />
          <Button
            variant="outline"
            size="icon"
            className="shrink-0"
            onClick={handleCopy}
            aria-label="نسخ الرمز"
          >
            <Copy className="h-5 w-5" />
          </Button>
        </div>

        <div>
          <Button
            variant="outline"
            onClick={handleGenerate}
            disabled={isPending}
            className="gap-2"
          >
            <RefreshCw
              className={`h-4 w-4 ${isPending ? "animate-spin" : ""}`}
            />
            توليد رمز جديد
          </Button>
        </div>

        <div className="flex items-start gap-2 rounded-md bg-amber-50 dark:bg-amber-950/30 p-3 border border-amber-200 dark:border-amber-900/50">
          <AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-500 mt-1.5 shrink-0" />
          <p className="text-base text-amber-800 dark:text-amber-400 leading-relaxed">
            عند توليد رمز جديد، سيصبح الرمز القديم غير صالح فوراً. تأكد من إعلام
            من أرسلت إليهم الرمز القديم.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
