"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Tabs as TabsPrimitive } from "radix-ui";
import { cn } from "@/lib/utils/utils";


function Tabs({
  className,
  orientation = "horizontal",
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Root>) {
  return (
    <TabsPrimitive.Root
      data-slot="tabs"
      orientation={orientation}
      className={cn(
        "group/tabs flex gap-2 data-[orientation=horizontal]:flex-col",
        className,
      )}
      {...props}
    />
  );
}

const tabsListVariants = cva(
  [
    "group/tabs-list inline-flex w-fit items-center justify-center",
    "text-muted-foreground",
    "group-data-[orientation=horizontal]/tabs:h-9",
    "group-data-[orientation=vertical]/tabs:h-fit group-data-[orientation=vertical]/tabs:flex-col",
  ],
  {
    variants: {
      variant: {
     
        default: "rounded-md bg-muted p-1 gap-0.5",

        line: "gap-1 border-b border-border bg-transparent rounded-none",

      
        cards: "h-auto w-full gap-3 bg-transparent p-0",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

function TabsList({
  className,
  variant = "default",
  ...props
}: React.ComponentProps<typeof TabsPrimitive.List> &
  VariantProps<typeof tabsListVariants>) {
  return (
    <TabsPrimitive.List
      data-slot="tabs-list"
      data-variant={variant}
      className={cn(tabsListVariants({ variant }), className)}
      {...props}
    />
  );
}

function TabsTrigger({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Trigger>) {
  return (
    <TabsPrimitive.Trigger
      data-slot="tabs-trigger"
      className={cn(
        [
          "relative inline-flex items-center justify-center gap-1.5",
          "whitespace-nowrap text-sm font-medium",
          "px-3 py-1.5",
          "transition-colors duration-150",
          "outline-none",
          "focus-visible:ring-2 focus-visible:ring-ring/25",
          "disabled:pointer-events-none disabled:opacity-50",
          "group-data-[orientation=vertical]/tabs:w-full group-data-[orientation=vertical]/tabs:justify-start",
          "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        ],

        
        [
          "group-data-[variant=default]/tabs-list:rounded-md",
          "group-data-[variant=default]/tabs-list:text-muted-foreground",
          "group-data-[variant=default]/tabs-list:hover:text-foreground",
          "group-data-[variant=default]/tabs-list:data-[state=active]:bg-background",
          "group-data-[variant=default]/tabs-list:data-[state=active]:text-foreground",
          "group-data-[variant=default]/tabs-list:data-[state=active]:shadow-sm",
          "group-data-[variant=default]/tabs-list:data-[state=active]:border",
          "group-data-[variant=default]/tabs-list:data-[state=active]:border-border",
          "dark:group-data-[variant=default]/tabs-list:data-[state=active]:bg-card",
        ],

        [
          "group-data-[variant=line]/tabs-list:rounded-none",
          "group-data-[variant=line]/tabs-list:border-b-2",
          "group-data-[variant=line]/tabs-list:border-transparent",
          "group-data-[variant=line]/tabs-list:pb-2.5",
          "group-data-[variant=line]/tabs-list:text-muted-foreground",
          "group-data-[variant=line]/tabs-list:hover:text-foreground",
          "group-data-[variant=line]/tabs-list:data-[state=active]:border-primary",
          "group-data-[variant=line]/tabs-list:data-[state=active]:text-primary",
        ],
        [
          "group-data-[variant=cards]/tabs-list:flex-1",
          "group-data-[variant=cards]/tabs-list:rounded-lg",
          "group-data-[variant=cards]/tabs-list:border-2",
          "group-data-[variant=cards]/tabs-list:border-border",
          "group-data-[variant=cards]/tabs-list:p-4",
          "group-data-[variant=cards]/tabs-list:text-start",
          "group-data-[variant=cards]/tabs-list:hover:border-border",
          "group-data-[variant=cards]/tabs-list:hover:bg-muted/40",
          "group-data-[variant=cards]/tabs-list:data-[state=active]:border-primary",
          "group-data-[variant=cards]/tabs-list:data-[state=active]:bg-primary/5",
          "group-data-[variant=cards]/tabs-list:data-[state=active]:shadow-none",
          "group-data-[variant=cards]/tabs-list:data-[state=active]:hover:border-primary",
        ],

        className,
      )}
      {...props}
    />
  );
}

function TabsContent({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Content>) {
  return (
    <TabsPrimitive.Content
      data-slot="tabs-content"
      className={cn("flex-1 outline-none", className)}
      {...props}
    />
  );
}

export { Tabs, TabsList, TabsTrigger, TabsContent, tabsListVariants };
