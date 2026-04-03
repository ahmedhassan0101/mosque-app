import { headers } from "next/headers";

export interface RequestContext {
  mosqueId: string;
  userId:   string;
  role:     string;
}

export async function getContext(): Promise<RequestContext> {
  const h = await headers();
  return {
    mosqueId: h.get("x-mosque-id") ?? "",
    userId:   h.get("x-user-id")   ?? "",
    role:     h.get("x-user-role") ?? "",
  };
}

export async function requireMosque(): Promise<string> {
  const { mosqueId } = await getContext();
  if (!mosqueId) throw new Error("UNAUTHORIZED");
  return mosqueId;
}

export async function requireSuperAdmin(): Promise<void> {
  const { role } = await getContext();
  if (role !== "superadmin") throw new Error("FORBIDDEN");
}
