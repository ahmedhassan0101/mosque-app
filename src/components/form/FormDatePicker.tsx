"use client";

import { useState } from "react";
import { Controller, Control, FieldValues, Path } from "react-hook-form";
import { format } from "date-fns";
import { ar } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface FormDatePickerProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label: string;
  placeholder?: string;
  required?: boolean;
}

export function FormDatePicker<T extends FieldValues>({
  control,
  name,
  label,
  placeholder = "اختر تاريخاً",
  required,
}: FormDatePickerProps<T>) {
  const [open, setOpen] = useState(false);

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <Field
          data-invalid={fieldState.invalid}
          className="flex flex-col space-y-1.5"
        >
          <FieldLabel htmlFor={name}>
            {label} {required && <span className="text-destructive">*</span>}
          </FieldLabel>
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                id={name}
                variant="outline"
                aria-invalid={fieldState.invalid}
                className={cn(
                  "w-full justify-start text-right font-normal",
                  !field.value && "text-muted-foreground",
                )}
              >
                <CalendarIcon className="ml-2 h-4 w-4 opacity-50" />
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
                  setOpen(false); // قفل البوب أب بعد الاختيار
                }}
                disabled={(date) =>
                  date > new Date() || date < new Date("1900-01-01")
                }
                // initialFocus
                captionLayout="dropdown"
              />
            </PopoverContent>
          </Popover>
          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  );
}
