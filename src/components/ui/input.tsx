// components/ui/input.tsx

import * as React from "react";
import { cn } from "@/lib/utils/utils";



function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      suppressHydrationWarning
      className={cn(
        "flex h-9 w-full min-w-0",
        "rounded-md border border-input",
        "bg-background dark:bg-input/20",
        "px-3 py-1.5",
        "text-sm text-foreground",
        "placeholder:text-muted-foreground",
        "transition-colors duration-150",
        "outline-none",
        "focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/25",
        "file:inline-flex file:h-6 file:border-0 file:bg-transparent",
        "file:text-xs file:font-medium file:text-foreground",
        "disabled:pointer-events-none disabled:cursor-not-allowed",
        "disabled:bg-muted/50 disabled:opacity-60",
        "aria-invalid:border-destructive",
        "aria-invalid:focus-visible:ring-destructive/25",
        "dark:disabled:bg-input/40",
        className,
      )}
      {...props}
    />
  );
}

export { Input };
