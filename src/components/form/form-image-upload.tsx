// src/components/ui/form-image-upload.tsx
"use client";

import { useCallback, useState, useTransition } from "react";
import { useDropzone } from "react-dropzone";
import Image from "next/image";
import type { Control, FieldValues, Path } from "react-hook-form";
import { useController } from "react-hook-form";
import { uploadImageAction } from "@/actions/upload.actions";
import { toast } from "sonner";
import {
  Field,
  FieldLabel,
  FieldError,
  FieldDescription,
} from "@/components/ui/field";
import { Loader2, Upload, X, User } from "lucide-react";
import { cn } from "@/lib/utils/utils";

interface FormImageUploadProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label?: string;
  required?: boolean;
  disabled?: boolean;
  description?: string;
  folderCategory?: "students" | "teachers" | "events" | "general";
  /** Default 5MB */
  maxSizeMB?: number;
}

export function FormImageUpload<T extends FieldValues>({
  control,
  name,
  label,
  required,
  disabled,
  description,
  folderCategory = "general",
  maxSizeMB = 5,
}: FormImageUploadProps<T>) {
  const { field, fieldState } = useController({ control, name });
  const [isPending, startTransition] = useTransition();

  // FIX: the old code seeded a `preview` state once from field.value on
  // mount, so it never picked up a value set later (e.g. form.reset()
  // after fetching an existing teacher's photo in edit mode — the avatar
  // just stayed empty). localPreview now only holds a transient blob URL
  // while a new file is actively uploading; the field's own value is the
  // source of truth for what's displayed the rest of the time.
  const [localPreview, setLocalPreview] = useState<string | null>(null);
  const displayUrl = localPreview ?? (field.value || "");
  const isDisabled = disabled || isPending;

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (!file) return;

      const maxBytes = maxSizeMB * 1024 * 1024;
      if (file.size > maxBytes) {
        toast.error(`حجم الصورة كبير جداً، الحد الأقصى ${maxSizeMB}MB`);
        return;
      }

      const objectUrl = URL.createObjectURL(file);
      setLocalPreview(objectUrl);

      startTransition(async () => {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("folderPath", folderCategory);

        const result = await uploadImageAction(formData);

        // FIX: a failed upload used to also call field.onChange(""),
        // wiping a previously-saved photo just because the *new* attempt
        // failed. Now a failure only discards the local preview — the
        // existing saved value is left untouched.
        if (result.status === "error" || result.status === "fail") {
          toast.error(result.message);
        } else {
          field.onChange(result.data?.url);
        }

        // FIX: revoking here is safe now — displayUrl falls back to
        // field.value once localPreview clears, instead of the old code
        // where `preview` state kept pointing at this now-revoked blob.
        URL.revokeObjectURL(objectUrl);
        setLocalPreview(null);
      });
    },
    [folderCategory, maxSizeMB, field],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [".jpg", ".jpeg", ".png", ".webp"] },
    maxFiles: 1,
    disabled: isDisabled,
  });

  const handleClear = () => {
    setLocalPreview(null);
    field.onChange("");
  };

  return (
    <Field
      data-invalid={fieldState.invalid || undefined}
      data-disabled={isDisabled || undefined}
    >
      {label && (
        <FieldLabel htmlFor={name}>
          {label}
          {required && (
            <span className="text-destructive" aria-hidden="true">
              *
            </span>
          )}
        </FieldLabel>
      )}

      <div className="flex items-center gap-4">
        {/* Preview */}
        <div className="relative">
          <div className="relative flex size-25 shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-dashed border-border bg-muted">
            {displayUrl ? (
              <Image src={displayUrl} alt="معاينة" fill className="object-cover" />
            ) : (
              <User size={32} className="text-muted-foreground" />
            )}

            {isPending && (
              <div className="absolute inset-0 flex items-center justify-center bg-background/70">
                <Loader2 size={20} className="animate-spin text-primary" />
              </div>
            )}
          </div>

          {displayUrl && !isPending && (
            <button
              type="button"
              onClick={handleClear}
              disabled={isDisabled}
              aria-label="حذف الصورة"
              className={cn(
                "absolute top-1 inset-s-1 flex size-5 items-center justify-center",
                "rounded-full bg-destructive text-destructive-foreground text-xs",
                "transition-colors duration-150 hover:opacity-90",
                "disabled:pointer-events-none disabled:opacity-50",
              )}
            >
              <X size={12} />
            </button>
          )}
        </div>

        {/* Dropzone */}
        <div
          {...getRootProps()}
          className={cn(
            "flex-1 rounded-lg border-2 border-dashed p-4 text-center transition-colors",
            isDisabled ? "cursor-not-allowed opacity-60" : "cursor-pointer",
            isDragActive
              ? "border-primary bg-primary/5"
              : "border-border hover:border-primary/50 hover:bg-muted/30",
          )}
        >
          {/* id lives on the actual input so FieldLabel's htmlFor works */}
          <input {...getInputProps({ id: name })} />
          <Upload size={20} className="mx-auto mb-2 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            {isDragActive ? "أفلت الصورة هنا..." : "اسحب صورة هنا أو اضغط للاختيار"}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            JPG, PNG, WebP · حتى {maxSizeMB}MB
          </p>
        </div>
      </div>

      {description && <FieldDescription>{description}</FieldDescription>}
      <FieldError errors={[fieldState.error]} />
    </Field>
  );
}
// "use client";

// import { useCallback, useState, useTransition } from "react";
// import { useDropzone } from "react-dropzone";
// import Image from "next/image";
// import type { Control, FieldValues, Path } from "react-hook-form";
// import { useController } from "react-hook-form";
// import { uploadImageAction } from "@/actions/upload.actions";
// import { toast } from "sonner";
// import { Label } from "@/components/ui/label";
// import { Button } from "@/components/ui/button";
// import { Loader2, Upload, X, User } from "lucide-react";
// import { cn } from "@/lib/utils/utils";

// interface Props<T extends FieldValues> {
//   control: Control<T>;
//   name: Path<T>;
//   label?: string;
//   // إضافة تصنيف ديناميكي للمجلدات
//   folderCategory?: "students" | "teachers" | "events" | "general";
// }

// export function FormImageUpload<T extends FieldValues>({
//   control,
//   name,
//   label,
//   folderCategory = "general",
// }: Props<T>) {
//   const { field, fieldState } = useController({ control, name });
//   const [isPending, startTransition] = useTransition();
//   const [preview, setPreview] = useState<string>(field.value ?? "");

//   const onDrop = useCallback(
//     (acceptedFiles: File[]) => {
//       const file = acceptedFiles[0];
//       if (!file) return;

//       // 1. Validation محلي قبل إرهاق السيرفر
//       if (file.size > 5 * 1024 * 1024) {
//         toast.error("حجم الصورة كبير جداً، الحد الأقصى 5MB");
//         return;
//       }

//       // 2. Local preview فوراً
//       const objectUrl = URL.createObjectURL(file);
//       setPreview(objectUrl);

//       // 3. التنفيذ داخل Transition
//       startTransition(async () => {
//         const formData = new FormData();
//         formData.append("file", file);
//         formData.append("folderPath", folderCategory);

//         const result = await uploadImageAction(formData);

//         if (result.status === "error" || result.status === "fail") {
//           toast.error(result.message);
//           setPreview("");
//           field.onChange("");
//         } else {
//           field.onChange(result.data?.url);
//         }

//         URL.revokeObjectURL(objectUrl);
//       });
//     },
//     [folderCategory, field], // الـ Dependencies
//   );

//   const { getRootProps, getInputProps, isDragActive } = useDropzone({
//     onDrop,
//     accept: { "image/*": [".jpg", ".jpeg", ".png", ".webp"] },
//     maxFiles: 1,
//     disabled: isPending,
//   });

//   const handleClear = () => {
//     setPreview("");
//     field.onChange("");
//   };

//   return (
//     // ... الـ JSX الخاص بك كما هو، ممتاز جداً ولا غبار عليه من ناحية الـ UI/UX ...
//     // (سأختصره هنا لتوفير المساحة، استخدم نفس الـ Return القديم الخاص بك)
//     <div className="space-y-2">
//       {label && <Label>{label}</Label>}

//       <div className="flex items-center gap-4">
//         {/* Preview Container */}
//         <div className="relative">
//           <div className="relative w-25 h-25 rounded-full border-2 border-dashed border-border overflow-hidden flex items-center justify-center bg-muted shrink-0">
//             {preview ? (
//               <Image src={preview} alt="معاينة" fill className="object-cover" />
//             ) : (
//               <User size={32} className="text-muted-foreground" />
//             )}

//             {isPending && (
//               <div className="absolute inset-0 bg-background/70 flex items-center justify-center">
//                 <Loader2 size={20} className="animate-spin text-primary" />
//               </div>
//             )}
//           </div>
//           {preview && (
//             <Button
//               type="button"
//               onClick={handleClear}
//               disabled={isPending}
//               className="absolute top-1 right-1 bg-destructive text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:opacity-90 cursor-pointer"
//             >
//               <X size={12} />
//             </Button>
//           )}
//         </div>

//         {/* Dropzone Container */}
//         <div
//           {...getRootProps()}
//           className={cn(
//             "flex-1 border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors",
//             isDragActive
//               ? "border-primary bg-primary/5"
//               : "border-border hover:border-primary/50 hover:bg-muted/30",
//             isPending && "pointer-events-none opacity-60",
//           )}
//         >
//           <input {...getInputProps()} />
//           <Upload size={20} className="mx-auto mb-2 text-muted-foreground" />
//           <p className="text-sm text-muted-foreground">
//             {isDragActive
//               ? "أفلت الصورة هنا..."
//               : "اسحب صورة هنا أو اضغط للاختيار"}
//           </p>
//           <p className="text-xs text-muted-foreground mt-1">
//             JPG, PNG, WebP · حتى 5MB
//           </p>
//         </div>
//       </div>

//       {fieldState.error && (
//         <p className="text-xs text-destructive">{fieldState.error.message}</p>
//       )}
//     </div>
//   );
// }
