// components/layout/SearchDialog.tsx
"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command";
import { buildSearchIndex } from "@/lib/search/search-data";

/*
  SearchDialog
  ─────────────────────────────────────────────
  - Cmd+K / Ctrl+K يفتح الحوار من أي مكان في الـ dashboard
  - cmdk بتتولى الفلترة والـ keyboard nav (↑↓ Enter) تلقائياً،
    فمفيش حاجة نكتبها يدوياً هنا
  - البيانات بتُحسب مرة واحدة بس عبر useState lazy init،
    مش في كل render (الـ role مش متوقع يتغير خلال نفس الـ session)
  ─────────────────────────────────────────────
*/

interface SearchDialogProps {
  role?: string;
}

export function SearchDialog({ role = "SUPERVISOR" }: SearchDialogProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [results] = useState(() => buildSearchIndex(role));

  // Cmd+K / Ctrl+K global shortcut
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleSelect = useCallback(
    (href: string) => {
      setOpen(false);
      router.push(href);
    },
    [router],
  );

  return (
    <>
      {/* Trigger — زرار في الـ navbar */}
      <Button
        variant="secondary"
        size="sm"
        onClick={() => setOpen(true)}
        className="hidden gap-2 text-muted-foreground sm:flex"
      >
        <Search size={14} aria-hidden="true" />
        <span>بحث...</span>
        <kbd className="ms-2 rounded border border-border bg-background px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">
          ⌘K
        </kbd>
      </Button>

      {/* زرار أيقونة فقط على الموبايل/الشاشات الصغيرة */}
      <Button
        variant="ghost"
        size="icon-sm"
        onClick={() => setOpen(true)}
        className="sm:hidden"
        aria-label="بحث"
      >
        <Search size={16} />
      </Button>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="ابحث عن صفحة..." />
        <CommandList>
          <CommandEmpty>لا توجد نتائج مطابقة</CommandEmpty>

          <CommandGroup heading="الصفحات">
            {results.map((result) => {
              const Icon = result.icon;
              return (
                <CommandItem
                  key={result.href}
                  value={`${result.label} ${result.context}`}
                  onSelect={() => handleSelect(result.href)}
                >
                  <Icon aria-hidden="true" />
                  <span className="flex-1">{result.label}</span>
                  <span className="text-xs text-muted-foreground">
                    {result.context}
                  </span>
                </CommandItem>
              );
            })}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}
