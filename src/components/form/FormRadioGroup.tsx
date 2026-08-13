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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface RadioOption {
  label: string;
  value: string;
}

interface FormRadioGroupProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label: string;
  options: RadioOption[];
  orientation?: "horizontal" | "vertical";
  required?: boolean;
  disabled?: boolean;
  description?: string;
}

export function FormRadioGroup<T extends FieldValues>({
  control,
  name,
  label,
  options,
  orientation = "vertical",
  required,
  disabled,
  description,
}: FormRadioGroupProps<T>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <Field
          data-invalid={fieldState.invalid || undefined}
          data-disabled={disabled || undefined}
        >
          <FieldLabel>
            {label}
            {required && (
              <span className="text-destructive" aria-hidden="true">
                *
              </span>
            )}
          </FieldLabel>

          <RadioGroup
            onValueChange={field.onChange}
            value={field.value ?? ""}
            disabled={disabled}
            orientation={orientation}
          >
            {options.map((opt, index) => {
              const itemId = `${name}-${index}`;
              return (
                <Field key={opt.value} orientation="horizontal">
                  <RadioGroupItem value={opt.value} id={itemId} />
                  <FieldLabel
                    htmlFor={itemId}
                    className="cursor-pointer font-normal"
                  >
                    {opt.label}
                  </FieldLabel>
                </Field>
              );
            })}
          </RadioGroup>

          {description && <FieldDescription>{description}</FieldDescription>}
          <FieldError errors={[fieldState.error]} />
        </Field>
      )}
    />
  );
}

// "use client";

// import { Controller, Control, FieldValues, Path } from "react-hook-form";
// import {
//   Field,
//   FieldContent,
//   FieldLabel,
//   FieldError,
// } from "@/components/ui/field";
// import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

// interface RadioOption {
//   label: string;
//   value: string;
// }

// interface FormRadioGroupProps<T extends FieldValues> {
//   control: Control<T>;
//   name: Path<T>;
//   label: string;
//   options: RadioOption[];
//   orientation?: "horizontal" | "vertical";
//   required?: boolean;
// }

// export function FormRadioGroup<T extends FieldValues>({
//   control,
//   name,
//   label,
//   options,
//   orientation = "vertical",
//   required,
// }: FormRadioGroupProps<T>) {
//   return (
//     <Controller
//       name={name}
//       control={control}
//       render={({ field, fieldState }) => (
//         <Field data-invalid={fieldState.invalid} className="space-y-3">
//           <FieldLabel>
//             {label} {required && <span className="text-destructive">*</span>}
//           </FieldLabel>
//           <RadioGroup
//             onValueChange={field.onChange}
//             value={field.value}
//             className={`flex ${
//               orientation === "horizontal" ? "flex-row gap-6" : "flex-col gap-3"
//             }`}
//             dir="rtl"
//           >
//             {options.map((opt, index) => {
//               const itemId = `${name}-${index}`;
//               return (
//                 <Field
//                   key={opt.value}
//                   orientation="horizontal"
//                   className="space-x-2 space-x-reverse"
//                 >

//                   <RadioGroupItem value={opt.value} id={itemId} />
//                   <FieldContent>
//                     <FieldLabel
//                       htmlFor={itemId}
//                       className="font-normal cursor-pointer"
//                     >
//                       {opt.label}
//                     </FieldLabel>
//                   </FieldContent>
//                 </Field>
//               );
//             })}
//           </RadioGroup>
//           {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
//         </Field>
//       )}
//     />
//   );
// }
