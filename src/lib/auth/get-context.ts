// src\lib\auth\get-context.ts
import { headers } from "next/headers";

export interface RequestContext {
  mosqueId: string; // Current tenant (multi-tenancy support)
  userId: string; // Authenticated user ID
  role: string; // User role (e.g., "admin", "superadmin")
}

/**
 * Extracts authentication and tenancy data from request headers.
 *
 * @returns {Promise<RequestContext>} The current request context
 *
 * NOTE:
 * - These headers must be set earlier in the request lifecycle (middleware/proxy).
 * - If not set, empty strings will be returned.
 */
export async function getContext(): Promise<RequestContext> {
  const h = await headers();
  return {
    mosqueId: h.get("x-mosque-id") ?? "",
    userId: h.get("x-user-id") ?? "",
    role: h.get("x-user-role") ?? "",
  };
}

/**
 * Ensures the request is associated with a valid mosque.
 *
 * @throws Error("UNAUTHORIZED") if mosqueId is missing
 * @returns {Promise<string>} mosqueId
 */
export async function requireMosque(): Promise<string> {
  const { mosqueId } = await getContext();
  if (!mosqueId) throw new Error("UNAUTHORIZED");
  return mosqueId;
}

/**
 * Ensures the user has super admin privileges.
 *
 * @throws Error("FORBIDDEN") if user is not a superadmin
 */
export async function requireSuperAdmin(): Promise<void> {
  const { role } = await getContext();
  if (role !== "superadmin") throw new Error("FORBIDDEN");
}
