import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "radix-ui";
import { cn } from "@/lib/utils/utils";

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center rounded-md border border-transparent bg-clip-padding text-sm font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/25 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:focus-visible:ring-destructive/25 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/80",

        // FIX: bg-background sits almost identical in lightness to a Card
        // (0.98 vs 1.0 in light mode) — the button used to visually vanish
        // into any card it sat on. bg-input carries a real, deliberate
        // lightness gap from both page and card surfaces.
        outline:
          "border-border bg-input/40 text-foreground hover:bg-input active:bg-input/70 aria-expanded:bg-input aria-expanded:text-foreground dark:bg-input/50 dark:hover:bg-input",

        secondary:
          "bg-secondary text-secondary-foreground hover:bg-[color-mix(in_oklch,var(--secondary),var(--foreground)_5%)] aria-expanded:bg-secondary aria-expanded:text-secondary-foreground",

        ghost:
          "hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:hover:bg-muted/50",

        destructive:
          "bg-destructive/10 text-destructive hover:bg-destructive/20 focus-visible:border-destructive/40 focus-visible:ring-destructive/20 dark:bg-destructive/20 dark:hover:bg-destructive/30 dark:focus-visible:ring-destructive/40",

    
        link: "text-muted-foreground underline-offset-4 hover:text-foreground hover:underline",
      },
      size: {
        sm: "h-8 gap-1.5 px-3 text-xs has-data-[icon=inline-end]:pe-2 has-data-[icon=inline-start]:ps-2 [&_svg:not([class*='size-'])]:size-3.5",
        default:
          "h-9 gap-1.5 px-4 has-data-[icon=inline-end]:pe-3 has-data-[icon=inline-start]:ps-3",
        lg: "h-10 gap-1.5 px-5",
        icon: "size-9",
        "icon-sm": "size-8 [&_svg:not([class*='size-'])]:size-3.5",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot.Root : "button";
  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };

// import * as React from "react";
// import { cva, type VariantProps } from "class-variance-authority";
// import { Slot } from "radix-ui";
// import { cn } from "@/lib/utils/utils";

// /*
//   Button — Design System Override
//   ─────────────────────────────────────────────
//   Variants:
//     default          → primary CTA — Emerald solid. واحد فقط per view
//     secondary        → secondary action — Slate bg مع border خفيف
//     outline          → border واضح بدون bg — للـ secondary في contexts مختلفة
//     ghost            → icon buttons, nav items — no bg أو border
//     destructive      → حذف نهائي (confirmation dialogs بس) — red solid
//     destructive-ghost → حذف سياقي/inline (زي صف جوّه فورم أو جدول) — red text فقط
//     link             → inline text action

//   Sizes:
//     sm      → h-8  (32px) — compact contexts, inline actions
//     default → h-9  (36px) — standard لكل الـ forms والـ CTAs
//     lg      → h-10 (40px) — نادراً ما يستخدم
//     icon    → size-9 — square icon button
//     icon-sm → size-8 — compact square icon button
//   ─────────────────────────────────────────────
// */

// const buttonVariants = cva(
//   [
//     // Layout
//     "inline-flex shrink-0 items-center justify-center gap-2",
//     // Shape
//     "rounded-md border border-transparent",
//     // Typography
//     "text-sm font-medium whitespace-nowrap",
//     // Interaction — color transitions + a subtle press-down for tactile
//     // feedback. This is a functional state cue (registers the click),
//     // not decoration — stays within the 150-200ms micro-interaction rule.
//     "transition-[color,background-color,border-color,box-shadow,transform] duration-150",
//     "outline-none select-none active:translate-y-px",
//     // Focus ring — Emerald، consistent مع --ring token
//     "focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/25",
//     // Disabled
//     "disabled:pointer-events-none disabled:opacity-50 disabled:active:translate-y-0",
//     // Invalid (داخل forms)
//     "aria-invalid:border-destructive aria-invalid:ring-2 aria-invalid:ring-destructive/20",
//     // SVG normalization
//     "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
//   ],
//   {
//     variants: {
//       variant: {
//         /*
//           default / primary:
//           الـ CTA الرئيسي. Emerald solid.
//           القاعدة: واحد فقط في الـ view.
//           FIX: shadow-xs خفيف جداً — عمق بصري بسيط يوحي إنه "قابل للدوس"،
//           محايد رمادي (مش لون) عشان مايخالفش قاعدة منع الـ glow effects.
//         */
//         default:
//           "bg-primary text-primary-foreground shadow-xs hover:bg-primary/90 hover:shadow-sm active:bg-primary/80",

//         /*
//           secondary:
//           Secondary actions، cancel، غير ذلك.
//           Slate bg خفيف مع border — يبرز بدون مزاحمة الـ primary.
//         */
//         secondary:
//           "bg-secondary text-secondary-foreground border-border/60 hover:bg-secondary/80 active:bg-secondary/60",

//         /*
//           outline:
//           نفس فكرة الـ secondary لكن بـ bg-background (transparent تقريباً).
//           يستخدم في الـ dialogs والـ modals حيث الـ background معقد.
//           مثال: زرار "إلغاء" في modal على خلفية card.
//         */
//         outline:
//           "border-border bg-input/40 text-foreground hover:bg-input active:bg-input/70 dark:bg-input/50 dark:hover:bg-input",

//         /*
//           ghost:
//           Icon buttons، nav items، actions خفية.
//           بدون border أو background — يظهران بالـ hover فقط.
//         */
//         ghost:
//           "text-foreground hover:bg-muted active:bg-muted/80 dark:hover:bg-muted/40",

//         /*
//           destructive:
//           للحذف النهائي — solid red.
//           استخدم فقط في confirmation dialogs أو actions مدمرة لا رجعة فيها.
//         */
//         destructive:
//           "bg-destructive text-white hover:bg-destructive/90 active:bg-destructive/80 focus-visible:ring-destructive/25",

//         /*
//           destructive-ghost:
//           حذف سياقي — صف جوّه فورم، icon delete في الـ tables، أي حذف
//           سهل الرجوع فيه (undo متاح أو مجرد إزالة من قائمة محلية).
//           Red text بدون bg — يظهر الـ bg الأحمر الخفيف بالـ hover فقط.
//         */
//         "destructive-ghost":
//           "text-destructive bg-destructive/5 hover:bg-destructive/10 active:bg-destructive/15 focus-visible:ring-destructive/20 dark:bg-destructive/10 dark:hover:bg-destructive/15",

//         /*
//           link:
//           Text-only inline actions — underline عند الـ hover.
//           مثال: "نسيت كلمة المرور؟" في الـ login form.
//           FIX: كانت "!hover:text-foreground" — صيغة Tailwind غلط
//           (الـ ! لازم يجي قبل الـ utility مش قبل الـ variant)، والـ
//           important أصلاً مش لازم هنا لعدم وجود تعارض حقيقي.
//         */
//         link: "w-fit border-none !p-0 !h-auto !text-xs text-muted-foreground underline-offset-4 hover:text-foreground hover:underline active:opacity-80",
//       },
//       size: {
//         sm: "h-8 px-3 text-xs [&_svg:not([class*='size-'])]:size-3.5",
//         default: "h-9 px-4",
//         lg: "h-10 px-5",
//         icon: "size-9 p-0",
//         "icon-sm": "size-8 p-0 [&_svg:not([class*='size-'])]:size-3.5",
//       },
//     },
//     defaultVariants: {
//       variant: "default",
//       size: "default",
//     },
//   },
// );

// export interface ButtonProps
//   extends React.ComponentProps<"button">, VariantProps<typeof buttonVariants> {
//   asChild?: boolean;
// }

// function Button({
//   className,
//   variant,
//   size,
//   asChild = false,
//   ...props
// }: ButtonProps) {
//   const Comp = asChild ? Slot.Root : "button";

//   return (
//     <Comp
//       data-slot="button"
//       className={cn(buttonVariants({ variant, size }), className)}
//       {...props}
//     />
//   );
// }

// export { Button, buttonVariants };

// // components/ui/button.tsx

// import * as React from "react";
// import { cva, type VariantProps } from "class-variance-authority";
// import { Slot } from "radix-ui";
// import { cn } from "@/lib/utils/utils";

// /*
//   Button — Design System Override
//   ─────────────────────────────────────────────
//   Variants:
//     default          → primary CTA — Emerald solid. واحد فقط per view
//     secondary        → secondary action — Slate bg مع border خفيف
//     outline          → border واضح بدون bg — للـ secondary في contexts مختلفة
//     ghost            → icon buttons, nav items — no bg أو border
//     destructive      → حذف — red solid
//     destructive-ghost → icon delete في tables — red text فقط
//     link             → inline text action

//   Sizes:
//     sm      → h-8  (32px) — compact contexts, inline actions
//     default → h-9  (36px) — standard لكل الـ forms والـ CTAs
//     lg      → h-10 (40px) — نادراً ما يستخدم
//     icon    → size-9 — square icon button
//     icon-sm → size-8 — compact square icon button
//   ─────────────────────────────────────────────
// */

// const buttonVariants = cva(
//   [
//     // Layout
//     "inline-flex shrink-0 items-center justify-center gap-2",
//     // Shape
//     "rounded-md border border-transparent",
//     // Typography
//     "text-sm font-medium whitespace-nowrap",
//     // Interaction
//     "transition-colors duration-150",
//     "outline-none select-none",
//     // Focus ring — Emerald، consistent مع --ring token
//     "focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/25",
//     // Disabled
//     "disabled:pointer-events-none disabled:opacity-50",
//     // Invalid (داخل forms)
//     "aria-invalid:border-destructive aria-invalid:ring-2 aria-invalid:ring-destructive/20",
//     // SVG normalization
//     "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
//   ],
//   {
//     variants: {
//       variant: {
//         /*
//           default / primary:
//           الـ CTA الرئيسي. Emerald solid.
//           القاعدة: واحد فقط في الـ view.
//         */
//         default:
//           "bg-primary text-primary-foreground hover:bg-primary/90 active:bg-primary/80",

//         /*
//           secondary:
//           Secondary actions، cancel، غير ذلك.
//           Slate bg خفيف مع border — يبرز بدون مزاحمة الـ primary.
//         */
//         secondary:
//           "bg-secondary text-secondary-foreground border-border/60 hover:bg-secondary/80 active:bg-secondary/60",

//         /*
//           outline:
//           نفس فكرة الـ secondary لكن بـ bg-background (transparent تقريباً).
//           يستخدم في الـ dialogs والـ modals حيث الـ background معقد.
//           مثال: زرار "إلغاء" في modal على خلفية card.
//         */
//         outline:
//           "border-border bg-background text-foreground hover:bg-muted active:bg-muted/80 dark:bg-transparent dark:hover:bg-muted/40",

//         /*
//           ghost:
//           Icon buttons، nav items، actions خفية.
//           بدون border أو background — يظهران بالـ hover فقط.
//         */
//         ghost:
//           "text-foreground hover:bg-muted active:bg-muted/80 dark:hover:bg-muted/40",

//         /*
//           destructive:
//           للحذف — solid red.
//           استخدم فقط في confirmation dialogs أو actions مدمرة.
//         */
//         destructive:
//           "bg-destructive text-white hover:bg-destructive/90 active:bg-destructive/80 focus-visible:ring-destructive/25",

//         /*
//           destructive-ghost:
//           Icon delete buttons في الـ tables أو inline actions.
//           Red text بدون bg — يظهر الـ bg الأحمر الخفيف بالـ hover فقط.
//         */
//         "destructive-ghost":
//           "text-destructive hover:bg-destructive/10 active:bg-destructive/15 focus-visible:ring-destructive/20",

//         /*
//           link:
//           Text-only inline actions — underline عند الـ hover.
//           مثال: "نسيت كلمة المرور؟" في الـ login form.
//         */
//         link: "underline-offset-4 hover:underline active:opacity-80 border-none !p-0 !h-auto !text-xs w-fit text-muted-foreground !hover:text-foreground",
//       },
//       //        className=""
//       size: {
//         sm: "h-8 px-3 text-xs [&_svg:not([class*='size-'])]:size-3.5",
//         default: "h-9 px-4",
//         lg: "h-10 px-5",
//         icon: "size-9 p-0",
//         "icon-sm": "size-8 p-0 [&_svg:not([class*='size-'])]:size-3.5",
//       },
//     },
//     defaultVariants: {
//       variant: "default",
//       size: "default",
//     },
//   },
// );

// export interface ButtonProps
//   extends React.ComponentProps<"button">, VariantProps<typeof buttonVariants> {
//   asChild?: boolean;
// }

// function Button({
//   className,
//   variant,
//   size,
//   asChild = false,
//   ...props
// }: ButtonProps) {
//   const Comp = asChild ? Slot.Root : "button";

//   return (
//     <Comp
//       data-slot="button"
//       className={cn(buttonVariants({ variant, size }), className)}
//       {...props}
//     />
//   );
// }

// export { Button, buttonVariants };

// import * as React from "react"
// import { cva, type VariantProps } from "class-variance-authority"
// import { Slot } from "radix-ui"

// import { cn } from "@/lib/utils/utils"

// const buttonVariants = cva(
//   "group/button inline-flex shrink-0 items-center justify-center rounded-lg border border-transparent bg-clip-padding text-sm font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
//   {
//     variants: {
//       variant: {
//         default: "bg-primary text-primary-foreground hover:bg-primary/80",
//         outline:
//           "border-border bg-background hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:border-input dark:bg-input/30 dark:hover:bg-input/50",
//         secondary:
//           "bg-secondary text-secondary-foreground hover:bg-[color-mix(in_oklch,var(--secondary),var(--foreground)_5%)] aria-expanded:bg-secondary aria-expanded:text-secondary-foreground",
//         ghost:
//           "hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:hover:bg-muted/50",
//         destructive:
//           "bg-destructive/10 text-destructive hover:bg-destructive/20 focus-visible:border-destructive/40 focus-visible:ring-destructive/20 dark:bg-destructive/20 dark:hover:bg-destructive/30 dark:focus-visible:ring-destructive/40",
//         link: "text-primary underline-offset-4 hover:underline",
//       },
//       size: {
//         default:
//           "h-8 gap-1.5 px-2.5 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2",
//         xs: "h-6 gap-1 rounded-[min(var(--radius-md),10px)] px-2 text-xs in-data-[slot=button-group]:rounded-lg has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3",
//         sm: "h-7 gap-1 rounded-[min(var(--radius-md),12px)] px-2.5 text-[0.8rem] in-data-[slot=button-group]:rounded-lg has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3.5",
//         lg: "h-9 gap-1.5 px-2.5 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2",
//         icon: "size-8",
//         "icon-xs":
//           "size-6 rounded-[min(var(--radius-md),10px)] in-data-[slot=button-group]:rounded-lg [&_svg:not([class*='size-'])]:size-3",
//         "icon-sm":
//           "size-7 rounded-[min(var(--radius-md),12px)] in-data-[slot=button-group]:rounded-lg",
//         "icon-lg": "size-9",
//       },
//     },
//     defaultVariants: {
//       variant: "default",
//       size: "default",
//     },
//   }
// )

// function Button({
//   className,
//   variant = "default",
//   size = "default",
//   asChild = false,
//   ...props
// }: React.ComponentProps<"button"> &
//   VariantProps<typeof buttonVariants> & {
//     asChild?: boolean
//   }) {
//   const Comp = asChild ? Slot.Root : "button"

//   return (
//     <Comp
//       data-slot="button"
//       data-variant={variant}
//       data-size={size}
//       className={cn(buttonVariants({ variant, size, className }))}
//       {...props}
//     />
//   )
// }

// export { Button, buttonVariants }
