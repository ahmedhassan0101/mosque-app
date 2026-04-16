import React from "react";
import { Button } from "../ui/button";
import { Bell } from "lucide-react";

export default function Notifications() {
  return (
    <Button
      variant="ghost"
      size="icon"
      className="relative h-9 w-9 text-muted-foreground hover:text-foreground"
      aria-label="الإشعارات"
    >
      <Bell className="h-4 w-4" />
      {/* Badge */}
      <span
        aria-hidden="true"
        className="absolute inset-e-1.5 top-1.5 h-2 w-2 rounded-full bg-destructive ring-2 ring-background"
      />
    </Button>
  );
}

// user-dropdown