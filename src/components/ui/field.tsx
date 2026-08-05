// components/ui/field.tsx
"use client";

import { useMemo } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils/utils";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

/*
  Field System — Design System Override
  ─────────────────────────────────────────────
  التغييرات عن النسخة الأصلية:

  1. FieldLabel — حُذف منه الـ has-data-checked complexity
     المشروع مش بيستخدم checkbox-inside-label pattern في الـ auth
     الـ label بسيط: text فوق الـ input مباشرة

  2. FieldError — text-xs بدل text-sm (12px أوضح وأخف)
     + mt-1 بدل div مستقل — أقرب للـ input

  3. FieldDescription — حُذف منها text-right
     الـ dir="rtl" على html يكفي

  4. FieldSeparator — محتفظ بيه لأنه يُستخدم في auth ("أو")

  5. FieldSet / FieldGroup / FieldLegend — محتفظ بيهم
     لأنهم بيُستخدموا في الـ onboarding forms المعقدة

  الاستخدام الأساسي:
    <Field>
      <FieldLabel htmlFor="email">البريد الإلكتروني</FieldLabel>
      <Input id="email" ... aria-invalid={hasError} />
      <FieldError errors={[fieldState.error]} />
    </Field>
  ─────────────────────────────────────────────
*/

/* ── FieldSet ─────────────────────────────────────────────────
   Container لمجموعة fields مترابطة (fieldset semantics)
   مثال: قسم "بيانات المسجد" في الـ onboarding
*/
function FieldSet({ className, ...props }: React.ComponentProps<"fieldset">) {
  return (
    <fieldset
      data-slot="field-set"
      className={cn("flex flex-col gap-4", className)}
      {...props}
    />
  );
}

/* ── FieldLegend ──────────────────────────────────────────────
   عنوان الـ fieldset — legend أو label style
*/
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

/* ── FieldGroup ───────────────────────────────────────────────
   Container لمجموعة fields في صف أو عمود
   gap-5 بين الـ fields — أكبر من gap-4 عشان يكون واضح فصل البلوكس
*/
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

/* ── Field ────────────────────────────────────────────────────
   الـ wrapper الأساسي لكل field (label + input + error)
   orientation:
     vertical   → label فوق، input تحت (الأكثر استخداماً)
     horizontal → label جنب الـ input (للـ settings forms)
     responsive → vertical على mobile، horizontal على desktop
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

/* ── FieldContent ─────────────────────────────────────────────
   يُستخدم في الـ horizontal orientation
   يلف الـ description + input أسفل الـ label
*/
function FieldContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="field-content"
      className={cn("flex flex-1 flex-col gap-1 leading-snug", className)}
      {...props}
    />
  );
}

/* ── FieldLabel ───────────────────────────────────────────────
   Label فوق الـ input — بسيط ونظيف
   الـ disabled state يأتي من الـ Field parent عبر group-data
*/
function FieldLabel({
  className,
  ...props
}: React.ComponentProps<typeof Label>) {
  return (
    <Label
      data-slot="field-label"
      className={cn(
        "flex w-fit items-center gap-1.5 text-sm font-medium leading-snug",
        "group-data-[disabled=true]/field:opacity-50",
        // error state — اللون الأحمر يجي من Field parent (data-invalid)
        "group-data-[invalid=true]/field:text-destructive",
        className
      )}
      {...props}
    />
  );
}

/* ── FieldTitle ───────────────────────────────────────────────
   نفس FieldLabel لكن بدون htmlFor — للـ non-input fields
   مثال: عنوان section داخل fieldset
*/
function FieldTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="field-title"
      className={cn(
        "flex w-fit items-center gap-2 text-sm font-medium leading-snug",
        "group-data-[disabled=true]/field:opacity-50",
        className
      )}
      {...props}
    />
  );
}

/* ── FieldDescription ─────────────────────────────────────────
   Helper text تحت الـ input — hint أو توضيح
   يظهر دايماً حتى لو في error state (فرق عن الـ FieldError)
*/
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

/* ── FieldSeparator ───────────────────────────────────────────
   فاصل بين fields — مع أو بدون label
   مثال: <FieldSeparator>أو</FieldSeparator> في الـ login form
*/
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

/* ── FieldError ───────────────────────────────────────────────
   رسالة الـ error تحت الـ input مباشرة
   - errors array: يعرض أول error فقط لو واحدة، list لو أكتر
   - children: override للـ error text مباشرة
   - لا يظهر لو مفيش content (لا حاجة لـ empty div)
*/
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

    // إزالة duplicates بناءً على الـ message
    const unique = [
      ...new Map(errors.map((e) => [e?.message, e])).values(),
    ].filter(Boolean);

    if (unique.length === 0) return null;

    // error واحدة → text مباشر
    if (unique.length === 1) return unique[0]?.message;

    // أكتر من error → unordered list
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