"use client";

import * as React from "react";
import { Checkbox as CheckboxPrimitive } from "radix-ui";
import { CheckIcon } from "lucide-react";
import { cn } from "@/lib/utils/utils";

/**
 * Checkbox — Design System Override
 * FIX: Radix sets data-state="checked", not data-checked — the old
 * "data-checked:" selectors never matched, so the box never filled with
 * the primary color when checked (same root cause as the RadioGroup bug).
 * FIX: cursor-pointer was missing on the box itself — only the label
 * (in the form wrappers) had it.
 */
function Checkbox({
  className,
  ...props
}: React.ComponentProps<typeof CheckboxPrimitive.Root>) {
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      className={cn(
        "peer relative flex size-4 shrink-0 cursor-pointer items-center justify-center",
        "rounded-sm border border-input",
        "dark:data-[state=unchecked]:bg-input/20",
        "outline-none",
        "after:absolute after:-inset-x-3 after:-inset-y-2",
        "transition-colors duration-150",
        "focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/25",
        "disabled:cursor-not-allowed disabled:opacity-60",
        // Dims when a parent Field is marked disabled — same hook FieldLabel uses
        "group-data-[disabled=true]/field:opacity-50",
        "aria-invalid:border-destructive",
        "aria-invalid:focus-visible:ring-destructive/25",
        "data-[state=checked]:border-primary data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground",
        className,
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        data-slot="checkbox-indicator"
        className="grid place-content-center text-current transition-none [&>svg]:size-3.5"
      >
        <CheckIcon strokeWidth={2}/>
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
}

export { Checkbox };
