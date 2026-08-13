"use client";

import * as React from "react";
import { RadioGroup as RadioGroupPrimitive } from "radix-ui";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils/utils";

const radioGroupVariants = cva("flex w-full", {
  variants: {
    orientation: {
      vertical: "flex-col gap-3",
      horizontal: "flex-row gap-6 ", // flex-wrap w-fit
    },
  },
  defaultVariants: {
    orientation: "vertical",
  },
});

function RadioGroup({
  className,
  orientation,
  dir = "rtl",
  ...props
}: React.ComponentProps<typeof RadioGroupPrimitive.Root> &
  VariantProps<typeof radioGroupVariants>) {
  return (
    <RadioGroupPrimitive.Root
      data-slot="radio-group"
      dir={dir}
      className={cn(radioGroupVariants({ orientation }), className)}
      {...props}
    />
  );
}

function RadioGroupItem({
  className,
  ...props
}: React.ComponentProps<typeof RadioGroupPrimitive.Item>) {
  return (
    <RadioGroupPrimitive.Item
      data-slot="radio-group-item"
      className={cn(
        "group/radio-group-item peer relative flex aspect-square size-4 shrink-0 cursor-pointer",
        "rounded-full border border-input",
        "dark:data-[state=unchecked]:bg-input/20",
        "outline-none",
        "after:absolute after:-inset-x-3 after:-inset-y-2",
        "transition-colors duration-150",
        "focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/25",
        "disabled:cursor-not-allowed disabled:opacity-60",
        "aria-invalid:border-destructive",
        "aria-invalid:focus-visible:ring-destructive/25",
        "data-[state=checked]:border-primary data-[state=checked]:bg-primary",
        className,
      )}
      {...props}
    >
      <RadioGroupPrimitive.Indicator
        data-slot="radio-group-indicator"
        className="flex size-4 items-center justify-center"
      >
        <span className="absolute top-1/2 left-1/2 size-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary-foreground" />
      </RadioGroupPrimitive.Indicator>
    </RadioGroupPrimitive.Item>
  );
}

export { RadioGroup, RadioGroupItem };
