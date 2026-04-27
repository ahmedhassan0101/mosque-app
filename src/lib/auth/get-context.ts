// src\lib\auth\get-context.ts

import { redirect } from "next/navigation";
import { auth } from "./auth";

export async function getMosqueId(): Promise<string> {
  const session = await auth();
  const mosqueId = session?.user?.mosqueId;
  if (!mosqueId) redirect("/login");
  return mosqueId;
}

export async function getSessionContext() {
  const session = await auth();
  if (!session?.user?.mosqueId) redirect("/login");
  return {
    mosqueId: session.user.mosqueId,
    user: session.user,
  };
}

export async function requireSuperAdmin(): Promise<void> {
  const session = await auth();
  if (session?.user?.role !== "SUPER_ADMIN") throw new Error("FORBIDDEN");
}
