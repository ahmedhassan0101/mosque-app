// // components/ui/card.tsx

// import * as React from "react";
// import { cn } from "@/lib/utils/utils";

// /*
//   Card — Design System Override
//   ─────────────────────────────────────────────
//   التغييرات عن shadcn الأصلي:

//   1. border border-border بدل ring-1 ring-foreground/10
//      — أوضح وأكثر اتساقاً مع الـ design tokens
//   2. rounded-lg (--radius-lg = 12px) بدل rounded-xl (16px)
//      — الـ 12px هو الـ card radius المحدد في الـ spec
//   3. shadow-sm في light فقط — الـ dark mode يعتمد على الـ border
//   4. إزالة overflow-hidden من الـ base — ممكن يكسر الـ dropdowns
//      (يُضاف يدوياً عند الحاجة)
//   5. py-(--card-spacing) → p-4 md:p-6 — باستخدام الـ utility classes
//   6. إزالة text-sm من الـ base — الـ font size يُحدد في كل مكان بشكل صريح

//   Variants:
//     default → card عادي مع padding متغير
//     stat    → dashboard KPI card — padding ثابت p-6
//     flat    → بدون shadow — dark mode first

//   الاستخدام:
//     <Card>                      → default card
//     <Card variant="stat">       → stat/KPI card
//     <CardHeader>...</CardHeader>
//     <CardContent>...</CardContent>
//     <CardFooter>...</CardFooter>
//   ─────────────────────────────────────────────
// */

// type CardVariant = "default" | "stat" | "flat";

// interface CardProps extends React.ComponentProps<"div"> {
//   variant?: CardVariant;
// }

// function Card({ className, variant = "default", ...props }: CardProps) {
//   return (
//     <div
//       data-slot="card"
//       data-variant={variant}
//       className={cn(
//         // Base — shared
//         "flex flex-col gap-0 bg-card text-card-foreground",
//         "rounded-lg border border-border",
//         // Shadow: light mode only — dark mode uses border
//         "shadow-sm dark:shadow-none",
//         // Variant overrides
//         variant === "stat" && "p-6",
//         variant === "flat" && "shadow-none",
//         className
//       )}
//       {...props}
//     />
//   );
// }

// function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
//   return (
//     <div
//       data-slot="card-header"
//       className={cn(
//         "flex items-start justify-between gap-4",
//         "p-4 pb-0 md:p-6 md:pb-0",
//         className
//       )}
//       {...props}
//     />
//   );
// }

// function CardTitle({ className, ...props }: React.ComponentProps<"div">) {
//   return (
//     <div
//       data-slot="card-title"
//       className={cn(
//         "text-base font-semibold leading-snug text-foreground",
//         className
//       )}
//       {...props}
//     />
//   );
// }

// function CardDescription({ className, ...props }: React.ComponentProps<"div">) {
//   return (
//     <div
//       data-slot="card-description"
//       className={cn("text-sm text-muted-foreground leading-normal", className)}
//       {...props}
//     />
//   );
// }

// /*
//   CardAction:
//   العنصر الاختياري في يسار الـ header (RTL).
//   يُستخدم لوضع link أو button صغير بجانب الـ title.
//   مثال: "عرض الكل" بجانب عنوان القسم
// */
// function CardAction({ className, ...props }: React.ComponentProps<"div">) {
//   return (
//     <div
//       data-slot="card-action"
//       className={cn("shrink-0 self-start", className)}
//       {...props}
//     />
//   );
// }

// function CardContent({ className, ...props }: React.ComponentProps<"div">) {
//   return (
//     <div
//       data-slot="card-content"
//       className={cn("p-4 md:p-6", className)}
//       {...props}
//     />
//   );
// }

// /*
//   CardFooter:
//   خلفية muted خفيفة + border علوي — للـ actions أو الـ metadata.
//   مثال: "حفظ / إلغاء" في نهاية الـ settings card
// */
// function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
//   return (
//     <div
//       data-slot="card-footer"
//       className={cn(
//         "flex items-center justify-end gap-2",
//         "border-t border-border bg-muted/40",
//         "px-4 py-3 md:px-6",
//         "rounded-b-lg",
//         className
//       )}
//       {...props}
//     />
//   );
// }

// export {
//   Card,
//   CardHeader,
//   CardTitle,
//   CardDescription,
//   CardAction,
//   CardContent,
//   CardFooter,
// };
// components/ui/card.tsx

import * as React from "react";
import { cn } from "@/lib/utils/utils";

/*
  Card — Design System (Final)
  ─────────────────────────────────────────────
  CardHeader — Option B:
  - بدون border-b — الـ spacing وحده يفصل
  - الـ border-b خُفِّف لـ 40% opacity كـ prop اختياري للـ cards الداخلية
  - sys-label (اسم النظام) + title كبير text-2xl + description

  القرار:
  - border بين الـ header والـ content: اختياري عبر prop
  - Auth cards: بدون border
  - Dashboard cards مع header معقد: يمكن تفعيله
  ─────────────────────────────────────────────
*/

type CardVariant = "default" | "stat" | "flat";

interface CardProps extends React.ComponentProps<"div"> {
  variant?: CardVariant;
}

function Card({ className, variant = "default", ...props }: CardProps) {
  return (
    <div
      data-slot="card"
      data-variant={variant}
      className={cn(
        "flex flex-col bg-card text-card-foreground",
        "rounded-lg border border-border",
        "shadow-sm dark:shadow-none",
        variant === "stat" && "p-6",
        variant === "flat" && "shadow-none",
        className
      )}
      {...props}
    />
  );
}

/*
  CardHeader:
  - divider={true} → border-b خفيف 40% للـ dashboard cards
  - divider={false} → بدون border (default) للـ auth cards
*/
interface CardHeaderProps extends React.ComponentProps<"div"> {
  divider?: boolean;
}

function CardHeader({ className, divider = false, ...props }: CardHeaderProps) {
  return (
    <div
      data-slot="card-header"
      className={cn(
        "flex flex-col gap-1",
        "px-6 pt-6 pb-5",
        divider && "border-b border-border/40 pb-5",
        className
      )}
      {...props}
    />
  );
}

/*
  CardSysLabel:
  السطر الصغير فوق الـ title — اسم النظام أو context
  dot أخضر emerald + نص muted صغير
  مثال: "نظام إدارة المسجد" في auth cards
*/
function CardSysLabel({ className, children, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-sys-label"
      className={cn(
        "flex items-center gap-1.5 text-xs text-muted-foreground",
        className
      )}
      {...props}
    >
      {/* Emerald dot — الـ brand accent الوحيد في الـ header */}
      <span
        className="size-1.5 rounded-full bg-primary shrink-0"
        aria-hidden="true"
      />
      {children}
    </div>
  );
}

function CardTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-title"
      className={cn(
        // text-2xl (24px) — فرق واضح وقوي عن الـ body text (14px)
        "text-2xl font-semibold leading-tight text-foreground",
        className
      )}
      {...props}
    />
  );
}

function CardDescription({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-description"
      className={cn(
        "text-sm leading-normal text-muted-foreground",
        className
      )}
      {...props}
    />
  );
}

function CardAction({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-action"
      className={cn("shrink-0 self-start", className)}
      {...props}
    />
  );
}

function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-content"
      className={cn("px-6 pb-6 pt-0", className)}
      {...props}
    />
  );
}

function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-footer"
      className={cn(
        "flex items-center justify-end gap-2",
        "border-t border-border/40 bg-muted/30",
        "px-6 py-4",
        "rounded-b-lg",
        className
      )}
      {...props}
    />
  );
}

export {
  Card,
  CardHeader,
  CardSysLabel,
  CardTitle,
  CardDescription,
  CardAction,
  CardContent,
  CardFooter,
};