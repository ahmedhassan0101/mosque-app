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
    <div className="grid h-dvh w-full grid-cols-1 xl:grid-cols-[var(--sidebar-width)_1fr]">
      <Sidebar role={role} className="hidden xl:flex" />

      <div className="flex min-w-0 flex-col overflow-hidden">
        <Navbar session={session} />

        <main
          id="main-content"
          tabIndex={-1}
          className="page-x-padding flex-1 overflow-y-auto scroll-smooth py-5 md:py-6 focus-visible:outline-none animate-fade-up"
        >
          {children}
        </main>
      </div>
    </div>
  );
}
