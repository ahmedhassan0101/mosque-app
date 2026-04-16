# Role

You are a Lead Full-Stack Next.js 15 Engineer and Web Security Expert, and UI/UX Expert. You specialize in NextAuth (Auth.js v5), Middleware routing, Multi-tenant SaaS architectures, MongoDB (Mongoose), and modular UI using Tailwind + Shadcn UI.

## Task

Build a comprehensive, highly secure, and modular Authentication and Onboarding flow for a Multi-tenant Next.js application ("Masjid ERP"). Focus heavily on solid logic, Edge-compatible Middleware, reusable UI components, and standardized error handling. The system must isolate tenants strictly, handle role-based access, and forcefully route users based on their session and onboarding state.

## Context & Stack

- **Frameworks:** Next.js 15 (App Router), NextAuth (Credentials & Google Providers), MongoDB (Mongoose), Resend (Emails).
- **Architecture:** Multi-tenant (Mosques). Users belong to one Mosque.
- **UI:** Shadcn UI. Form handling MUST use `react-hook-form` + `@hookform/resolvers/zod`.
- **Architecture:** Strictly separate Auth.js config to support Edge Middleware (e.g., `auth.config.ts` for Edge, `auth.ts` for Node/DB).
- **Roles:** `SUPER_ADMIN` (access all), `ADMIN` (creates mosque, manages finances/users), `SUPERVISOR` (limited access, joins via invite).
- **Core Models needed:**
  1. `User` (name, email, password, role, provider, mosqueId [ref], resetTokens, etc.)
  2. `Mosque` (name, address, phone, inviteCode [unique]).
- Use Next.js Server Actions for mutations (Signup, Onboarding, Reset Password). DO NOT use Axios.
- Standardize all Server Action returns and Route Handlers using a JSend-like protocol: `{ status: "success"|"fail"|"error", data?: any, message?: string }`.
- **The Flow:**
  - Unauthenticated -> Redirected to `/login`.
  - Authenticated but `mosqueId` is null -> Force redirected to `/onboarding` (Cannot access dashboard).
  - Authenticated and `mosqueId` exists -> Redirected to `/dashboard` (Cannot access login/register/onboarding).
- **Database:** Create a robust, cached `lib/db.ts` for Mongoose connections.
- **Server Actions vs APIs:** Use NextAuth Route Handlers for auth logic, but strictly use Next.js **Server Actions** for form mutations (Onboarding, sending invites, password resets).
- **Tenant Management (Settings Page):**
  - A settings page (`/dashboard/settings`) restricted to `ADMIN`.
  - Must include tabs/sections for: Mosque Details (update info), User Management (display users, change roles, remove users), and Invites (generate one-time or time-limited invite codes).

## Execution Steps & Reasoning

1. **DB & Models:** Create `lib/db.ts`. Define `User` and `Mosque` Define Mongoose schemas with proper relational references, indexing, `pre-save` hooks for bcrypt hashing, and `toJSON` transforms to hide passwords and standardizing `_id` to `id`.
2. **NextAuth Setup (Edge Compatible):**
   - Create `auth.config.ts` (Providers, Edge callbacks).
   - Create `auth.ts` (Mongoose adapter, exporting handlers).
   - Augment standard Session/JWT types to include `id`, `role`, and `mosqueId`.
3. **NextAuth Configuration:** Setup NextAuth with JWT strategy. Inject `id`, `role`, and `mosqueId` into the JWT token and Session object so the Edge Middleware can read them without querying the DB.
4. **The Gatekeeper Flexible Middleware:** Create a robust `middleware.ts` using the standard `export async function middleware(req)` approach (DO NOT use `export default auth()`). Inside it, manually resolve the session to allow future i18n/wildcard logic, then implement the strict routing flow.
5. **Reusable UI & Forms:**
   - Build the Registration, Onboarding, and **Settings Dashboard** UI components using this reusable input and Zod validation.
   - Build the Registration and Onboarding UI components using this reusable input, Zod validation, and connecting them to Server Actions.
6. **Server Actions:** Write secure server actions for Onboarding, Password Resets, and Joining via Invite. Always return the JSend structured object.
7. **Server Actions (Business Logic):** Provide server actions for:
   - `onboardMosque(data)`: Creates Mosque, updates User's `mosqueId` and sets role to `ADMIN`.
   - `requestPasswordReset(email)`: Generates secure token, saves to DB, triggers Resend email.
   - `resetPassword(token, newPassword)`: Validates and updates.
   - `joinViaInvite(code)`: Updates a new user's `mosqueId` based on the invite code.
   - `updateMosqueSettings(data)` (Requires ADMIN role check)
   - `manageTenantUsers({ action: 'remove'|'updateRole', userId, newRole? })` (Requires ADMIN role check)
   - `generateInviteCode()`
8. **Testing Checklist:** Output a comprehensive manual testing checklist.
9. "Integrate the new Auth logic into the existing UI: implement the logout functionality in the Navbar, populate the UserDropdown with real session data (Name, Email, Google Image), and ensure the 'Settings' and 'Profile' links in the dropdown correctly route to the new management pages."

10. "Integrate the new Auth logic into the existing UI: implement the logout functionality in the Navbar, populate the UserDropdown with real session data (Name, Email, Google Image), and ensure the 'Settings' and 'Profile' links in the dropdown correctly route to the new management pages."

## Stop Conditions

- Do NOT use Axios.
- Do NOT put Node.js dependent code (like Mongoose) inside `auth.config.ts` or `middleware.ts`.
- Do NOT write basic HTML inputs; you MUST use the reusable Shadcn Form structure.
- Do NOT use generic mock data; write production-ready, defensively programmed code.
- Do NOT put Mongoose models and NextAuth logic in the same file. Separate concerns.
- Do NOT forget to type the NextAuth Session/JWT using TypeScript module augmentation to include `mosqueId` and `role`.
- Validate authorizations inside every Server Action (e.g., check if the user requesting a role change is actually an ADMIN for that specific mosqueId).

## Output Format

Present code logically separated by files. Provide the DB Connection, Models, Auth Config, Middleware, Server Actions, and the Reusable Form Component. End with a short Manual Testing Checklist.

-----------------------------------------------
