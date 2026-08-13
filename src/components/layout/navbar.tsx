// components/layout/Navbar.tsx

import type { Session } from "next-auth";

import { MobileSidebarTrigger } from "./navbar/MobileSidebarTrigger";
import { SearchDialog } from "./navbar/SearchDialog";
import { ThemeToggle } from "@/components/shared/ThemeToggle";
import { UserDropdown } from "./navbar/UserDropdown";



interface NavbarProps {
  session: Session | null;
}

export function Navbar({ session }: NavbarProps) {
  const role = session?.user?.role;

  return (
    <header className="flex h-14 shrink-0 items-center gap-2 border-b border-border bg-sidebar px-4 md:px-6">
      <MobileSidebarTrigger role={role} />

      <SearchDialog role={role} />

      {/* Spacer */}
      <div className="flex-1" />

      <div className="flex items-center gap-1.5">
        <ThemeToggle />
        <div className="mx-1 h-4 w-px bg-border" aria-hidden="true" />
        <UserDropdown session={session} />
      </div>
    </header>
  );
}
