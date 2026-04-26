// "use client";

// import { useState } from "react";
// import { Controller, Control, FieldValues, Path } from "react-hook-form";
// import { Eye, EyeOff } from "lucide-react";
// import { Field, FieldLabel, FieldError } from "@/components/ui/field";
// import { Input } from "@/components/ui/input";

// interface FormInputProps<T extends FieldValues> {
//   control: Control<T>;
//   name: Path<T>;
//   label: string;
//   placeholder?: string;
//   type?: React.HTMLInputTypeAttribute;
//   dir?: "ltr" | "rtl";
//   required?: boolean;
// }

// export function FormInput<T extends FieldValues>({
//   control,
//   name,
//   label,
//   placeholder,
//   type = "text",
//   dir,
//   required,
// }: FormInputProps<T>) {
//   const [showPass, setShowPass] = useState(false);
//   const isPassword = type === "password";

//   const inputType = isPassword ? (showPass ? "text" : "password") : type;

//   return (
//     <Controller
//       name={name}
//       control={control}
//       render={({ field, fieldState }) => (
//         <Field data-invalid={fieldState.invalid}>
//           <FieldLabel htmlFor={name}>
//             {label} {required && <span className="text-destructive">*</span>}
//           </FieldLabel>
//           <div className="relative">
//             <Input
//               {...field}
//               id={name}
//               type={inputType}
//               placeholder={placeholder}
//               autoComplete={type === "password" ? "current-password" : "on"}
//               value={field.value ?? ""}
//               dir={dir}
//               aria-invalid={fieldState.invalid}
//               className={isPassword ? "pl-10" : ""}
//               onChange={(e) => {
//                 const val =
//                   type === "number" ? e.target.valueAsNumber : e.target.value;
//                 field.onChange(val);
//               }}
//             />
//             {isPassword && (
//               <button
//                 type="button"
//                 onClick={() => setShowPass(!showPass)}
//                 className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
//                 tabIndex={-1}
//               >
//                 {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
//               </button>
//             )}
//           </div>
//           {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
//         </Field>
//       )}
//     />
//   );
// }
// // ----------------------
// // "use client";

// // import { useState } from "react";
// // import { Controller, Control, FieldValues, Path } from "react-hook-form";
// // import { Eye, EyeOff } from "lucide-react";
// // import { Field, FieldLabel, FieldError } from "@/components/ui/field";
// // import { Input } from "@/components/ui/input";

// // interface FormInputProps<T extends FieldValues> {
// //   control: Control<T>;
// //   name: Path<T>;
// //   label: string;
// //   placeholder?: string;
// //   type?: "text" | "email" | "password" | "tel";
// //   dir?: "ltr" | "rtl";
// //   required?: boolean;
// // }

// // export function FormInput<T extends FieldValues>({
// //   control,
// //   name,
// //   label,
// //   placeholder,
// //   type = "text",
// //   dir,
// //   required,
// // }: FormInputProps<T>) {
// //   const [showPass, setShowPass] = useState(false);
// //   const isPassword = type === "password";

// //   const inputType = isPassword ? (showPass ? "text" : "password") : type;

// //   return (
// //     <Controller
// //       name={name}
// //       control={control}
// //       render={({ field, fieldState }) => (
// //         <Field data-invalid={fieldState.invalid}>
// //           <FieldLabel htmlFor={name}>
// //             {label} {required && <span className="text-destructive">*</span>}
// //           </FieldLabel>
// //           <div className="relative">
// //             <Input
// //               {...field}
// //               id={name}
// //               type={inputType}
// //               placeholder={placeholder}
// //               dir={dir}
// //               aria-invalid={fieldState.invalid}
// //               className={isPassword ? "pl-10" : ""}
// //             />
// //             {isPassword && (
// //               <button
// //                 type="button"
// //                 onClick={() => setShowPass(!showPass)}
// //                 className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
// //                 tabIndex={-1}
// //               >
// //                 {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
// //               </button>
// //             )}
// //           </div>
// //           {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
// //         </Field>
// //       )}
// //     />
// //   );
// // }

"use client";

import { useState } from "react";
import {
  Controller,
  type Control,
  type FieldValues,
  type Path,
} from "react-hook-form";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";

interface FormInputProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label: string;
  placeholder?: string;
  type?: React.HTMLInputTypeAttribute;
  dir?: "ltr" | "rtl";
  required?: boolean;
  className?: string;
}

export function FormInput<T extends FieldValues>({
  control,
  name,
  label,
  placeholder,
  type = "text",
  dir,
  required,
  className,
}: FormInputProps<T>) {
  const [showPass, setShowPass] = useState(false);
  const isPassword = type === "password";
  const inputType = isPassword ? (showPass ? "text" : "password") : type;

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <div className={cn("flex flex-col gap-1.5", className)}>
          {/* Label */}
          <label
            htmlFor={String(name)}
            className="text-sm font-medium text-foreground"
          >
            {label}
            {required && <span className="mr-0.5 text-destructive">*</span>}
          </label>

          {/* Input wrapper */}
          <div className="relative">
            <Input
              {...field}
              id={String(name)}
              type={inputType}
              placeholder={placeholder}
              dir={dir}
              value={field.value ?? ""}
              aria-invalid={fieldState.invalid}
              autoComplete={isPassword ? "current-password" : undefined}
              // RTL: password toggle sits on the left (ltr end) of the field
              className={cn(isPassword && "pe-10")}
              onChange={(e) => {
                field.onChange(
                  type === "number" ? e.target.valueAsNumber : e.target.value,
                );
              }}
            />

            {/* Password toggle — absolute positioned to the start side in RTL */}
            {isPassword && (
              <button
                type="button"
                tabIndex={-1}
                onClick={() => setShowPass((p) => !p)}
                aria-label={
                  showPass ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"
                }
                className="
                     absolute inset-e-3 top-1/2 -translate-y-1/2
                  text-muted-foreground hover:text-foreground
                  transition-colors duration-150
                "
              >
                {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            )}
          </div>

          {/* Inline error */}
          {fieldState.error?.message && (
            <p className="text-xs text-destructive leading-snug">
              {fieldState.error.message}
            </p>
          )}
        </div>
      )}
    />
  );
}
// absolute start-3 top-1/2 -translate-y-1/2
// text-muted-foreground hover:text-foreground
// transition-colors duration-150
