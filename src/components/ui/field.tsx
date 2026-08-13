"use client";

import { useMemo } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils/utils";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

/**
 * Field System — Design System Override
 * Default usage:
 *   <Field>
 *     <FieldLabel htmlFor="email">...</FieldLabel>
 *     <Input id="email" aria-invalid={hasError} />
 *     <FieldError errors={[fieldState.error]} />
 *   </Field>
 */

// Shared base classes for label-like text — used by FieldLabel and FieldTitle
const FIELD_LABEL_BASE =
  "flex w-fit items-center gap-1.5 text-sm font-medium leading-snug group-data-[disabled=true]/field:opacity-50";

// Container for a group of related fields (fieldset semantics)
function FieldSet({ className, ...props }: React.ComponentProps<"fieldset">) {
  return (
    <fieldset
      data-slot="field-set"
      className={cn("flex flex-col gap-4", className)}
      {...props}
    />
  );
}

function FieldLegend({
  className,
  variant = "legend",
  ...props
}: React.ComponentProps<"legend"> & { variant?: "legend" | "label" }) {
  return (
    <legend
      data-slot="field-legend"
      data-variant={variant}
      className={cn(
        "mb-1 font-medium",
        variant === "label" && "text-sm",
        variant === "legend" && "text-base",
        className
      )}
      {...props}
    />
  );
}

// Groups fields in a row or column — gap-5 to keep blocks visually separated
function FieldGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="field-group"
      className={cn(
        "@container/field-group flex w-full flex-col gap-5",
        className
      )}
      {...props}
    />
  );
}

/**
 * orientation:
 *   vertical   → label above input (default, most common)
 *   horizontal → label beside input (settings-style forms)
 *   responsive → vertical on mobile, horizontal on desktop
 */
const fieldVariants = cva(
  "group/field flex w-full gap-2 data-[invalid=true]:text-destructive",
  {
    variants: {
      orientation: {
        vertical: "flex-col",
        horizontal:
          "flex-row items-center *:data-[slot=field-label]:flex-auto",
        responsive:
          "flex-col @md/field-group:flex-row @md/field-group:items-center @md/field-group:*:data-[slot=field-label]:flex-auto",
      },
    },
    defaultVariants: {
      orientation: "vertical",
    },
  }
);

function Field({
  className,
  orientation = "vertical",
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof fieldVariants>) {
  return (
    <div
      role="group"
      data-slot="field"
      data-orientation={orientation}
      className={cn(fieldVariants({ orientation }), className)}
      {...props}
    />
  );
}

// Used in horizontal orientation — wraps description + input below the label
function FieldContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="field-content"
      className={cn("flex flex-1 flex-col gap-1 leading-snug", className)}
      {...props}
    />
  );
}

function FieldLabel({
  className,
  ...props
}: React.ComponentProps<typeof Label>) {
  return (
    <Label
      data-slot="field-label"
      className={cn(
        FIELD_LABEL_BASE,
        // Error color comes from the Field parent via data-invalid
        "group-data-[invalid=true]/field:text-destructive",
        className
      )}
      {...props}
    />
  );
}

// Same as FieldLabel but without htmlFor — for non-input fields (e.g. section titles)
function FieldTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="field-title"
      className={cn(FIELD_LABEL_BASE, className)}
      {...props}
    />
  );
}

// Helper text below the input — stays visible even during error state
function FieldDescription({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="field-description"
      className={cn(
        "text-xs leading-normal text-muted-foreground",
        "[&>a]:underline [&>a]:underline-offset-4 [&>a:hover]:text-primary",
        className
      )}
      {...props}
    />
  );
}

// Divider between fields, with optional label (e.g. "أو" in the login form)
function FieldSeparator({
  children,
  className,
  ...props
}: React.ComponentProps<"div"> & { children?: React.ReactNode }) {
  return (
    <div
      data-slot="field-separator"
      className={cn("relative -my-1 h-5 text-xs", className)}
      {...props}
    >
      <Separator className="absolute inset-0 top-1/2" />
      {children && (
        <span className="relative mx-auto block w-fit bg-background px-2 text-muted-foreground">
          {children}
        </span>
      )}
    </div>
  );
}

// Error message below the input. Renders nothing if there's no error content.
function FieldError({
  className,
  children,
  errors,
  ...props
}: React.ComponentProps<"div"> & {
  errors?: Array<{ message?: string } | undefined>;
}) {
  const content = useMemo(() => {
    if (children) return children;
    if (!errors?.length) return null;

    const unique = [
      ...new Map(errors.map((e) => [e?.message, e])).values(),
    ].filter(Boolean);

    if (unique.length === 0) return null;
    if (unique.length === 1) return unique[0]?.message;

    return (
      <ul className="flex list-disc flex-col gap-0.5 ps-4">
        {unique.map(
          (error, i) =>
            error?.message && <li key={i}>{error.message}</li>
        )}
      </ul>
    );
  }, [children, errors]);

  if (!content) return null;

  return (
    <div
      role="alert"
      data-slot="field-error"
      className={cn(
        "flex items-start gap-1 text-xs text-destructive",
        className
      )}
      {...props}
    >
      {content}
    </div>
  );
}

export {
  Field,
  FieldLabel,
  FieldTitle,
  FieldDescription,
  FieldError,
  FieldContent,
  FieldGroup,
  FieldLegend,
  FieldSeparator,
  FieldSet,
};