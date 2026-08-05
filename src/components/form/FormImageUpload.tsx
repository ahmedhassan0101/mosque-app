"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import Image from "next/image";
import type { Control, FieldValues, Path } from "react-hook-form";
import { useController } from "react-hook-form";
import { useImageUpload } from "@/temp/mutations/useImageUpload";
import { Label } from "@/components/ui/label";
import { Button } from "@/temp/button";
import { Loader2, Upload, X, User } from "lucide-react";
import { cn } from "@/lib/utils/utils";

// npm install react-dropzone

interface Props<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label?: string;
}

export function FormImageUpload<T extends FieldValues>({
  control,
  name,
  label,
}: Props<T>) {
  const { field, fieldState } = useController({ control, name });
  const { mutateAsync, isPending } = useImageUpload();
  const [preview, setPreview] = useState<string>(field.value ?? "");

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (!file) return;

      // Local preview فوراً
      const objectUrl = URL.createObjectURL(file);
      setPreview(objectUrl);

      try {
        const result = await mutateAsync(file);
        field.onChange(result.url); // نحفظ الـ Cloudinary URL
        URL.revokeObjectURL(objectUrl);
        setPreview(result.url);
      } catch {
        // Error handled in useImageUpload
        setPreview("");
        field.onChange("");
      }
    },
    [mutateAsync, field],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [".jpg", ".jpeg", ".png", ".webp"] },
    maxFiles: 1,
    disabled: isPending,
  });

  const handleClear = () => {
    setPreview("");
    field.onChange("");
  };

  return (
    <div className="space-y-2">
      {label && <Label>{label}</Label>}

      <div className="flex items-center gap-4">
        {/* Preview */}
        <div className="relative">
          <div className="relative w-25 h-25 rounded-full border-2 border-dashed border-border overflow-hidden flex items-center justify-center bg-muted shrink-0">
            {preview ? (
              <Image
                src={preview}
                alt="صورة الطالب"
                fill
                className="object-cover"
              />
            ) : (
              <User size={32} className="text-muted-foreground" />
            )}

            {isPending && (
              <div className="absolute inset-0 bg-background/70 flex items-center justify-center">
                <Loader2 size={20} className="animate-spin text-primary" />
              </div>
            )}
          </div>
          {preview && (
            <Button
              type="button"
              onClick={handleClear}
              className="absolute top-1 right-1 bg-destructive text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:opacity-90cursor-pointer"
            >
              <X />
            </Button>
          )}
        </div>

        {/* Dropzone */}
        <div
          {...getRootProps()}
          className={cn(
            "flex-1 border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors",
            isDragActive
              ? "border-primary bg-primary/5"
              : "border-border hover:border-primary/50 hover:bg-muted/30",
            isPending && "pointer-events-none opacity-60",
          )}
        >
          <input {...getInputProps()} />
          <Upload size={20} className="mx-auto mb-2 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            {isDragActive
              ? "أفلت الصورة هنا..."
              : "اسحب صورة هنا أو اضغط للاختيار"}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            JPG, PNG, WebP · حتى 5MB
          </p>
        </div>
      </div>

      {fieldState.error && (
        <p className="text-xs text-destructive">{fieldState.error.message}</p>
      )}
    </div>
  );
}
