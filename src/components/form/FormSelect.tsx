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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SelectOption {
  label: string;
  value: string;
}

interface FormSelectProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label: string;
  options: SelectOption[];
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  description?: string;
  /** Radix needs this explicitly — it doesn't infer direction from html[dir] */
  dir?: "rtl" | "ltr";
}

export function FormSelect<T extends FieldValues>({
  control,
  name,
  label,
  options,
  placeholder = "اختر من القائمة...",
  required,
  disabled,
  description,
  dir = "rtl",
}: FormSelectProps<T>) {
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

          <Select
            onValueChange={field.onChange}
            value={field.value ?? ""}
            disabled={disabled}
            dir={dir}
          >
            <SelectTrigger
              id={name}
              aria-invalid={fieldState.invalid || undefined}
              className="w-full"
            >
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent>
              {options.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {description && <FieldDescription>{description}</FieldDescription>}
          <FieldError errors={[fieldState.error]} />
        </Field>
      )}
    />
  );
}

// "use client";

// import { Controller, Control, FieldValues, Path } from "react-hook-form";
// import { Field, FieldLabel, FieldError } from "@/components/ui/field";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";

// interface SelectOption {
//   label: string;
//   value: string;
// }

// interface FormSelectProps<T extends FieldValues> {
//   control: Control<T>;
//   name: Path<T>;
//   label: string;
//   options: SelectOption[];
//   placeholder?: string;
//   required?: boolean;
//   dir?: "rtl" | "ltr";
// }

// export function FormSelect<T extends FieldValues>({
//   control,
//   name,
//   label,
//   options,
//   placeholder = "اختر من القائمة...",
//   required,
//   dir = "rtl",
// }: FormSelectProps<T>) {
//   return (
//     <Controller
//       name={name}
//       control={control}
//       render={({ field, fieldState }) => (
//         <Field data-invalid={fieldState.invalid}>
//           <FieldLabel htmlFor={name}>
//             {label} {required && <span className="text-destructive">*</span>}
//           </FieldLabel>
//           <Select onValueChange={field.onChange} value={field.value} dir={dir}>
//             <SelectTrigger id={name} aria-invalid={fieldState.invalid} className="w-full justify-between">
//               <SelectValue placeholder={placeholder} />
//             </SelectTrigger>
//             <SelectContent>
//               {options.map((option) => (
//                 <SelectItem key={option.value} value={option.value}>
//                   {option.label}
//                 </SelectItem>
//               ))}
//             </SelectContent>
//           </Select>
//           {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
//         </Field>
//       )}
//     />
//   );
// }
