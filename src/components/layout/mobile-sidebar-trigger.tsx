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
import { Sidebar } from "./sidebar";

/**
 * MobileSidebarTrigger renders a hamburger button that opens the
 * Sidebar inside a Sheet overlay on small/medium screens.
 */
export function MobileSidebarTrigger() {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9 md:hidden"
          aria-label="فتح القائمة"
        >
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      {/* RTL: sheet slides in from right */}
      <SheetContent
        side="right"
        className=" p-0 border-e border-sidebar-border"
        aria-label="القائمة الجانبية"
      >
        <SheetTitle></SheetTitle>
        <Sidebar isMobile />
      </SheetContent>
    </Sheet>
  );
}
