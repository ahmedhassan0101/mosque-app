import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { auth } from "@/lib/auth/options";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session || !session.user) redirect("/login");

  return (
    <div className="flex min-h-screen bg-mosque-bg">
      <Sidebar />
      <div className="flex-1 mr-64 flex flex-col">
        {/* */}
        <Header user={session.user} />
        <main className="flex-1 p-6 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
