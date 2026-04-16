// import { Sidebar } from "@/components/layout/sidebar";
// import { Header } from "@/components/layout/Header";
// import { auth } from "@/lib/auth/options";
// import { redirect } from "next/navigation";

// export default async function DashboardLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   const session = await auth();
//   if (!session || !session.user) redirect("/login");

//   return (
//     <div className="flex min-h-screen bg-mosque-bg">
//       <Sidebar />
//       <div className="flex-1 mr-64 flex flex-col">
//         {/* */}
//         <Header user={session.user} />
//         <main className="flex-1 p-6 overflow-auto">{children}</main>
//       </div>
//     </div>
//   );
// }

// import { Sidebar } from "@/components/layout/sidebar";
import { Navbar } from "@/components/layout/navbar";
import { Sidebar } from "@/components/layout/sidebar";

/**
 * DashboardLayout wraps all protected dashboard routes.
 *
 * Structure:
 * ┌──────────┬─────────────────────────┐
 * │          │      Navbar             │  ← sticky top
 * │ Sidebar  ├─────────────────────────┤
 * │ (fixed)  │      <children />       │  ← scrollable main
 * │          │                         │
 * └──────────┴─────────────────────────┘
 *
 * RTL: Sidebar is on the RIGHT, content flows LEFT.
 * On mobile: Sidebar is hidden and accessible via Sheet overlay.
 */
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen w-full bg-background overflow-hidden">
      {/* ── Sidebar (hidden on mobile, shown md+) ── */}
      <div className="hidden md:block shrink-0">
        <Sidebar />
      </div>

      {/* ── Main area ── */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <Navbar />

        {/* ── Scrollable page content ── */}
        <main
          id="main-content"
          className="flex-1 overflow-y-auto p-4 md:p-6 animate-fade-up"
        >
          {children}
        </main>
      </div>
    </div>
  );
}
