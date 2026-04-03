"use client";

import { Controller, Control, FieldValues, Path } from "react-hook-form";
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
}

export function FormSwitch<T extends FieldValues>({
  control,
  name,
  label,
  description,
}: FormSwitchProps<T>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <Field
          orientation="horizontal"
          data-invalid={fieldState.invalid}
          className="justify-between"
        >
          <FieldContent>
            <FieldLabel htmlFor={name} className="cursor-pointer" >
              {label}
            </FieldLabel>
            {description && (
              <FieldDescription>{description}</FieldDescription>
            )}
            {fieldState.invalid && (
              <FieldError errors={[fieldState.error]}  />
            )}
          </FieldContent>
          <Switch
            id={name}
            checked={!!field.value}
            onCheckedChange={field.onChange}
            aria-invalid={fieldState.invalid}
            dir="ltr"
          />
        </Field>
      )}
    />
  );
}
