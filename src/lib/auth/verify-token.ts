// src/lib/auth/verify-token.ts
import crypto from "crypto";

/**
 * Generates a cryptographically secure UUID token for email verification.
 * @returns A UUID v4 token string (e.g., "a3bb189e-8bf9-3888-9912-ace4e6543002")
 */
export function generateVerifyToken(): string {
  return crypto.randomUUID();
}

/**
 * Calculates the token expiry date.
 * @param hours - Number of hours until expiry (default: 24)
 * @returns A Date object representing the expiry time
 */
export function generateVerifyTokenExpiry(hours = 24): Date {
  return new Date(Date.now() + hours * 60 * 60 * 1000);
}
