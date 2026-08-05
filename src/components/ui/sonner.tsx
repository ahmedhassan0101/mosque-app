// components/ui/sonner.tsx
"use client";

import { useTheme } from "next-themes";
import { Toaster as Sonner, type ToasterProps } from "sonner";
import {
  CircleCheck,
  Info,
  TriangleAlert,
  OctagonX,
  Loader2,
} from "lucide-react";

/*
  Toaster — Design System Override
  ─────────────────────────────────────────────
  التغييرات عن النسخة الأصلية:

  1. CSS variables تبعنا بدل hardcoded colors
     --normal-bg      → var(--popover)       الـ card bg
     --normal-text    → var(--popover-foreground)
     --normal-border  → var(--border)
     --border-radius  → var(--radius-md)     8px — أصغر من الـ card radius

  2. الـ icons — محتفظ بيهم، فقط أضفنا text-{color} classes
     عشان الـ icon يورث لون الـ variant من الـ toast نفسه

  3. font-family → var(--font-sans) للـ Arabic text

  4. position → top-center (مش bottom) لأن RTL والـ Arabic users
     بيتوقعوا الـ notifications فوق

  الاستخدام:
    import { toast } from "sonner"

    toast.success("تم حفظ البيانات بنجاح")
    toast.error("حدث خطأ، حاول مرة أخرى")
    toast.warning("لم يتم التحقق من البريد الإلكتروني")
    toast.info("تم إرسال رابط إعادة التعيين")
    toast.loading("جاري الحفظ...")
  ─────────────────────────────────────────────
*/

function Toaster({ ...props }: ToasterProps) {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      position="top-center"
      dir="rtl"
      richColors
      closeButton
      icons={{
        success: <CircleCheck className="size-4 text-success" />,
        info: <Info className="size-4 text-info" />,
        warning: <TriangleAlert className="size-4 text-warning" />,
        error: <OctagonX className="size-4 text-destructive" />,
        loading: (
          <Loader2 className="size-4 animate-spin text-muted-foreground" />
        ),
      }}
      style={
        {
          // الـ background والـ text — نفس الـ popover (card floating)
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
          // الـ radius — md (8px) أصغر من الـ card radius
          "--border-radius": "var(--radius-md)",
          // Typography
          fontFamily: "var(--font-sans)",
          fontSize: "var(--text-sm)", // 13px
        } as React.CSSProperties
      }
      toastOptions={{
        classNames: {
          toast: ["border border-border shadow-md", "dark:shadow-none"].join(
            " ",
          ),
          title: "text-sm font-medium text-foreground",
          description: "text-xs text-muted-foreground",
          closeButton: [
            "border-border text-muted-foreground",
            "hover:text-foreground hover:bg-muted",
          ].join(" "),
        },
      }}
      {...props}
    />
  );
}

export { Toaster };
