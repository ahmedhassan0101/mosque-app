// src\proxy.ts
// import NextAuth from "next-auth";
// import { NextResponse } from "next/server";
// import { authConfig } from "./lib/auth/config";

/**
 * Initialize NextAuth middleware wrapper
 * This attaches `req.auth` automatically
 */
// const { auth } = NextAuth(authConfig);

// export default auth;

/**
 * Public routes that do NOT require authentication
 */
// Note: These should match the routes defined in authConfig callbacks for consistency
// const PUBLIC_ROUTES = ["/login", "/register", "/api/auth", "/api/register"];

/**
 * Main proxy (middleware replacement)
 * Runs before every request
 */
// export default auth((req) => {
//   const { nextUrl } = req;

//   // Check if user is logged in
//   const isLoggedIn = !!req.auth;

//   // Check if route is public
//   const isPublic = PUBLIC_ROUTES.some((route) =>
//     nextUrl.pathname.startsWith(route),
//   );

//   // Ignore static files
//   const isStatic = /^\/(_next|icons|manifest|favicon)/.test(nextUrl.pathname);

//   // Allow public/static routes
//   if (isPublic || isStatic) return NextResponse.next();

//   // If not logged in → redirect to login page
//   if (!isLoggedIn) {
//     const loginUrl = nextUrl.clone();
//     loginUrl.pathname = "/login";
//     loginUrl.searchParams.set("callbackUrl", nextUrl.pathname);
//     return NextResponse.redirect(loginUrl);
//   }

//   /**
//    * Continue request and inject secure headers
//    */
//   const response = NextResponse.next();

//   return response;
// });

/**
 * Apply middleware to all routes except static assets
 */
// export const config = {
//   matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
// };
export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|icons|manifest).*)"],
};

