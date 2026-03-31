

import { auth } from "@/lib/auth/options";
import { NextResponse } from "next/server";
import type { NextAuthRequest } from "next-auth";  

/* Public routes that don't require authentication */
const PUBLIC_ROUTES = ["/login", "/register", "/api/auth", "/api/register"];

export default auth(function middleware(req: NextAuthRequest) {
  const { pathname } = req.nextUrl;

  /* Check if the route is public (no auth required) */
  const isPublic = PUBLIC_ROUTES.some((route) => pathname.startsWith(route));

    /* Allow Next.js internals and static assets (no auth needed) */
  const isStatic = /^\/(_next|icons|manifest|favicon)/.test(pathname);
  // const isStatic =
  //   pathname.startsWith("/_next") || // Next.js build files
  //   pathname.startsWith("/icons") || // PWA icons
  //   pathname.startsWith("/manifest"); // PWA manifest

  /* Skip middleware for public and static routes */
  if (isPublic || isStatic) return NextResponse.next(); 


 /* If user is not authenticated, redirect to login */
  if (!req.auth) { // Property 'auth' does not exist on type 'NextRequest'.
    const loginUrl = req.nextUrl.clone();

    loginUrl.pathname = "/login";

    /* Preserve the original destination to redirect after login */
    loginUrl.searchParams.set("callbackUrl", pathname);

    return NextResponse.redirect(loginUrl);
  }

  /* Inject user context into headers for API routes and server usage */
  const response = NextResponse.next();
// error Property 'auth' does not exist on type 'NextRequest'.
  response.headers.set("x-mosque-id", req.auth.user.mosqueId); // Identify tenant (multi-tenancy)
  response.headers.set("x-user-id", req.auth.user.id);         // Identify current user
  response.headers.set("x-user-role", req.auth.user.role);     // Role-based access control

  return response;
});

/* Apply middleware to all routes except static assets */
export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
