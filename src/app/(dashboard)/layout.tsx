// app/(dashboard)/layout.tsx
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth/auth";
import { connectDB } from "@/lib/db/db";
import { User } from "@/models/user.model";
import { Sidebar } from "@/components/layout/sidebar";
import { Navbar } from "@/components/layout/navbar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (session?.user?.id) {
    await connectDB();
    const dbUser = await User.findById(session.user.id).select("mosqueId");
    if (!dbUser?.mosqueId) redirect("/onboarding");
  }

  const userRole = session?.user?.role ?? "SUPERVISOR";
  return (

    <div className="flex h-dvh w-full overflow-hidden bg-background">
      {/* Sidebar: hidden below md, fixed width above */}
      <Sidebar role={userRole} className="hidden md:flex" />

      {/* Right column: navbar + scrollable page */}
      <div className="flex flex-1 flex-col min-w-0 overflow-hidden">
        <Navbar session={session} />
        <main
          id="main-content"
          tabIndex={-1}
          className="flex-1 overflow-y-auto scroll-smooth
                     px-4 py-5 md:px-7 md:py-6
                     focus-visible:outline-none animate-fade-up"
        >
          {children}
        </main>
      </div>
    </div>
  );
}
