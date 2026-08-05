// app/(dashboard)/layout.tsx

import { auth } from "@/lib/auth/auth";
import { Sidebar } from "@/components/layout/Sidebar";
import { Navbar } from "@/components/layout/Navbar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  const role = session?.user?.role ?? "SUPERVISOR";

  return (
    <div className="grid h-dvh w-full grid-cols-1 lg:grid-cols-[264px_1fr]">
      {/* Sidebar: hidden below md, fixed width above */}

      <Sidebar role={role} className="hidden lg:flex" />

      {/* ── Right column: navbar + scrollable content ──────────── */}
      <div className="flex min-w-0 flex-col overflow-hidden">
        <Navbar session={session} />

        <main
          id="main-content"
          tabIndex={-1}
          className="flex-1 overflow-y-auto scroll-smooth px-4 py-5 md:px-7 md:py-6 focus-visible:outline-none animate-fade-up"
        >
          {children}
        </main>
      </div>
    </div>
  );
}
