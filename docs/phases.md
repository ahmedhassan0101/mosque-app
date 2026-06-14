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

## Role: Tech Lead Code Review

Great effort on the Auth and Middleware logic, but during code review and running the application on Next.js 16.2.1, I noticed several critical architectural flaws, Edge Runtime errors, and unoptimized repetitive code.

Please address the following points and provide the refactored code:

## 1. Next.js 16 Proxy Convention & Edge Runtime Crash

- **Error:** `The edge runtime does not support Node.js 'stream' module` and `The "middleware" file convention is deprecated. Please use "proxy" instead.`
- **Task:** Next.js 16 deprecated `middleware.ts`. Rewrite the middleware logic using the new `proxy.ts` file convention.
- **CRITICAL FIX:** Inside `proxy.ts`, you MUST use "Approach Two" from Auth.js docs (using `authConfig` wrapper) to avoid pulling Node.js dependencies (Mongoose via `auth.ts`) into the Edge runtime. Do NOT import `auth.ts` inside `proxy.ts`.
  - Use this pattern:
    `import { authConfig } from "./auth.config";`
    `const { auth } = NextAuth(authConfig);`
    `export default auth((req) => { ...routing logic... });`

## 2. Client-Side Routing Bug (`window.location.href`)

- **Error:** In `LoginForm`, `RegisterForm`, `JoinMosqueForm`, and `CreateMosqueForm`, you used `window.location.href = "/dashboard"`, which throws `Error: This value cannot be modified` during React strict mode rendering.
- **Task:** Refactor all these form components to use Next.js `useRouter` from `next/navigation`. Use `router.push('/dashboard')` and `router.refresh()` instead of modifying the window object directly. Also, remove any unused variables (like the unused `router` in `RegisterForm`).

## 3. Zod Error Typing (`TS2339`)

- **Error:** In your server actions, `parsed.error.errors[0].message` throws an error because `errors` does not exist directly on the `ZodError` object.
- **Task:** Refactor all Zod error extractions in server actions to use `parsed.error.issues[0].message` or `.flatten().fieldErrors`.

## 4. DRY Principle: JSend Action Responses

- **Issue:** You are manually writing `{ status: "success", data, message }` in every server action.
- **Task:** Create a central utility file (e.g., `lib/response-utils.ts`) with helper functions: `successResponse(data?, message?)`, `failResponse(message)`, and `errorResponse(message)`. Refactor all server actions to use these helpers instead of raw objects.

## 5. Missing UI for Password Reset

- **Issue:** You wrote the `requestPasswordReset` and `resetPassword` server actions, but forgot to implement the UI components.
- **Task:** Provide the React components for:
  - `ForgotPasswordForm` (collects email and calls the action).
  - `ResetPasswordForm` (reads the token from the URL, collects new password, and calls the action).

**Output:** Provide the fully corrected `proxy.ts`, the new `lib/response-utils.ts`, the corrected server actions, and the updated/new UI Form components. Ensure no TypeScript errors persist.

## Role: Tech Lead / Architectural Review

Hello! I have tested the authentication, onboarding, and middleware logic you built. The overall structure is looking solid, but during runtime and code review, I encountered several specific errors and architectural friction points.

Instead of me dictating the fixes, I want to present these issues to you. Please analyze them, think step-by-step about the best approach considering the architecture you've built, and then propose the optimal refactoring.

Great effort on the Auth and Middleware logic, but during code review and running the application on Next.js 16.2.1, I noticed several critical architectural flaws, Edge Runtime errors, and unoptimized repetitive code.

Please address the following points and provide the refactored code:

Here is the detailed report of the issues:

### 1. Next.js 16 Middleware Deprecation & Edge Runtime Crash

**The Errors:**

- `The "middleware" file convention is deprecated. Please use "proxy" instead.`
- `Both the middleware file "./src/middleware.ts" and the proxy file "./src/proxy.ts" are detected.`
- `Error: The edge runtime does not support Node.js 'stream' module.` (This crashed the app completely).
**My thoughts:** We are on Next.js 16, which uses `proxy.ts`. Also, it seems our NextAuth implementation is leaking Node.js dependencies (like Mongoose) into the Edge runtime through the proxy. How should we restructure `proxy.ts` and our Auth configuration to cleanly separate Edge logic from Node logic?

### 2. Client-Side Routing in React Strict Mode

**The Error:** `Error: This value cannot be modified` pointing to `window.location.href = "/dashboard";` in `LoginForm`, `CreateMosqueForm`, and `JoinMosqueForm`.
**My thoughts:** Directly mutating `window.location.href` inside a React component's `onSubmit` seems to clash with Next.js App Router and React strict mode. Also, I noticed in `RegisterForm`, `useRouter` is declared but never used. What is the Next.js best practice for client-side navigation after a server action mutation?

### 3. Missing `<SessionProvider />` Context

**The Error:** `[next-auth]: useSession must be wrapped in a <SessionProvider /> at UserDropdown`
**My thoughts:** The `UserDropdown` component uses `useSession`, but we haven't wrapped our app or layout in a provider. In the App Router context, where is the most optimal place to inject this provider without unnecessarily turning entire layouts into Client Components?

### 4. Zod Error Typing (`TS2339`)

**The Error:** `Property 'errors' does not exist on type 'ZodError<...>'` occurring at `parsed.error.errors[0].message` in the Server Actions.
**My thoughts:** It seems we are accessing the Zod error object incorrectly. How should we accurately extract the first error message from Zod's safeParse result?

### 5. DRY Principle / JSend Boilerplate in Server Actions

**The Issue:** In every server action, we are manually typing out the return objects: `{ status: "success", data, message }` or `{ status: "error", message: "..." }`.
**My thoughts:** This feels repetitive and prone to typos. Can we create a centralized utility or class to standardize these responses across all our actions?

### 6. Separation of Concerns (UI vs. Logic)

**The Issue:** We have data fetching/mutating logic inside the `onSubmit` handlers of our Client Components, but our `SettingsPage` (Server Component) handles data fetching directly.
**My thoughts:** Given your current architecture, is having the `onSubmit` act as a bridge to Server Actions the best pattern? Please briefly evaluate if this is optimal or if we should tweak it.

### 6. Data Access Layer & Serialization Logic (Clean Code)

**The Issue:** In the current SettingsPage, the data fetching and serialization (mapping MongoDB _id to string, etc.) are written directly inside the Server Component.
**My thoughts:** I want to move towards a more decoupled architecture. Instead of having the logic inside the component, I'm considering creating dedicated data fetching functions (e.g., getMosqueSettingsData()) that handle the DB connection, fetching, and serialization, then returning clean, plain objects to the component.
**Question for you: >**

- Is it better to keep the SettingsPage as a thin wrapper that calls these functions?

Regarding the onSubmit in Client Components (like `CreateMosqueForm`): is the current approach of handling toasts, sessions, and redirects within the component optimal, or should we offload more of that logic to keep the UI components focused only on rendering? Please provide a pattern that balances "Clean Code" with Next.js 16 best practices.

### 7. Missing UI Components

**The Issue:** You built excellent Server Actions for `requestPasswordReset` and `resetPassword`, but the UI components for them (the forms/pages) were not generated.

---

### Your Task

1. **Analyze:** Take a moment to think out loud about each point. Discuss the pros and cons of potential solutions based on our stack (Next.js 16 App Router, Auth.js v5, Mongoose).
2. **Refactor:** After your analysis, provide the corrected and refactored code files (e.g., `proxy.ts`, updated Form components, new utility files, layout updates, and the missing password reset UI).

--------------------------------

# Role

You are an elite UX/UI Designer and a Senior Next.js/React Frontend Engineer specializing in Framer Motion, Tailwind CSS, and Shadcn UI. You are known for creating peerless, high-converting, and emotionally resonant SaaS landing pages with modern, calm, and highly polished aesthetics.

# Task

Build a breathtaking landing page (`/app/page.tsx`) for a free ERP/SaaS platform designed specifically for Mosques, Quran Memorization Centers, and Islamic Educational Institutions. The goal is to convince institution managers to abandon chaotic paper/spreadsheet management and adopt this modern, streamlined system. 

# Context & Vibe
Project Name: The platform is named "Masjid ERP". Use this name in the Navbar logo and throughout the copywriting where appropriate to build brand identity.
- The target audience includes educators, youth mentors, and administrators. 
- The tone should be highly professional, eloquent (Classical Arabic influence but accessible), and emotionally engaging. 
- The UI must have a "Calm & Modern Islamic" aesthetic. DO NOT use heavy, outdated, or clunky traditional patterns. Instead, use subtle glassmorphism, glowing gradients (calm emeralds, deep blues, or soft golds), and ultra-smooth animations. It should look like an elite tech product (e.g., Vercel, Linear) but with a subtle spiritual/educational soul.

# Strict Constraints
1. **Layout & Direction:** Must be strictly RTL (Right-to-Left) with `dir="rtl"`.
2. **Tech Stack:** Next.js (App Router), Tailwind CSS, Framer Motion (crucial for scroll animations and floating effects), `lucide-react` for icons, and Shadcn UI components.
3. **Themes:** Full support for Dark and Light modes using standard Tailwind `dark:` classes or CSS variables.
4. **Code Completeness:** Provide a complete, single-file representation (or break down components logically) that I can copy-paste. Include all necessary Framer Motion variants.
5. **Aesthetics:** Use a calm, modern aesthetic. Avoid aggressive colors. 
6. **Advanced Animation:** For the "Inside the System" tabbed interface, you MUST use Framer Motion’s layoutId prop. This should create a seamless, fluid transition (magic motion) when switching between tabs, making the UI feel ultra-fast, premium, and deeply integrated.

# Page Anatomy (Implement these sections):
1. **Navbar (Transparent to Solid on scroll):** Logo, "المميزات", "لمن هذا النظام؟", and Login/Register buttons.
2. **Hero Section:** - Headline: "تفرغ لرسالتك.. ودع لنا عبء الإدارة." (Focus on your mission.. leave the management to us).
   - Sub-headline: The ultimate cloud platform for managing educational centers.
   - CTA Buttons.
   - A floating, 3D-angled mock-up graphic (use an elegant placeholder `div` with glassmorphism) to represent the dashboard. Animate this with Framer Motion floating effect.
3. **Features (Bento Grid):** Use a modern asymmetrical Bento Grid layout to display 3-4 features (e.g., Automated Financial Tracking, Student Gamification/Incentive Systems, Progress Dashboards).

4. **Platform Preview (Dashboard Show):** Create a high-end section called "Inside the System". Use a "Scroll-Driven Carousel" or a "Tabbed Interface" to showcase different views (e.g., Student Progress View, Financial Dashboard, Attendance Sheet). Use stylized mockups with glassmorphism, subtle shadows, and glowing borders. Each view should have a brief caption explaining its benefit.

5. **Pain vs. Solution:** A visually striking section comparing the old way (scattered papers) to the new way (one unified, calm dashboard).
6. **Bottom CTA:** A beautiful gradient background section urging them to start for free.
6. **Dashboard Showcase:** A tabbed interface showing "Management View", "Student View", and "Financial View" with elegant UI mockups.
7. **Trust & Values Section:** A brief, soul-touching area about the mission of supporting Quran memorization through technology.
8. **FAQ Section:** Simple accordion-style FAQ to address security and ease of use.

# Arabic Copywriting
Provide highly persuasive, grammatically flawless Arabic text for all placeholders. The language should reflect deep understanding of their needs (tracking attendance, rewarding students, generating quick reports).

Think deeply before coding. Plan the Framer Motion choreographies (staggered children, fade-in-up) to ensure the first impression is absolute perfection.