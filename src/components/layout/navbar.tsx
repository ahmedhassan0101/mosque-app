import { ThemeToggle } from "./theme-toggle";
import { MobileSidebarTrigger } from "./mobile-sidebar-trigger";
import NavbarSearch from "./navbar-search";
import Notifications from "./notifications";
import UserDropdown from "./user-dropdown";

/**
 * Navbar is the top header for the dashboard layout.
 *
 * Contains:
 * - Mobile sidebar trigger (visible only on small screens)
 * - Global search trigger
 * - Notification bell with badge
 * - Theme toggle
 * - User profile dropdown
 *
 * NOTE: This is a Server Component. Interactive sub-parts
 * (ThemeToggle, MobileSidebarTrigger) are extracted as Client Components.
 */
export function Navbar() {
  return (
    <header className="shrink-0 sticky top-0 z-40 flex h-20 items-center gap-3 border-b border-border bg-background/80 px-4 backdrop-blur-sm md:px-6">
      {/* ── Mobile menu trigger (RTL: right side) ── */}
      <MobileSidebarTrigger />
      {/* ── Page title area (flexible) ── */}
      <div className="flex-1">
        <h1 className="text-sm font-semibold text-foreground hidden sm:block">
          لوحة التحكم
        </h1>
      </div>
      {/* ── Actions (left side in RTL = end) ── */}
      <div className="flex items-center gap-1">
        {/* Search */}
        <NavbarSearch />

        {/* Notifications */}
        <Notifications />

        {/* Theme toggle */}
        <ThemeToggle />

        {/* Separator */}
        <div className="mx-1 h-5 w-px bg-border" />

        {/* User profile dropdown */}
        <UserDropdown />
      </div>
    </header>
  );
}
