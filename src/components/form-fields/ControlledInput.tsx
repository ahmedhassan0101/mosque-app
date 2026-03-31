"use client";

import { useState } from "react";
import { Controller, Control, FieldValues, Path } from "react-hook-form";
import { Eye, EyeOff } from "lucide-react";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

interface ControlledInputProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label: string;
  placeholder?: string;
  type?: "text" | "email" | "password" | "tel";
  dir?: "ltr" | "rtl";
  required?: boolean;
}

export function ControlledInput<T extends FieldValues>({
  control,
  name,
  label,
  placeholder,
  type = "text",
  dir,
  required,
}: ControlledInputProps<T>) {
  const [showPass, setShowPass] = useState(false);
  const isPassword = type === "password";

  const inputType = isPassword ? (showPass ? "text" : "password") : type;

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          <FieldLabel htmlFor={name}>
            {label} {required && <span className="text-destructive">*</span>}
          </FieldLabel>
          <div className="relative">
            <Input
              {...field}
              id={name}
              type={inputType}
              placeholder={placeholder}
              dir={dir}
              aria-invalid={fieldState.invalid}
              className={isPassword ? "pl-10" : ""}
            />
            {isPassword && (
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                tabIndex={-1}
              >
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            )}
          </div>
          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  );
}
