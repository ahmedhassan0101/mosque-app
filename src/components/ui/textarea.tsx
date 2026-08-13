import * as React from "react";
import { cn } from "@/lib/utils/utils";

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "flex field-sizing-content min-h-16 w-full",
        "rounded-md border border-input",
        "bg-background dark:bg-input/20",
        "px-3 py-2",
        "text-sm text-foreground",
        "placeholder:text-muted-foreground",
        "transition-colors duration-150",
        "outline-none",
        "focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/25",
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

export { Textarea };