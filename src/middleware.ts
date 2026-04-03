/* eslint-disable @typescript-eslint/no-explicit-any */
// import { auth } from "@/lib/auth/options";
// import { NextResponse } from "next/server";
// import type { NextAuthRequest } from "next-auth";

// /* Public routes that don't require authentication */
// const PUBLIC_ROUTES = ["/login", "/register", "/api/auth", "/api/register"];

// export default auth(function middleware(req: NextAuthRequest) {
//   const { pathname } = req.nextUrl;

//   /* Check if the route is public (no auth required) */
//   const isPublic = PUBLIC_ROUTES.some((route) => pathname.startsWith(route));

//   /* Allow Next.js internals and static assets (no auth needed) */
//   const isStatic = /^\/(_next|icons|manifest|favicon)/.test(pathname);
//   // const isStatic =
//   //   pathname.startsWith("/_next") || // Next.js build files
//   //   pathname.startsWith("/icons") || // PWA icons
//   //   pathname.startsWith("/manifest"); // PWA manifest

//   /* Skip middleware for public and static routes */
//   if (isPublic || isStatic) return NextResponse.next();

//   /* If user is not authenticated, redirect to login */
//   if (!req.auth) {
//     // Property 'auth' does not exist on type 'NextRequest'.
//     const loginUrl = req.nextUrl.clone();

//     loginUrl.pathname = "/login";

//     /* Preserve the original destination to redirect after login */
//     loginUrl.searchParams.set("callbackUrl", pathname);

//     return NextResponse.redirect(loginUrl);
//   }

//   /* Inject user context into headers for API routes and server usage */
//   const response = NextResponse.next();
//   // error Property 'auth' does not exist on type 'NextRequest'.
//   response.headers.set("x-mosque-id", req.auth.user.mosqueId); // Identify tenant (multi-tenancy)
//   response.headers.set("x-user-id", req.auth.user.id); // Identify current user
//   response.headers.set("x-user-role", req.auth.user.role); // Role-based access control

//   return response;
// });

// /* Apply middleware to all routes except static assets */
// export const config = {
//   matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
// };

// -------------------------------
// import type { NextAuthConfig } from "next-auth";

// // هذا الملف يُستخدم في الـ middleware فقط
// // لا يحتوي على أي import من mongoose أو Node.js modules
// export const authConfig: NextAuthConfig = {
//   pages: {
//     signIn: "/login",
//     error: "/login",
//   },
//   callbacks: {
//     authorized({ auth, request: { nextUrl } }) {
//       const isLoggedIn = !!auth?.user;
//       const isPublic = ["/login", "/register"].some((p) =>
//         nextUrl.pathname.startsWith(p),
//       );
//       const isApiAuth = nextUrl.pathname.startsWith("/api/auth");
//       const isApiReg = nextUrl.pathname.startsWith("/api/register");

//       if (isPublic || isApiAuth || isApiReg) return true;
//       if (!isLoggedIn) return false; // يعمل redirect لـ /login تلقائياً

//       return true;
//     },
//   },
//   providers: [], // الـ providers الحقيقية في options.ts
// };

// src/middleware.ts

// import { auth } from "@/lib/auth/options";
// import { NextResponse } from "next/server";

// export default auth((req) => {
//   const { pathname } = req.nextUrl;

//   const isPublic = ["/login", "/register", "/api/auth", "/api/register"]
//     .some((p) => pathname.startsWith(p));

//   if (isPublic) return NextResponse.next();

//   if (!req.auth) {
//     const url = req.nextUrl.clone();
//     url.pathname = "/login";
//     url.searchParams.set("callbackUrl", pathname);
//     return NextResponse.redirect(url);
//   }

//   const res = NextResponse.next();
//   res.headers.set("x-mosque-id", req.auth.user.mosqueId ?? "");
//   res.headers.set("x-user-id",   req.auth.user.id ?? "");
//   res.headers.set("x-user-role",  req.auth.user.role ?? "");
//   return res;
// });

// export const config = {
//   matcher: ["/((?!_next/static|_next/image|favicon.ico|icons|manifest).*)"],
// };
// ---------------------------
import NextAuth from "next-auth";
// import  authConfig  from "@/lib/auth/auth.config";
import { NextResponse } from "next/server";
import { authConfig } from "./lib/auth/config";

// إنشاء نسخة auth متوافقة مع الـ Edge
const { auth } = NextAuth(authConfig);

const PUBLIC_ROUTES = ["/login", "/register", "/api/auth", "/api/register"];

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;

  const isPublic = PUBLIC_ROUTES.some((route) => nextUrl.pathname.startsWith(route));
  const isStatic = /^\/(_next|icons|manifest|favicon)/.test(nextUrl.pathname);

  if (isPublic || isStatic) return NextResponse.next();

  if (!isLoggedIn) {
    const loginUrl = nextUrl.clone();
    loginUrl.pathname = "/login";
    loginUrl.searchParams.set("callbackUrl", nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  const response = NextResponse.next();
  
  // بما أننا تأكدنا أن المستخدم مسجل دخول (isLoggedIn) يمكننا استخدام req.auth بأمان
  if (req.auth?.user) {
    // استخدمنا as any أو يمكنك عمل Type Declaration لتجاهل خطأ TS مؤقتاً
    const user = req.auth.user as any; 
    response.headers.set("x-mosque-id", user.mosqueId || "");
    response.headers.set("x-user-id", user.id || "");
    response.headers.set("x-user-role", user.role || "");
  }

  return response;
});

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};