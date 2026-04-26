// src\proxy.ts
import NextAuth from "next-auth";
import { NextResponse } from "next/server";
import { authConfig } from "./lib/auth/auth.config";

const { auth } = NextAuth(authConfig);

// const PUBLIC_ROUTES = [
//   "/",
//   "/login",
//   "/register",
//   "/forgot-password",
//   "/reset-password",
//   "/verify-email",
//   "/waiting-verification",
// ];
// const AUTH_ROUTES = ["/login", "/register"];
// const ONBOARDING_ROUTE = "/onboarding";
// const DASHBOARD_PREFIX = "/dashboard";
// const VERIFY_ROUTES = ["/verify-email", "/waiting-verification"];
const PUBLIC_ROUTES = ["/"]; // الصفحة الرئيسية فقط
const AUTH_ROUTES = [
  "/login",
  "/register",
  "/forgot-password",
  "/reset-password",
];
const ONBOARDING_ROUTE = "/onboarding";
const DASHBOARD_PREFIX = "/dashboard";
const VERIFY_ROUTES = ["/verify-email", "/waiting-verification"];
/**
 * Gatekeeper middleware — handles routing logic based on session state.
 * Written as a manual wrapper (NOT `export default auth()`) to allow
 * future i18n prefix routing, multi-tenant subdomain support, etc.
 */
export default auth(async (req) => {
  // const session = await auth();
  const { pathname } = req.nextUrl;

  const isLoggedIn = !!req.auth;
  const hasMosque = !!req.auth?.user?.mosqueId;
  const isEmailVerified = !!req.auth?.user?.emailVerified;

  const isPublic = PUBLIC_ROUTES.includes(pathname);
  const isAuthRoute = AUTH_ROUTES.some((r) => pathname.startsWith(r));
  const isOnboarding = pathname.startsWith(ONBOARDING_ROUTE);
  const isDashboard = pathname.startsWith(DASHBOARD_PREFIX);
  const isVerifyRoute = VERIFY_ROUTES.some((r) => pathname.startsWith(r));

  // 0. Verification pages are always accessible
  // if (isVerifyRoute) return NextResponse.next();

  // 1. Unauthenticated user trying to access protected route
  if (!isLoggedIn && !isPublic && !isAuthRoute && !isVerifyRoute) {
    console.log("🚀 ~ Unauthenticated access to:", pathname);
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // // 2. Authenticated without mosque → force to onboarding
  // if (isLoggedIn && !hasMosque && isDashboard) {
  //   return NextResponse.redirect(new URL(ONBOARDING_ROUTE, req.url));
  // }

  // 2. Authenticated but email NOT verified → redirect to waiting page
  //    (applies to all protected routes except verify pages)
  if (isLoggedIn && !isEmailVerified && (isDashboard || isOnboarding)) {
    console.log("🚀 ~ Unverified email access to:", pathname);
    return NextResponse.redirect(new URL("/waiting-verification", req.url));
  }

  // 3. Authenticated, verified, without mosque → force to onboarding
  if (isLoggedIn && isEmailVerified && !hasMosque && isDashboard) {
    console.log(
      "🚀 ~ Authenticated, verified, without mosque access to:",
      pathname,
    );
    return NextResponse.redirect(new URL(ONBOARDING_ROUTE, req.url));
  }

  // 4. Authenticated with mosque → cannot visit onboarding
  if (
    isLoggedIn &&
    isEmailVerified &&
    hasMosque &&
    (isOnboarding || isVerifyRoute)
  ) {
    console.log("🚀 ~ Authenticated with mosque access to:", pathname);
    return NextResponse.redirect(new URL(DASHBOARD_PREFIX, req.url));
  }

  // 5. Already logged-in + verified user visiting auth pages → redirect away
  if (isLoggedIn && isEmailVerified && isAuthRoute) {
    const dest = hasMosque ? DASHBOARD_PREFIX : ONBOARDING_ROUTE;
    console.log("🚀 ~ Redirecting to:", dest);
    return NextResponse.redirect(new URL(dest, req.url));
  }

  // 6. Logged-in but unverified user visiting auth pages → waiting page
  if (isLoggedIn && !isEmailVerified && isAuthRoute) {
    console.log("🚀 ~ Redirecting to waiting verification page");
    return NextResponse.redirect(new URL("/waiting-verification", req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
