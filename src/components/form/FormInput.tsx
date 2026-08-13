// src/components/form/FormInput.tsx
"use client";

import { useState } from "react";
import {
  Controller,
  type Control,
  type FieldValues,
  type Path,
} from "react-hook-form";
import { Eye, EyeOff } from "lucide-react";
import {
  Field,
  FieldLabel,
  FieldError,
  FieldDescription,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";

interface FormInputProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label: string;
  placeholder?: string;
  type?: React.HTMLInputTypeAttribute;
  /** Overrides the RTL default from html dir — use for emails and numbers only */
  dir?: "ltr" | "rtl";
  required?: boolean;
  disabled?: boolean;
  description?: string;
  /**
   * autoComplete hint:
   * - "new-password"     → register / reset-password screens
   * - "current-password" → login screen (default for password inputs)
   * - anything else      → passed through as-is
   */
  autoComplete?: string;
}

export function FormInput<T extends FieldValues>({
  control,
  name,
  label,
  placeholder,
  type = "text",
  dir,
  required,
  disabled,
  description,
  autoComplete,
}: FormInputProps<T>) {
  const [showPass, setShowPass] = useState(false);
  const isPassword = type === "password";
  const inputType = isPassword ? (showPass ? "text" : "password") : type;

  const resolvedAutoComplete =
    autoComplete ?? (isPassword ? "current-password" : "on");

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

          <div className="relative">
            <Input
              {...field}
              id={name}
              type={inputType}
              placeholder={placeholder}
              autoComplete={resolvedAutoComplete}
              value={field.value ?? ""}
              dir={dir}
              required={required}
              disabled={disabled}
              aria-invalid={fieldState.invalid || undefined}
              aria-describedby={description ? `${name}-description` : undefined}
              // ps-10 reserves space for the toggle icon on the "start" side
              className={isPassword ? "ps-10" : undefined}
              onChange={(e) => {
                // FIX: valueAsNumber returns NaN on an empty number input.
                // Passing NaN through would render the literal text "NaN"
                // in the field once the user clears it — convert to "".
                if (type === "number") {
                  const num = e.target.valueAsNumber;
                  field.onChange(Number.isNaN(num) ? "" : num);
                } else {
                  field.onChange(e.target.value);
                }
              }}
            />

            {isPassword && (
              <button
                type="button"
                onClick={() => setShowPass((prev) => !prev)}
                disabled={disabled}
                aria-label={
                  showPass ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"
                }
                tabIndex={-1}
                className={[
                  "absolute inset-y-0 inset-s-3",
                  "flex items-center",
                  "text-muted-foreground transition-colors duration-150",
                  "hover:text-foreground",
                  "disabled:pointer-events-none disabled:opacity-50",
                  "focus-visible:outline-none",
                ].join(" ")}
              >
                {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            )}
          </div>

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
// export function FormInput<T extends FieldValues>({
//   control,
//   name,
//   label,
//   placeholder,
//   type = "text",
//   dir,
//   required,
//   disabled,
//   description,
//   autoComplete,
// }: FormInputProps<T>) {
//   const [showPass, setShowPass] = useState(false);
//   const isPassword = type === "password";
//   const inputType = isPassword ? (showPass ? "text" : "password") : type;

//   // autoComplete default logic:
//   // - password inputs → "current-password" (login default)
//   // - caller يمرر "new-password" للـ register/reset
//   // - باقي الـ inputs → "on"
//   const resolvedAutoComplete =
//     autoComplete ?? (isPassword ? "current-password" : "on");

//   return (
//     <Controller
//       name={name}
//       control={control}
//       render={({ field, fieldState }) => (
//         <Field
//           data-invalid={fieldState.invalid || undefined}
//           data-disabled={disabled || undefined}
//         >
//           {/* Label + required asterisk */}
//           <FieldLabel htmlFor={name}>
//             {label}
//             {required && (
//               <span className="text-destructive" aria-hidden="true">
//                 *
//               </span>
//             )}
//           </FieldLabel>

//           {/* Input wrapper — relative للـ password toggle */}
//           <div className="relative">
//             <Input
//               {...field}
//               id={name}
//               type={inputType}
//               placeholder={placeholder}
//               autoComplete={resolvedAutoComplete}
//               value={field.value ?? ""}
//               dir={dir}
//               required={required}
//               disabled={disabled}
//               aria-invalid={fieldState.invalid || undefined}
//               aria-describedby={description ? `${name}-description` : undefined}
//               // RTL-safe: ps-10 = padding-inline-start
//               // يعني اليمين في RTL — حيث سيكون الـ icon
//               className={isPassword ? "ps-10" : undefined}
//               onChange={(e) => {
//                 const val =
//                   type === "number" ? e.target.valueAsNumber : e.target.value;
//                 field.onChange(val);
//               }}
//             />

//             {/* Password toggle */}
//             {isPassword && (
//               <button
//                 type="button"
//                 onClick={() => setShowPass((prev) => !prev)}
//                 disabled={disabled}
//                 aria-label={
//                   showPass ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"
//                 }
//                 tabIndex={-1}
//                 className={[
//                   "absolute inset-y-0 inset-s-3",
//                   "flex items-center",
//                   "text-muted-foreground transition-colors duration-150",
//                   "hover:text-foreground",
//                   "disabled:pointer-events-none disabled:opacity-50",
//                   "focus-visible:outline-none",
//                 ].join(" ")}
//               >
//                 {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
//               </button>
//             )}
//           </div>

//           {/* Helper text — يظهر دايماً حتى في error state */}
//           {description && (
//             <FieldDescription id={`${name}-description`}>
//               {description}
//             </FieldDescription>
//           )}

//           {/* Error — FieldError بترجع null تلقائياً لو مفيش error */}
//           <FieldError errors={[fieldState.error]} />
//         </Field>
//       )}
//     />
//   );
// }
