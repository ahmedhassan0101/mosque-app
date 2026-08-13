// src\components\form\FormTextarea.tsx
"use client";

import {
  Controller,
  type Control,
  type FieldValues,
  type Path,
} from "react-hook-form";
import {
  Field,
  FieldLabel,
  FieldError,
  FieldDescription,
} from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";

interface FormTextareaProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label: string;
  placeholder?: string;
  rows?: number;
  required?: boolean;
  disabled?: boolean;
  description?: string;
  /** Shows a "12/200" counter under the field when set */
  maxLength?: number;
}

export function FormTextarea<T extends FieldValues>({
  control,
  name,
  label,
  placeholder,
  rows = 3,
  required,
  disabled,
  description,
  maxLength,
}: FormTextareaProps<T>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <Field
          data-invalid={fieldState.invalid || undefined}
          data-disabled={disabled || undefined}
        >
          <FieldLabel htmlFor={name}>
            {label}
            {required && (
              <span className="text-destructive" aria-hidden="true">
                *
              </span>
            )}
          </FieldLabel>

          <Textarea
            {...field}
            id={name}
            value={field.value ?? ""}
            placeholder={placeholder}
            rows={rows}
            disabled={disabled}
            maxLength={maxLength}
            aria-invalid={fieldState.invalid || undefined}
            aria-describedby={description ? `${name}-description` : undefined}
          />

          {maxLength && (
            <span className="text-end text-xs text-muted-foreground">
              {field.value?.length ?? 0}/{maxLength}
            </span>
          )}

          {description && (
            <FieldDescription id={`${name}-description`}>
              {description}
            </FieldDescription>
          )}

          <FieldError errors={[fieldState.error]} />
        </Field>
      )}
    />
  );
}
// "use client";

// import { Controller, Control, FieldValues, Path } from "react-hook-form";
// import { Field, FieldLabel, FieldError } from "@/components/ui/field";
// import { Textarea } from "@/components/ui/textarea";

// interface FormTextareaProps<T extends FieldValues> {
//   control: Control<T>;
//   name: Path<T>;
//   label: string;
//   placeholder?: string;
//   rows?: number;
//   required?: boolean;
// }

// export function FormTextarea<T extends FieldValues>({
//   control,
//   name,
//   label,
//   placeholder,
//   rows = 3,
//   required,
// }: FormTextareaProps<T>) {
//   return (
//     <Controller
//       name={name}
//       control={control}
//       render={({ field, fieldState }) => (
//         <Field data-invalid={fieldState.invalid}>
//           <FieldLabel htmlFor={name}>
//             {label} {required && <span className="text-destructive">*</span>}
//           </FieldLabel>
//           <Textarea
//             {...field}
//             id={name}
//             placeholder={placeholder}
//             rows={rows}
//             aria-invalid={fieldState.invalid}
//           />
//           {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
//         </Field>
//       )}
//     />
//   );
// }
