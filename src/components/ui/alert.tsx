// components/ui/alert.tsx

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils/utils";

/*
  Alert — Design System Override
  ─────────────────────────────────────────────
  قرار الاتساقية: نعدل على shadcn alert الأصلي بدل الـ custom auth alert
  السبب: component واحد في كل المشروع — أسهل maintenance

  Variants المضافة (مش في shadcn الأصلي):
    success → for email verification، account creation، etc.
    warning → for incomplete profile، pending action، etc.
    info    → for tips، guidance، informational messages

  الـ variant الأصلي:
    default     → neutral informational (slate)
    destructive → error messages (red)

  الاستخدام في الـ auth:
    <Alert variant="destructive">
      <AlertDescription>البريد الإلكتروني أو كلمة المرور غير صحيحة</AlertDescription>
    </Alert>

    <Alert variant="info">
      <AlertDescription>تم إرسال رمز التحقق إلى بريدك الإلكتروني</AlertDescription>
    </Alert>

  بنية الـ component:
    <Alert variant="...">
      <AlertIcon />         ← اختياري — icon يتناسب مع الـ variant
      <AlertTitle />        ← اختياري — عنوان الـ alert
      <AlertDescription />  ← الرسالة الأساسية
    </Alert>
  ─────────────────────────────────────────────
*/

const alertVariants = cva(
  [
    // Layout
    "relative flex w-full gap-3 rounded-md border p-3",
    // Typography base
    "text-sm",
    // RTL icon alignment
    "[&>svg]:mt-0.5 [&>svg]:shrink-0",
    "[&>svg:not([class*='size-'])]:size-4",
  ],
  {
    variants: {
      variant: {
        /*
          default:
          Neutral informational — slate colors.
          للـ tips أو general information.
        */
        default:
          "border-border bg-muted/40 text-foreground [&>svg]:text-muted-foreground",

        /*
          destructive:
          Error messages — login failed, validation errors, server errors.
          Red tint خفيف بدون solid background.
        */
        destructive:
          "border-destructive/30 bg-destructive/5 text-destructive [&>svg]:text-destructive dark:border-destructive/40 dark:bg-destructive/10",

        /*
          success:
          Confirmation messages — email sent, account created, password reset.
          Emerald — consistent مع الـ primary brand color.
        */
        success:
          "border-success/30 bg-success/5 text-success [&>svg]:text-success dark:border-success/40 dark:bg-success/10",

        /*
          warning:
          Caution messages — email not verified, incomplete profile.
          Amber.
        */
        warning:
          "border-warning/30 bg-warning/5 text-warning [&>svg]:text-warning dark:border-warning/40 dark:bg-warning/10",

        /*
          info:
          Informational — instructions، tips، what happens next.
          Blue — مختلف عن الـ primary لتمييز المعلومة عن الـ action.
        */
        info:
          "border-info/30 bg-info/5 text-info [&>svg]:text-info dark:border-info/40 dark:bg-info/10",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

function Alert({
  className,
  variant,
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof alertVariants>) {
  return (
    <div
      data-slot="alert"
      role="alert"
      className={cn(alertVariants({ variant }), className)}
      {...props}
    />
  );
}

function AlertTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-title"
      className={cn("text-sm font-medium leading-snug", className)}
      {...props}
    />
  );
}

function AlertDescription({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-description"
      className={cn(
        "text-sm leading-normal opacity-90",
        "[&_a]:underline [&_a]:underline-offset-4 [&_a:hover]:opacity-100",
        "[&_p:not(:last-child)]:mb-2",
        className
      )}
      {...props}
    />
  );
}

/*
  AlertIcon — helper wrapper للـ icon داخل الـ alert
  الـ icon اللون بيجي تلقائياً من الـ variant عبر [&>svg]:text-{color}
  الاستخدام:
    import { CheckCircle } from "lucide-react"
    <Alert variant="success">
      <CheckCircle />
      <AlertDescription>تم بنجاح</AlertDescription>
    </Alert>
*/

export { Alert, AlertTitle, AlertDescription };