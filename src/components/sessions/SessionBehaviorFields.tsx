// src/components/sessions/SessionBehaviorFields.tsx
/**
 * Session-level behavior tags + general notes.
 * Tags = structured data for statistics.
 * Notes = free text for edge cases.
 */
"use client";

import type { Control } from "react-hook-form";
import type { SessionInput } from "@/schemas/session.schema";

import { FormTextarea } from "@/components/form/FormTextarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Controller } from "react-hook-form";
import { BEHAVIOR_TAG_LABELS, BEHAVIOR_TAGS, BehaviorTag } from "@/constants";

interface SessionBehaviorFieldsProps {
  control: Control<SessionInput>;
}

export function SessionBehaviorFields({ control }: SessionBehaviorFieldsProps) {
  return (
    <section className="space-y-4">
      <h3 className="text-sm font-semibold text-muted-foreground border-b pb-2">
        تقييم الجلسة العام
      </h3>

      {/* Behavior tags */}
      <div>
        <p className="text-sm font-medium mb-2">وصف الجلسة</p>
        <Controller
          control={control}
          name="behaviorTags"
          render={({ field }) => (
            <div className="flex flex-wrap gap-2">
              {BEHAVIOR_TAGS.map((tag) => {
                const isChecked = (field.value ?? []).includes(tag);
                return (
                  <label
                    key={tag}
                    htmlFor={`tag-${tag}`}
                    className={`
                      flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs
                      cursor-pointer transition-colors select-none
                      ${isChecked
                        ? "border-primary bg-primary/10 text-primary font-medium"
                        : "border-border hover:border-primary/40 text-muted-foreground"
                      }
                    `}
                  >
                    <Checkbox
                      id={`tag-${tag}`}
                      checked={isChecked}
                      className="hidden"
                      onCheckedChange={(checked) => {
                        const current = field.value ?? [];
                        const updated = checked
                          ? [...current, tag as BehaviorTag]
                          : current.filter((t) => t !== tag);
                        field.onChange(updated);
                      }}
                    />
                    {BEHAVIOR_TAG_LABELS[tag]}
                  </label>
                );
              })}
            </div>
          )}
        />
      </div>


    </section>
  );
}