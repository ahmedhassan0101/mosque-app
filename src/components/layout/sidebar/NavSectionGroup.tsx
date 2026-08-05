// components/layout/sidebar/NavSectionGroup.tsx

import type { NavSection } from "@/constants/navigation";
import { NavItemLink } from "./NavItemLink";
import { NavItemCollapsible } from "./NavItemCollapsible";

interface NavSectionGroupProps {
  section: NavSection;
  onNavigate?: () => void;
}

export function NavSectionGroup({ section, onNavigate }: NavSectionGroupProps) {
  return (
    <div className="flex flex-col gap-0.5">

      {/*
        عنوان القسم — uppercase + tracking-wide + حجم صغير جداً
        بيخلق فصل بصري واضح وهوية "section header" حقيقية،
        بدل نص عادي بيلخبط مع نصوص الـ items
      */}
      <h3 className="px-2.5 pb-1.5 text-[10.5px] font-medium uppercase tracking-wider text-muted-foreground/70">
        {section.title}
      </h3>

      {section.items.map((item) =>
        item.children ? (
          <NavItemCollapsible
            key={item.label}
            item={item}
            onNavigate={onNavigate}
          />
        ) : (
          <NavItemLink
            key={item.label}
            item={item}
            onNavigate={onNavigate}
          />
        )
      )}

    </div>
  );
}