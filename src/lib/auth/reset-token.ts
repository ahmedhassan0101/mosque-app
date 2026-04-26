// src\lib\auth\reset-token.ts
import crypto from "crypto";

/**
 * Generate a secure random token for password reset.
 * Returns: { token (plain, sent in email), hash (stored in DB) }
 *
 * We store only the hash in DB — same principle as password hashing.
 * The plain token lives only in the email link.
 */
export function generateResetToken(): { token: string; hash: string } {
  const token = crypto.randomBytes(32).toString("hex");
  const hash  = crypto.createHash("sha256").update(token).digest("hex");
  return { token, hash };
}

export function hashToken(token: string): string {
  return crypto.createHash("sha256").update(token).digest("hex");
}

export const RESET_TOKEN_EXPIRES_HOURS = 1;