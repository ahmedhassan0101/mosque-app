"use client";

import {
  Controller,
  type Control,
  type FieldValues,
  type Path,
} from "react-hook-form";
import { Switch } from "@/components/ui/switch";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldLabel,
  FieldError,
} from "@/components/ui/field";

interface FormSwitchProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label: string;
  description?: string;
  disabled?: boolean;
}

export function FormSwitch<T extends FieldValues>({
  control,
  name,
  label,
  description,
  disabled,
}: FormSwitchProps<T>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <Field
          orientation="horizontal"
          data-invalid={fieldState.invalid || undefined}
          data-disabled={disabled || undefined}
          className="justify-between"
        >
          <FieldContent>
            <FieldLabel htmlFor={name} className="cursor-pointer">
              {label}
            </FieldLabel>
            {description && <FieldDescription>{description}</FieldDescription>}
            <FieldError errors={[fieldState.error]} />
          </FieldContent>
          <Switch
            id={name}
            checked={!!field.value}
            onCheckedChange={field.onChange}
            disabled={disabled}
            aria-invalid={fieldState.invalid || undefined}
            // Intentionally kept LTR: the thumb always slides the same
            // physical direction regardless of page direction — common
            // practice for toggle switches in RTL apps since it's an
            // iconographic on/off control, not directional text/content.
            dir="ltr"
          />
        </Field>
      )}
    />
  );
}
