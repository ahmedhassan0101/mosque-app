/* eslint-disable @typescript-eslint/no-explicit-any */
// import type { NextAuthConfig } from "next-auth";

// // هذا الملف يُستخدم في الـ middleware فقط
// // لا يحتوي على أي import من mongoose أو Node.js modules
// export const authConfig: NextAuthConfig = {
//   pages: {
//     signIn: "/login",
//     error:  "/login",
//   },
//   callbacks: {
//     authorized({ auth, request: { nextUrl } }) {
//       const isLoggedIn  = !!auth?.user;
//       const isPublic    = ["/login", "/register"].some((p) =>
//         nextUrl.pathname.startsWith(p)
//       );
//       const isApiAuth   = nextUrl.pathname.startsWith("/api/auth");
//       const isApiReg    = nextUrl.pathname.startsWith("/api/register");

//       if (isPublic || isApiAuth || isApiReg) return true;
//       if (!isLoggedIn) return false;   // يعمل redirect لـ /login تلقائياً

//       return true;
//     },
//   },
//   providers: [],  // الـ providers الحقيقية في options.ts
// };

// src\lib\auth\config.ts
import type { NextAuthConfig } from "next-auth";
/**
 * Edge-safe config — no mongoose imports here.
 * Used by middleware (proxy.ts).
 *
 * Key addition: if user is authenticated but has no mosqueId,
 * redirect to /onboarding (unless already there or superadmin).
 */
export const authConfig: NextAuthConfig = {
  // Custom pages
  pages: {
    signIn: "/login",
    error: "/login",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      console.log("🚀 ~ auth:", auth);
      //  🚀 ~ auth: {
      //   user: {
      //     name: 'Ahmad Hassan',
      //     email: 'ahmad.h.300.9@gmail.com',
      //     image: 'https://lh3.googleusercontent.com/a/ACg8ocIink0KooA-1JKeKeZ8Jq0B_4yjj0aTbRqpT-mrTRNsX5dlPGbh=s96-c',
      //     id: '41df266b-0fd8-4ff0-8440-08bc0af38139',
      //     role: 'admin',
      //     mosqueId: ''
      //   },
      //   expires: '2026-05-14T11:37:41.831Z'
      // }
      const isLoggedIn = !!auth?.user;
      const pathname = nextUrl.pathname;

      // Routes that never need auth
      const isPublic = [
        "/login",
        "/register",
        "/forgot-password",
        "/reset-password",
        "/api/auth",
        "/api/auth/register",
        "/api/auth/forgot-password",
        "/api/auth/reset-password",
      ].some((p) => pathname.startsWith(p));

      if (isPublic) return true;
      if (!isLoggedIn) return false; // triggers redirect to signIn page

      // Logged in but no mosque → must complete onboarding
      const hasMosque = !!(auth as any).user?.mosqueId;
      // 🚀 ~ hasMosque: true
      const isSuperAdmin = (auth as any).user?.role === "superadmin";
      const isOnboarding = pathname.startsWith("/onboarding");
      const isApiOnboarding = pathname.startsWith("/api/onboarding");

      if (!hasMosque && !isSuperAdmin && !isOnboarding && !isApiOnboarding) {
        return Response.redirect(new URL("/onboarding", nextUrl));
      }

      return true;
    },
    //  JWT callback
    //  Runs:
    //  - On login
    //  - On every request
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id!;
        token.role = (user as any).role ?? "admin";
        token.mosqueId = (user as any).mosqueId ?? "";
        token.provider = account?.provider ?? "credentials";
      }
      return token;
    },
    // Session callback
    // Runs when calling auth()
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.user.mosqueId = token.mosqueId as string;
      }
      return session;
    },
  },
  providers: [], // filled in options.ts
} satisfies NextAuthConfig;

// 🟢 1. Login
// authorize()
//    ↓
// return user
//    ↓
// jwt callback
//    ↓
// token is created with user data
//    ↓
// token is stored in a secure cookie

// 🔵 2. Any subsequent request
// request is made from the browser
//    ↓
// cookie is sent automatically with the request
//    ↓
// NextAuth parses and verifies the JWT from the cookie
//    ↓
// jwt callback runs again and restores token values
//    ↓
// session callback builds the session object
//    ↓
// auth() returns session.user with the user data
