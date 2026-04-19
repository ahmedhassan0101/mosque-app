// /**
//  * @file proxy.ts
//  * @description Next.js 16 Edge proxy (replaces middleware.ts).
//  * ⚠️  Edge Runtime ONLY — no Node.js modules, no Mongoose, no bcrypt.
//  *     Only imports from auth.config (Edge-safe) to avoid stream/crypto crashes.
//  */

// import NextAuth from "next-auth";
// import { authConfig } from "./lib/auth/auth.config";

// /**
//  * Instantiate a minimal, Edge-compatible Auth.js handler
//  * using only the authConfig (no DB callbacks).
//  */
// const { auth } = NextAuth(authConfig);

// /**
//  * Proxy handler — wraps the Edge-safe auth check.
//  * We use an explicit wrapper (not `export default auth`) to leave room
//  * for future multi-tenant subdomain routing and i18n logic.
//  */

// // eslint-disable-next-line @typescript-eslint/no-unused-vars
// export default auth((req) => {
//   // Future: add subdomain / i18n routing logic here
//   // The route protection itself is handled in authConfig.callbacks.authorized
// });

// export const config = {
//   /**
//    * Matcher: run proxy on all routes EXCEPT:
//    * - Next.js internals (_next/*)
//    * - Static files (images, fonts, favicon, etc.)
//    * - API auth routes (handled by Node.js runtime route handler)
//    */
//   matcher: [
//     "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
//   ],
// };

// import { auth } from "@/lib/auth/auth.config";
import NextAuth from "next-auth";
import { NextResponse } from "next/server";
import { authConfig } from "./lib/auth/auth.config";

const { auth } = NextAuth(authConfig);

const PUBLIC_ROUTES = [
  "/",
  "/login",
  "/register",
  "/forgot-password",
  "/reset-password",
];
const AUTH_ROUTES = ["/login", "/register"];
const ONBOARDING_ROUTE = "/onboarding";
const DASHBOARD_PREFIX = "/dashboard";

/**
 * Gatekeeper middleware — handles routing logic based on session state.
 * Written as a manual wrapper (NOT `export default auth()`) to allow
 * future i18n prefix routing, multi-tenant subdomain support, etc.
 */
export default auth(async (req) => {
  // const session = await auth();
  const { pathname } = req.nextUrl;

  const isLoggedIn = !!req.auth; // req.auth أصبح متاحاً بفضل تغليف الميدل وير بـ auth
  const hasMosque = !!req.auth?.user?.mosqueId;

  // const isLoggedIn = !!session?.user;
  // const hasMosque = !!session?.user?.mosqueId;

  const isPublic = PUBLIC_ROUTES.includes(pathname);
  const isAuthRoute = AUTH_ROUTES.includes(pathname);
  const isOnboarding = pathname.startsWith(ONBOARDING_ROUTE);
  const isDashboard = pathname.startsWith(DASHBOARD_PREFIX);

  // 1. Unauthenticated user trying to access protected route
  if (!isLoggedIn && !isPublic && !isAuthRoute) {
    console.log(
      `[Auth Proxy] Unauthenticated access to ${pathname} — redirecting to login`,
    );
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 2. Authenticated without mosque → force to onboarding
  if (isLoggedIn && !hasMosque && isDashboard) {
    return NextResponse.redirect(new URL(ONBOARDING_ROUTE, req.url));
  }

  // 3. Authenticated with mosque → cannot visit onboarding
  if (isLoggedIn && hasMosque && isOnboarding) {
    return NextResponse.redirect(new URL(DASHBOARD_PREFIX, req.url));
  }

  // 4. Already logged-in user visiting auth pages → redirect away
  if (isLoggedIn && isAuthRoute) {
    const dest = hasMosque ? DASHBOARD_PREFIX : ONBOARDING_ROUTE;
    return NextResponse.redirect(new URL(dest, req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
