"use client";

import * as React from "react";
import { Select as SelectPrimitive } from "radix-ui";
import { ChevronDown, ChevronUp, Check } from "lucide-react";
import { cn } from "@/lib/utils/utils";

function Select(props: React.ComponentProps<typeof SelectPrimitive.Root>) {
  return <SelectPrimitive.Root data-slot="select" {...props} />;
}

function SelectGroup({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Group>) {
  return (
    <SelectPrimitive.Group
      data-slot="select-group"
      className={cn("p-1", className)}
      {...props}
    />
  );
}

function SelectValue(
  props: React.ComponentProps<typeof SelectPrimitive.Value>,
) {
  return <SelectPrimitive.Value data-slot="select-value" {...props} />;
}

function SelectTrigger({
  className,
  size = "default",
  children,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Trigger> & {
  size?: "sm" | "default";
}) {
  return (
    <SelectPrimitive.Trigger
      data-slot="select-trigger"
      data-size={size}
      className={cn(
        // Base — mirrors Input exactly so the two read as siblings
        "flex w-fit items-center justify-between gap-2",
        "rounded-md border border-input bg-background dark:bg-input/20",
        "text-sm text-foreground whitespace-nowrap",
        "transition-colors duration-150 outline-none select-none",
        // Sizes — aligned with Button & Input
        "data-[size=default]:h-9 data-[size=default]:px-3",
        "data-[size=sm]:h-8 data-[size=sm]:px-2.5 data-[size=sm]:text-xs data-[size=sm]:rounded-md",
        // Placeholder text color — [data-placeholder] is a real Radix attribute
        "data-placeholder:text-muted-foreground",
        // Focus — matches Input
        "focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/25",
        // States
        "disabled:cursor-not-allowed disabled:bg-muted/50 disabled:opacity-60",
        "aria-invalid:border-destructive",
        "aria-invalid:focus-visible:ring-destructive/25",
        // SelectValue inner slot
        "[&>*[data-slot=select-value]]:flex [&>*[data-slot=select-value]]:items-center [&>*[data-slot=select-value]]:gap-1.5",
        "[&>*[data-slot=select-value]]:line-clamp-1",
        // SVG icons
        "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className,
      )}
      {...props}
    >
      {children}
      <SelectPrimitive.Icon asChild>
        <ChevronDown className="size-3.5 shrink-0 text-muted-foreground/70" />
      </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
  );
}

function SelectContent({
  className,
  children,
  position = "item-aligned",
  align = "center",
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Content>) {
  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Content
        data-slot="select-content"
        position={position}
        align={align}
        className={cn(
          // Base
          "relative z-50 overflow-hidden",
          "rounded-lg border border-border bg-popover text-popover-foreground",
          "shadow-lg",
          // Sizing constraints
          "min-w-32 max-h-(--radix-select-content-available-height)",
          "origin-(--radix-select-content-transform-origin)",
          // Animations
          // FIX: Radix sets data-state="open"/"closed" on Content, not a
          // bare data-open/data-closed attribute — the shorthand below
          // never matched, so the panel appeared/disappeared with no
          // transition at all.
          "data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95",
          "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95",
          "data-[side=bottom]:slide-in-from-top-1",
          "data-[side=top]:slide-in-from-bottom-1",
          "data-[side=left]:slide-in-from-right-1",
          "data-[side=right]:slide-in-from-left-1",
          className,
        )}
        {...props}
      >
        <SelectScrollUpButton />
        <SelectPrimitive.Viewport
          className={cn(
            "p-1",
            position === "popper" &&
              "h-(--radix-select-trigger-height) w-full min-w-(--radix-select-trigger-width)",
          )}
        >
          {children}
        </SelectPrimitive.Viewport>
        <SelectScrollDownButton />
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
  );
}

function SelectLabel({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Label>) {
  return (
    <SelectPrimitive.Label
      data-slot="select-label"
      className={cn(
        "px-2 py-1 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground",
        className,
      )}
      {...props}
    />
  );
}

function SelectItem({
  className,
  children,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Item>) {
  return (
    <SelectPrimitive.Item
      data-slot="select-item"
      className={cn(
        "relative flex w-full cursor-default select-none items-center",
        "rounded-md py-1.5 pe-8 ps-2 text-sm outline-none",
        "focus:bg-accent focus:text-accent-foreground",
        "data-disabled:pointer-events-none data-disabled:opacity-50",
        "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className,
      )}
      {...props}
    >
      {/*
       * Check icon sits at inset-end (pe-8 above reserves the space) —
       * that's the LEFT side in RTL, not the right.
       */}
      <span className="absolute inset-e-2 flex size-4 items-center justify-center">
        <SelectPrimitive.ItemIndicator>
          <Check className="size-3.5 text-primary" />
        </SelectPrimitive.ItemIndicator>
      </span>
      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
    </SelectPrimitive.Item>
  );
}

function SelectSeparator({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Separator>) {
  return (
    <SelectPrimitive.Separator
      data-slot="select-separator"
      className={cn("-mx-1 my-1 h-px bg-border", className)}
      {...props}
    />
  );
}

function SelectScrollUpButton({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.ScrollUpButton>) {
  return (
    <SelectPrimitive.ScrollUpButton
      data-slot="select-scroll-up-button"
      className={cn(
        "flex cursor-default items-center justify-center py-1 text-muted-foreground",
        className,
      )}
      {...props}
    >
      <ChevronUp className="size-3.5" />
    </SelectPrimitive.ScrollUpButton>
  );
}

function SelectScrollDownButton({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.ScrollDownButton>) {
  return (
    <SelectPrimitive.ScrollDownButton
      data-slot="select-scroll-down-button"
      className={cn(
        "flex cursor-default items-center justify-center py-1 text-muted-foreground",
        className,
      )}
      {...props}
    >
      <ChevronDown className="size-3.5" />
    </SelectPrimitive.ScrollDownButton>
  );
}

export {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectLabel,
  SelectItem,
  SelectSeparator,
  SelectScrollUpButton,
  SelectScrollDownButton,
};
