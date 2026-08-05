// components/ui/input.tsx

import * as React from "react";
import { cn } from "@/lib/utils/utils";

/*
  Input — Design System Override
  ─────────────────────────────────────────────
  التغييرات عن shadcn الأصلي:

  1. h-9 (36px) بدل h-8 — consistent مع design spec وـ button heights
  2. rounded-md (8px) بدل rounded-lg — الـ inputs والـ badges بيستخدموا radius-sm/md
  3. text-sm (13px) بدل text-base — consistent مع الـ type scale
  4. bg-background بدل bg-transparent — واضح على الـ muted backgrounds
  5. px-3 بدل px-2.5 — أرحب قليلاً للـ Arabic text
  6. ring-2 بدل ring-3 — أخف بصرياً

  RTL:
  - padding-inline يتعامل مع الـ direction تلقائياً
  - لا hardcoded pl-* أو pr-* هنا
  - الـ icon padding بيُحدد في الـ FormInput wrapper (ps-* وـ pe-*)
  ─────────────────────────────────────────────
*/

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      suppressHydrationWarning
      className={cn(
        // Layout
        "flex h-9 w-full min-w-0",
        // Shape
        "rounded-md border border-input",
        // Background
        "bg-background dark:bg-input/20",
        // Spacing & Typography
        "px-3 py-1.5",
        "text-sm text-foreground",
        "placeholder:text-muted-foreground",
        // Transitions
        "transition-colors duration-150",
        // Focus
        "outline-none",
        "focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/25",
        // File input reset
        "file:inline-flex file:h-6 file:border-0 file:bg-transparent",
        "file:text-xs file:font-medium file:text-foreground",
        // Disabled
        "disabled:pointer-events-none disabled:cursor-not-allowed",
        "disabled:bg-muted/50 disabled:opacity-60",
        // Invalid / error state
        "aria-invalid:border-destructive",
        "aria-invalid:focus-visible:ring-destructive/25",
        // Dark mode
        "dark:disabled:bg-input/40",
        className,
      )}
      {...props}
    />
  );
}

export { Input };
// import * as React from "react"

// import { cn } from "@/lib/utils/utils"

// function Input({ className, type, ...props }: React.ComponentProps<"input">) {
//   return (
//     <input
//       type={type}
//       data-slot="input"
//       className={cn(
//         "h-8 w-full min-w-0 rounded-lg border border-input bg-transparent px-2.5 py-1 text-base transition-colors outline-none file:inline-flex file:h-6 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 md:text-sm dark:bg-input/30 dark:disabled:bg-input/80 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40",
//         className
//       )}
//       {...props}
//     />
//   )
// }

// export { Input }
