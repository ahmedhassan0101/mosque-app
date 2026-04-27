"use client";

import * as React from "react";
import { Avatar as AvatarPrimitive } from "radix-ui";
import { cn } from "@/lib/utils";

function Avatar({
  className,
  size = "default",
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Root> & {
  size?: "sm" | "default" | "lg";
}) {
  return (
    <AvatarPrimitive.Root
      data-slot="avatar"
      data-size={size}
      className={cn(
        "group/avatar relative flex shrink-0 select-none rounded-full",
        "ring-1 ring-border", // clean border, no mix-blend
        "data-[size=sm]:size-6",
        "data-[size=default]:size-8",
        "data-[size=lg]:size-10",
        className,
      )}
      {...props}
    />
  );
}

function AvatarImage({
  className,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Image>) {
  return (
    <AvatarPrimitive.Image
      data-slot="avatar-image"
      className={cn(
        "aspect-square size-full rounded-full object-cover",
        className,
      )}
      {...props}
    />
  );
}

function AvatarFallback({
  className,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Fallback>) {
  return (
    <AvatarPrimitive.Fallback
      data-slot="avatar-fallback"
      className={cn(
        "flex size-full items-center justify-center rounded-full",
        // Brand-consistent fallback: primary tint instead of dead grey
        "bg-primary/10 text-primary font-semibold",
        "text-sm group-data-[size=sm]/avatar:text-[10px] group-data-[size=lg]/avatar:text-base",
        className,
      )}
      {...props}
    />
  );
}

/*
 * AvatarBadge — status dot / count overlay.
 * RTL fix: use `end-0` instead of `right-0` so it respects direction.
 */
function AvatarBadge({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="avatar-badge"
      className={cn(
        "absolute inset-e-0 bottom-0 z-10 inline-flex items-center justify-center",
        "rounded-full bg-primary text-primary-foreground",
        "ring-2 ring-background select-none",
        // Size by parent avatar size
        "group-data-[size=sm]/avatar:size-2 group-data-[size=sm]/avatar:[&>svg]:hidden",
        "group-data-[size=default]/avatar:size-2.5 group-data-[size=default]/avatar:[&>svg]:size-2",
        "group-data-[size=lg]/avatar:size-3 group-data-[size=lg]/avatar:[&>svg]:size-2.5",
        className,
      )}
      {...props}
    />
  );
}

/*
 * AvatarGroup — stacked avatars.
 * RTL-aware: `[&>*:not(:first-child)]:-ms-2` uses logical property
 * so overlap direction is correct in both LTR and RTL contexts.
 */
function AvatarGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="avatar-group"
      className={cn(
        "group/avatar-group flex items-center",
        // RTL-safe overlap
        "[&>*[data-slot=avatar]:not(:first-child)]:-ms-2",
        // White ring around each for separation
        "[&>*[data-slot=avatar]]:ring-2 [&>*[data-slot=avatar]]:ring-background",
        className,
      )}
      {...props}
    />
  );
}

function AvatarGroupCount({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="avatar-group-count"
      className={cn(
        "relative flex shrink-0 items-center justify-center rounded-full",
        "size-8 bg-muted text-xs font-medium text-muted-foreground",
        "ring-2 ring-background -ms-2",
        "group-has-data-[size=sm]/avatar-group:size-6 group-has-data-[size=sm]/avatar-group:text-[10px]",
        "group-has-data-[size=lg]/avatar-group:size-10 group-has-data-[size=lg]/avatar-group:text-sm",
        className,
      )}
      {...props}
    />
  );
}

export {
  Avatar,
  AvatarImage,
  AvatarFallback,
  AvatarBadge,
  AvatarGroup,
  AvatarGroupCount,
};
