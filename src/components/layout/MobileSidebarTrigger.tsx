// components/layout/MobileSidebarTrigger.tsx
"use client";

import { useState } from "react";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Sidebar } from "./Sidebar";

interface MobileSidebarTriggerProps {
  role?: string;
}

export function MobileSidebarTrigger({ role }: MobileSidebarTriggerProps) {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon-sm"
          className="lg:hidden"
          aria-label="فتح القائمة"
        >
          <Menu size={16} />
        </Button>
      </SheetTrigger>

      <SheetContent side="right" className="p-0" aria-label="القائمة الجانبية">
        <SheetTitle className="sr-only">القائمة الجانبية</SheetTitle>

        <Sidebar
          role={role}
          className="flex w-full"
          onNavigate={() => setOpen(false)}
        />
      </SheetContent>
    </Sheet>
  );
}
