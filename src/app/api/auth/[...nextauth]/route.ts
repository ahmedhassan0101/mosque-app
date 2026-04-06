// src\app\api\auth\[...nextauth]\route.ts
import { handlers } from "@/lib/auth/options";
/**
 * NextAuth route handlers
 *
 * This handles ALL auth-related routes automatically:
 *
 * Examples:
 * - POST /api/auth/callback/credentials  → login
 * - GET  /api/auth/session              → get session
 * - POST /api/auth/signout              → logout
 *
 * You don't need to manually define them.
 */
export const { GET, POST } = handlers;
