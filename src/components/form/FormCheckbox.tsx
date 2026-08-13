"use client";

import {
  Controller,
  type Control,
  type FieldValues,
  type Path,
} from "react-hook-form";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldLabel,
  FieldError,
} from "@/components/ui/field";
import { Checkbox } from "@/components/ui/checkbox";

interface FormCheckboxProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label: string;
  description?: string;
  disabled?: boolean;
}

export function FormCheckbox<T extends FieldValues>({
  control,
  name,
  label,
  description,
  disabled,
}: FormCheckboxProps<T>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <Field
          orientation="horizontal"
          data-invalid={fieldState.invalid || undefined}
          data-disabled={disabled || undefined}
        >
          <Checkbox
            id={name}
            checked={!!field.value}
            onCheckedChange={field.onChange}
            disabled={disabled}
            aria-invalid={fieldState.invalid || undefined}
          />
          <FieldContent>
            <FieldLabel htmlFor={name} className="cursor-pointer font-normal">
              {label}
            </FieldLabel>
            {description && <FieldDescription>{description}</FieldDescription>}
            <FieldError errors={[fieldState.error]} />
          </FieldContent>
        </Field>
      )}
    />
  );
}
