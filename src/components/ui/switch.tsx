"use client";

import * as React from "react";
import { Switch as SwitchPrimitive } from "radix-ui";
import { cn } from "@/lib/utils/utils";

/**
 * Switch — Design System Override
 * FIX: every "data-checked:" / "data-unchecked:" selector in the original
 * was wrong — Radix sets data-state="checked"/"unchecked", not those bare
 * attributes. None of them ever matched, so the track never changed color
 * AND the thumb never translated across — the switch would have looked
 * stuck regardless of its actual state. Same root cause found in
 * RadioGroup/Checkbox, just repeated across more properties here (track
 * color, thumb color, thumb position all depended on it).
 */
function Switch({
  className,
  size = "default",
  ...props
}: React.ComponentProps<typeof SwitchPrimitive.Root> & {
  size?: "sm" | "default";
}) {
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      data-size={size}
      className={cn(
        "peer group/switch relative inline-flex shrink-0 cursor-pointer items-center",
        "rounded-full border border-transparent",
        "outline-none transition-colors duration-150",
        "after:absolute after:-inset-x-3 after:-inset-y-2",
        "focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/25",
        "aria-invalid:border-destructive",
        "aria-invalid:focus-visible:ring-destructive/25",
        "data-[size=default]:h-[18.4px] data-[size=default]:w-8",
        "data-[size=sm]:h-3.5 data-[size=sm]:w-6",
        "data-[state=checked]:bg-primary",
        "data-[state=unchecked]:bg-input dark:data-[state=unchecked]:bg-input/80",
        "data-disabled:cursor-not-allowed data-disabled:opacity-60",
        className,
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className={cn(
          "pointer-events-none block rounded-full bg-background",
          "transition-transform duration-150",
          "group-data-[size=default]/switch:size-4",
          "group-data-[size=sm]/switch:size-3",
          "group-data-[size=default]/switch:data-[state=checked]:translate-x-[calc(100%-2px)]",
          "group-data-[size=sm]/switch:data-[state=checked]:translate-x-[calc(100%-2px)]",
          "group-data-[size=default]/switch:data-[state=unchecked]:translate-x-0",
          "group-data-[size=sm]/switch:data-[state=unchecked]:translate-x-0",
          "dark:data-[state=checked]:bg-primary-foreground",
          "dark:data-[state=unchecked]:bg-foreground",
        )}
      />
    </SwitchPrimitive.Root>
  );
}

export { Switch };
