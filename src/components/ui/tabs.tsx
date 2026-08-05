// components/ui/tabs.tsx
"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Tabs as TabsPrimitive } from "radix-ui";
import { cn } from "@/lib/utils/utils";

/*
  Tabs — Design System Override
  ─────────────────────────────────────────────
  التغييرات الجوهرية عن shadcn الأصلي:

  1. tokens بدل hardcoded values:
     rounded-lg/md → rounded-md (--radius-md = 8px) في كل مكان
     focus ring 3px → ring-2 ring-ring/25 (نفس باقي الـ inputs/buttons)

  2. variant "default" (pill switcher):
     - bg-muted على الـ list (مكان محايد)
     - active trigger: bg-background + shadow-sm + border
       (يحاكي "زرار مرفوع" بدل بس تغيير لون الخلفية)
     - مفيش استخدام لـ primary هنا — لأن ده اختيار بين قيم متوازية،
       مش "action" يستدعي الـ emerald accent

  3. variant "line" (underline navigation):
     - الاستخدام: navigation بين views في نفس الصفحة
       مثال: "الكل" / "نشط" / "متوقف" فوق جدول الطلاب
     - active trigger: نص بلون primary + underline بلون primary
       (هنا الـ emerald مناسب لأنه "indicator" مش CTA)
     - بدون background للـ active — بس النص واللون والخط

  4. variant "cards" (visual selection):
     - الاستخدام: قرار فرعي بين مسارين/أكثر مختلفين جوهرياً
       مثال: onboarding (إنشاء مسجد / انضمام برمز)
     - كل trigger كارد قائم بذاته بـ border وpadding مستقل
     - active: border emerald خفيف (40%) + bg-primary/5 — بدون shadow
     - المحتوى داخل الـ trigger حر تماماً (icon box + عنوان + وصف)
       فلازم يتم تمرير h-auto flex-col items-start gap-* يدوياً
       عند الاستخدام لأن المحتوى متعدد الأسطر

  5. disabled state موجود في كل الـ variants — consistent مع باقي الـ inputs

  الاستخدام:
    <Tabs defaultValue="x" dir="rtl">
      <TabsList>                          ← default variant
        <TabsTrigger value="x">...</TabsTrigger>
      </TabsList>
      <TabsContent value="x">...</TabsContent>
    </Tabs>

    <TabsList variant="line">             ← line variant
      <TabsTrigger value="x">...</TabsTrigger>
    </TabsList>

    <TabsList variant="cards">            ← cards variant
      <TabsTrigger value="x" className="h-auto flex-col items-start gap-3">
        ...
      </TabsTrigger>
    </TabsList>
  ─────────────────────────────────────────────
*/

function Tabs({
  className,
  orientation = "horizontal",
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Root>) {
  return (
    <TabsPrimitive.Root
      data-slot="tabs"
      data-orientation={orientation}
      className={cn(
        "group/tabs flex gap-2 data-horizontal:flex-col",
        className
      )}
      {...props}
    />
  );
}

const tabsListVariants = cva(
  [
    "group/tabs-list inline-flex w-fit items-center justify-center",
    "text-muted-foreground",
    "group-data-horizontal/tabs:h-9",
    "group-data-vertical/tabs:h-fit group-data-vertical/tabs:flex-col",
  ],
  {
    variants: {
      variant: {
        /*
          default — Pill switcher:
          bg-muted كحاوية، الـ trigger النشط يرتفع بخلفية + border + shadow
          استخدام: تبديل بسيط بين 2-3 قيم (مثال: شهري/سنوي)
        */
        default: "rounded-md bg-muted p-1 gap-0.5",

        /*
          line — Underline navigation:
          بدون خلفية للحاوية، فاصل أسفل كل الصف
          استخدام: navigation بين views (مثال: الكل/نشط/متوقف فوق جدول)
        */
        line: "gap-1 border-b border-border bg-transparent rounded-none",

        /*
          cards — Visual selection:
          كل trigger كارد مستقل بحجمه الطبيعي — بدون حاوية موحدة
          استخدام: قرار فرعي بين مسارين مختلفين (مثال: onboarding)
          h-auto لازم يُمرَّر على TabsList نفسه عند الاستخدام
          لأن الـ trigger هنا بيحتوي محتوى متعدد الأسطر
        */
        cards: "h-auto w-full gap-3 bg-transparent p-0",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

function TabsList({
  className,
  variant = "default",
  ...props
}: React.ComponentProps<typeof TabsPrimitive.List> &
  VariantProps<typeof tabsListVariants>) {
  return (
    <TabsPrimitive.List
      data-slot="tabs-list"
      data-variant={variant}
      className={cn(tabsListVariants({ variant }), className)}
      {...props}
    />
  );
}

function TabsTrigger({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Trigger>) {
  return (
    <TabsPrimitive.Trigger
      data-slot="tabs-trigger"
      className={cn(
        // Base — shared بين الاتنين
        [
          "relative inline-flex items-center justify-center gap-1.5",
          "whitespace-nowrap text-sm font-medium",
          "px-3 py-1.5",
          "transition-colors duration-150",
          "outline-none",
          "focus-visible:ring-2 focus-visible:ring-ring/25",
          "disabled:pointer-events-none disabled:opacity-50",
          "group-data-vertical/tabs:w-full group-data-vertical/tabs:justify-start",
          "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        ],

        // ── default variant ──────────────────────────────────
        // Inactive: شفاف، نص خافت
        // Active: bg-background + border + shadow-sm (يحاكي رفع)
        [
          "group-data-[variant=default]/tabs-list:rounded-md",
          "group-data-[variant=default]/tabs-list:text-muted-foreground",
          "group-data-[variant=default]/tabs-list:hover:text-foreground",
          "group-data-[variant=default]/tabs-list:data-[state=active]:bg-background",
          "group-data-[variant=default]/tabs-list:data-[state=active]:text-foreground",
          "group-data-[variant=default]/tabs-list:data-[state=active]:shadow-sm",
          "group-data-[variant=default]/tabs-list:data-[state=active]:border",
          "group-data-[variant=default]/tabs-list:data-[state=active]:border-border",
          "dark:group-data-[variant=default]/tabs-list:data-[state=active]:bg-card",
        ],

        // ── line variant ──────────────────────────────────────
        // Active: نص + underline بلون primary (emerald) — indicator مش CTA
        [
          "group-data-[variant=line]/tabs-list:rounded-none",
          "group-data-[variant=line]/tabs-list:border-b-2",
          "group-data-[variant=line]/tabs-list:border-transparent",
          "group-data-[variant=line]/tabs-list:pb-2.5",
          "group-data-[variant=line]/tabs-list:text-muted-foreground",
          "group-data-[variant=line]/tabs-list:hover:text-foreground",
          "group-data-[variant=line]/tabs-list:data-[state=active]:border-primary",
          "group-data-[variant=line]/tabs-list:data-[state=active]:text-primary",
        ],

        // ── cards variant ─────────────────────────────────────
        // كل trigger كارد قائم بذاته — محتوى حر (icon + عناوين متعددة)
        // Active: border emerald واضح (2px) + خلفية primary/5 + dot indicator
        // الـ border بسماكة أكبر (مش لون فاتح فقط) عشان يبقى واضح
        // من نظرة واحدة مين المختار، حتى من غير تركيز
        [
          "group-data-[variant=cards]/tabs-list:flex-1",
          "group-data-[variant=cards]/tabs-list:rounded-lg",
          "group-data-[variant=cards]/tabs-list:border-2",
          "group-data-[variant=cards]/tabs-list:border-border",
          "group-data-[variant=cards]/tabs-list:p-4",
          "group-data-[variant=cards]/tabs-list:text-start",
          "group-data-[variant=cards]/tabs-list:hover:border-border",
          "group-data-[variant=cards]/tabs-list:hover:bg-muted/40",
          "group-data-[variant=cards]/tabs-list:data-[state=active]:border-primary",
          "group-data-[variant=cards]/tabs-list:data-[state=active]:bg-primary/5",
          "group-data-[variant=cards]/tabs-list:data-[state=active]:shadow-none",
          "group-data-[variant=cards]/tabs-list:data-[state=active]:hover:border-primary",
        ],

        className
      )}
      {...props}
    />
  );
}

function TabsContent({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Content>) {
  return (
    <TabsPrimitive.Content
      data-slot="tabs-content"
      className={cn("flex-1 outline-none", className)}
      {...props}
    />
  );
}

export { Tabs, TabsList, TabsTrigger, TabsContent, tabsListVariants };