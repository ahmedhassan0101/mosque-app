/* eslint-disable @typescript-eslint/no-explicit-any */
import { auth } from "./options";

/**
 * Represents authenticated user context
 */
export interface AuthContext {
  mosqueId: string;
  userId: string;
  role: string;
}

/**
 * Get authenticated user context from NextAuth session
 */
export async function getAuthContext(): Promise<AuthContext> {
  const session = await auth();

  if (!session?.user) {
    const err = new Error("UNAUTHORIZED");
    (err as any).status = 401;
    throw err;
  }

  return {
    mosqueId: session.user.mosqueId,
    userId: session.user.id,
    role: session.user.role,
  };
}

/**
 * Require authenticated user with mosqueId
 */
export async function requireMosque(): Promise<string> {
  const { mosqueId } = await getAuthContext();

  if (!mosqueId) {
    const err = new Error("UNAUTHORIZED");
    (err as any).status = 401;
    throw err;
  }

  return mosqueId;
}

/**
 * Require super admin role
 */
export async function requireSuperAdmin(): Promise<void> {
  const { role } = await getAuthContext();

  if (role !== "superadmin") {
    const err = new Error("FORBIDDEN");
    (err as any).status = 403;
    throw err;
  }
}
