"use client";

import { Controller, Control, FieldValues, Path } from "react-hook-form";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
  FieldError,
} from "@/components/ui/field";

interface CheckboxOption {
  label: string;
  value: string;
}

interface FormCheckboxGroupProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label: string;
  description?: string;
  options: CheckboxOption[];
  required?: boolean;
}

export function FormCheckboxGroup<T extends FieldValues>({
  control,
  name,
  label,
  description,
  options,
  required,
}: FormCheckboxGroupProps<T>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <FieldSet data-invalid={fieldState.invalid}>
          <FieldLegend variant="label">
            {label} {required && <span className="text-destructive">*</span>}
          </FieldLegend>
          {description && <FieldDescription>{description}</FieldDescription>}

          <FieldGroup className="gap-3 mt-2">
            {options.map((opt, index) => {
              const id = `${name}-${index}`;
              // التأكد إن القيمة عبارة عن مصفوفة
              const currentValues = Array.isArray(field.value)
                ? field.value
                : [];
              const isChecked = (currentValues as string[]).includes(opt.value);

              return (
                <Field
                  orientation="horizontal"
                  className="space-x-2 space-x-reverse "
                  key={opt.value}
                >
                  <Checkbox
                    id={id}
                    checked={isChecked}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        field.onChange([...currentValues, opt.value]);
                      } else {
                        field.onChange(
                          currentValues.filter((val) => val !== opt.value),
                        );
                      }
                    }}
                    aria-invalid={fieldState.invalid}
                  />
                  <FieldLabel
                    htmlFor={id}
                    className="font-normal cursor-pointer"
                  >
                    {opt.label}
                  </FieldLabel>
                </Field>
              );
            })}
          </FieldGroup>
          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </FieldSet>
      )}
    />
  );
}
