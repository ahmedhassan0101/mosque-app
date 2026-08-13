"use client";

import { useState } from "react";
import {
  Controller,
  type Control,
  type FieldValues,
  type Path,
} from "react-hook-form";
import { format } from "date-fns";
import { ar } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import {
  Field,
  FieldLabel,
  FieldError,
  FieldDescription,
} from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils/utils";

interface FormDatePickerProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  description?: string;
  /** No restriction unless set — e.g. maxDate={new Date()} for birth dates */
  minDate?: Date;
  maxDate?: Date;
}

export function FormDatePicker<T extends FieldValues>({
  control,
  name,
  label,
  placeholder = "اختر تاريخاً",
  required,
  disabled,
  description,
  minDate,
  maxDate,
}: FormDatePickerProps<T>) {
  const [open, setOpen] = useState(false);

  const isDateDisabled = (date: Date) => {
    if (minDate && date < minDate) return true;
    if (maxDate && date > maxDate) return true;
    return false;
  };

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

          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                id={name}
                type="button"
                variant="outline"
                disabled={disabled}
                aria-invalid={fieldState.invalid || undefined}
                className={cn(
                  "w-full justify-start text-start font-normal",
                  !field.value && "text-muted-foreground",
                )}
              >
                <CalendarIcon className="me-2 size-4 opacity-50" />
                {field.value ? (
                  format(field.value, "PPP", { locale: ar })
                ) : (
                  <span>{placeholder}</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={field.value}
                onSelect={(date) => {
                  field.onChange(date);
                  setOpen(false);
                }}
                disabled={minDate || maxDate ? isDateDisabled : undefined}
                captionLayout="dropdown"
              />
            </PopoverContent>
          </Popover>

          {description && <FieldDescription>{description}</FieldDescription>}
          <FieldError errors={[fieldState.error]} />
        </Field>
      )}
    />
  );
}
