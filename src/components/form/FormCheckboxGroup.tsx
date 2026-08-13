"use client";

import {
  Controller,
  type Control,
  type FieldValues,
  type Path,
} from "react-hook-form";
import {
  FieldDescription,
  FieldLabel,
  FieldLegend,
  FieldSet,
  FieldError,
} from "@/components/ui/field";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils/utils";

interface CheckboxOption {
  label: string;
  value: string;
}

// Kept as a static lookup (not a template string) so Tailwind's class
// scanner can actually see "grid-cols-2" / "grid-cols-3" as literal names.
const GRID_COLS: Record<2 | 3, string> = {
  2: "grid-cols-2",
  3: "grid-cols-3",
};

interface FormCheckboxGroupProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label: string;
  options: CheckboxOption[];
  description?: string;
  required?: boolean;
  disabled?: boolean;
  /** "vertical" stacks options in one column (default). "grid" wraps into columns. */
  layout?: "vertical" | "grid";
  /** Only applies when layout="grid" */
  columns?: 2 | 3;
  /** "list": plain checkbox + label row (default). "card": bordered clickable box with an active state. */
  variant?: "list" | "card";
}

export function FormCheckboxGroup<T extends FieldValues>({
  control,
  name,
  label,
  options,
  description,
  required,
  disabled,
  layout = "vertical",
  columns = 2,
  variant = "list",
}: FormCheckboxGroupProps<T>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => {
        const currentValues: string[] = Array.isArray(field.value)
          ? field.value
          : [];

        const toggle = (value: string, checked: boolean) => {
          field.onChange(
            checked
              ? [...currentValues, value]
              : currentValues.filter((v) => v !== value),
          );
        };

        return (
          <FieldSet
            data-invalid={fieldState.invalid || undefined}
            data-disabled={disabled || undefined}
          >
            {label && (
              <FieldLegend variant="label">
                {label}
                {required && (
                  <span className="text-destructive" aria-hidden="true">
                    *
                  </span>
                )}
              </FieldLegend>
            )}
            {description && <FieldDescription>{description}</FieldDescription>}

            {/*
              Deliberately not reusing the shared FieldGroup here — it ships
              with a hardcoded gap-5 that fights any gap override passed via
              className (same class of conflict fixed in RadioGroup). Owning
              this container directly avoids that entirely.
            */}
            <div
              className={cn(
                "grid gap-3",
                layout === "grid" ? GRID_COLS[columns] : "grid-cols-1",
              )}
            >
              {options.map((opt, index) => {
                const id = `${name}-${index}`;
                const isChecked = currentValues.includes(opt.value);

                if (variant === "card") {
                  return (
                    <label
                      key={opt.value}
                      htmlFor={id}
                      className={cn(
                        "flex cursor-pointer items-center gap-2 rounded-md border p-2.5 text-sm transition-colors select-none",
                        isChecked
                          ? "border-primary bg-primary/5"
                          : "border-border hover:bg-muted/50",
                      )}
                    >
                      <Checkbox
                        id={id}
                        checked={isChecked}
                        onCheckedChange={(checked) =>
                          toggle(opt.value, checked === true)
                        }
                        disabled={disabled}
                        aria-invalid={fieldState.invalid || undefined}
                      />
                      <span className="font-normal">{opt.label}</span>
                    </label>
                  );
                }

                return (
                  <div key={opt.value} className="flex items-center gap-2">
                    <Checkbox
                      id={id}
                      checked={isChecked}
                      onCheckedChange={(checked) =>
                        toggle(opt.value, checked === true)
                      }
                      disabled={disabled}
                      aria-invalid={fieldState.invalid || undefined}
                    />
                    <FieldLabel
                      htmlFor={id}
                      className="cursor-pointer font-normal"
                    >
                      {opt.label}
                    </FieldLabel>
                  </div>
                );
              })}
            </div>

            <FieldError errors={[fieldState.error]} />
          </FieldSet>
        );
      }}
    />
  );
}
// "use client";

// import { Controller, Control, FieldValues, Path } from "react-hook-form";
// import { Checkbox } from "@/components/ui/checkbox";
// import {
//   Field,
//   FieldDescription,
//   FieldGroup,
//   FieldLabel,
//   FieldLegend,
//   FieldSet,
//   FieldError,
// } from "@/components/ui/field";

// interface CheckboxOption {
//   label: string;
//   value: string;
// }

// interface FormCheckboxGroupProps<T extends FieldValues> {
//   control: Control<T>;
//   name: Path<T>;
//   label: string;
//   description?: string;
//   options: CheckboxOption[];
//   required?: boolean;
// }

// export function FormCheckboxGroup<T extends FieldValues>({
//   control,
//   name,
//   label,
//   description,
//   options,
//   required,
// }: FormCheckboxGroupProps<T>) {
//   return (
//     <Controller
//       name={name}
//       control={control}
//       render={({ field, fieldState }) => (
//         <FieldSet data-invalid={fieldState.invalid}>
//           <FieldLegend variant="label">
//             {label} {required && <span className="text-destructive">*</span>}
//           </FieldLegend>
//           {description && <FieldDescription>{description}</FieldDescription>}

//           <FieldGroup className="gap-3 mt-2">
//             {options.map((opt, index) => {
//               const id = `${name}-${index}`;
//               // التأكد إن القيمة عبارة عن مصفوفة
//               const currentValues = Array.isArray(field.value)
//                 ? field.value
//                 : [];
//               const isChecked = (currentValues as string[]).includes(opt.value);

//               return (
//                 <Field
//                   orientation="horizontal"
//                   className="space-x-2 space-x-reverse "
//                   key={opt.value}
//                 >
//                   <Checkbox
//                     id={id}
//                     checked={isChecked}
//                     onCheckedChange={(checked) => {
//                       if (checked) {
//                         field.onChange([...currentValues, opt.value]);
//                       } else {
//                         field.onChange(
//                           currentValues.filter((val) => val !== opt.value),
//                         );
//                       }
//                     }}
//                     aria-invalid={fieldState.invalid}
//                   />
//                   <FieldLabel
//                     htmlFor={id}
//                     className="font-normal cursor-pointer"
//                   >
//                     {opt.label}
//                   </FieldLabel>
//                 </Field>
//               );
//             })}
//           </FieldGroup>
//           {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
//         </FieldSet>
//       )}
//     />
//   );
// }
