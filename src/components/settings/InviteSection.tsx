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
    <Card className="max-w-lg">
      <CardHeader>
        <CardTitle>رمز الدعوة</CardTitle>
        <CardDescription>
          شارك هذا الرمز مع المشرفين الجدد للانضمام إلى مسجدك عبر صفحة الإعداد.
        </CardDescription>
      </CardHeader>
 
      <CardContent className="space-y-4">
        {/* Code display + copy */}
        <div className="flex items-center gap-2">
          <Input
            value={code}
            readOnly
            dir="ltr"
            className="
              flex-1 font-mono text-center text-base
              tracking-[0.3em] font-semibold
              bg-muted/50 border-dashed
              focus-visible:ring-0 focus-visible:border-input
            "
          />
          <Button
            variant="outline"
            size="icon"
            onClick={handleCopy}
            aria-label="نسخ الرمز"
          >
            <Copy className="h-4 w-4" />
          </Button>
        </div>
 
        {/* Regenerate */}
        <Button
          variant="secondary"
          onClick={handleGenerate}
          disabled={isPending}
          className="gap-2"
        >
          <RefreshCw
            className={`h-3.5 w-3.5 transition-transform duration-500 ${isPending ? "animate-spin" : ""}`}
          />
          توليد رمز جديد
        </Button>
 
        {/* Helper note */}
        <p className="text-xs text-muted-foreground leading-relaxed">
          عند توليد رمز جديد، سيصبح الرمز القديم غير صالح فوراً. تأكد من إعلام من أرسلت إليهم الرمز القديم.
        </p>
      </CardContent>
    </Card>
  );
}
