// src/components/shared/SectionTitle.tsx
import type { LucideIcon } from "lucide-react";
import { CardTitle } from "@/components/ui/card";

interface SectionTitleProps {
  icon: LucideIcon;
  children: React.ReactNode;
}

/**
 * Icon + text combo for a CardHeader's title — sized to sit clearly
 * below the page h1 but above field/body text. Used wherever a card
 * groups related content (form sections, profile info blocks).
 */
export function SectionTitle({ icon: Icon, children }: SectionTitleProps) {
  return (
    <CardTitle className="flex items-center gap-2 text-base font-semibold">
      <Icon size={16} className="shrink-0 text-muted-foreground" />
      {children}
    </CardTitle>
  );
}
