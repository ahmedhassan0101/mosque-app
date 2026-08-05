// components/shared/ThemeToggle.tsx
"use client";

import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <Button
      variant="ghost"
      size="icon-sm"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      aria-label={
        theme === "dark" ? "تفعيل الوضع الفاتح" : "تفعيل الوضع الداكن"
      }
    >
      {/* Sun — يظهر في dark mode، الضغط عليه يفعّل light */}
      <Sun
        size={15}
        className="rotate-0 scale-100 transition-transform duration-150 dark:-rotate-90 dark:scale-0"
        aria-hidden="true"
      />
      {/* Moon — يظهر في light mode، الضغط عليه يفعّل dark */}
      <Moon
        size={15}
        className="absolute rotate-90 scale-0 transition-transform duration-150 dark:rotate-0 dark:scale-100"
        aria-hidden="true"
      />
    </Button>
  );
}
