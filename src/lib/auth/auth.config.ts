// // /* eslint-disable @typescript-eslint/no-unused-vars */

// /**
//  * @file auth.config.ts
//  * @description Edge-compatible Auth.js configuration.
//  * ⚠️  CRITICAL: This file must NEVER import Mongoose, bcrypt, or any Node.js module.
//  *               It runs in the Edge Runtime (proxy.ts / middleware).
//  *               Keep it pure: only JWT callbacks and provider metadata.
//  */

// import type { NextAuthConfig } from "next-auth";
// import Google from "next-auth/providers/google";

// /**
//  * Routes that are always publicly accessible (no auth required).
//  */
// export const PUBLIC_ROUTES = [
//   "/",
//   "/login",
//   "/register",
//   "/forgot-password",
//   "/reset-password",
// ] as const;

// /**
//  * Routes that authenticated users should be redirected AWAY from.
//  */
// export const AUTH_ROUTES = ["/login", "/register"] as const;

// /** The default redirect path after successful login. */
export const DEFAULT_LOGIN_REDIRECT = "/dashboard";

// /**
//  * Minimal, Edge-safe Auth.js configuration.
//  * Callbacks that need DB access (e.g., signIn, session enrichment)
//  * live in the full `auth.ts` — NOT here.
//  */
// export const authConfig: NextAuthConfig = {
//   providers: [
//     Google({
//       clientId: process.env.GOOGLE_CLIENT_ID!,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
//     }),
//   ],

//   pages: {
//     signIn: "/login",
//     error: "/login",
//   },

//   callbacks: {
//     /**
//      * Edge-safe authorized callback.
//      * Determines if a request is allowed to proceed based on session & route.
//      */
//     authorized({ auth, request: { nextUrl } }) {
//       const isLoggedIn = !!auth?.user;
//       const pathname = nextUrl.pathname;

//       const isPublic = PUBLIC_ROUTES.some(
//         (route) => pathname === route || pathname.startsWith(`${route}/`),
//       );
//       const isAuthRoute = (AUTH_ROUTES as readonly string[]).includes(pathname);

//       // Redirect logged-in users away from auth pages
//       if (isAuthRoute && isLoggedIn) {
//         return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
//       }

//       // Allow public routes without auth
//       if (isPublic) return true;

//       // Block unauthenticated access to protected routes
//       if (!isLoggedIn) {
//         const loginUrl = new URL("/login", nextUrl);
//         loginUrl.searchParams.set("callbackUrl", pathname);
//         return Response.redirect(loginUrl);
//       }

//       return true;
//     },
//   },

//   session: { strategy: "jwt" },
// };

// // src\auth.config.ts

import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
// 'loginSchema' is declared but its value is never read.
/**
 * Auth configuration safe for Edge Runtime.
 * Must NOT import Mongoose, bcrypt, or any Node.js-only module.
 */
export const authConfig: NextAuthConfig = {
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    Credentials({
      /**
       * Authorize is intentionally left minimal here.
       * Full DB validation is done in auth.ts via the `authorize` callback.
       */
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async () => null, // overridden in auth.ts
    }),
  ],

  callbacks: {
    /**
     * Controls whether a route is accessible.
     * Runs on the Edge — keep it free of DB queries.
     */
    authorized({ auth, request }) {
      const { nextUrl } = request;
      const isLoggedIn = !!auth?.user;
      const hasMosque = !!auth?.user?.mosqueId;

      const isOnDashboard = nextUrl.pathname.startsWith("/dashboard");
      const isOnOnboarding = nextUrl.pathname.startsWith("/onboarding");
      const isOnAuth =
        nextUrl.pathname.startsWith("/login") ||
        nextUrl.pathname.startsWith("/register");

      if (isOnDashboard) {
        if (!isLoggedIn) return false; // → redirect to /login
        if (!hasMosque)
          return Response.redirect(new URL("/onboarding", nextUrl));
        return true;
      }

      if (isOnOnboarding) {
        if (!isLoggedIn) return false;
        if (hasMosque) return Response.redirect(new URL("/dashboard", nextUrl));
        return true;
      }

      if (isOnAuth && isLoggedIn) {
        if (!hasMosque)
          return Response.redirect(new URL("/onboarding", nextUrl));
        return Response.redirect(new URL("/dashboard", nextUrl));
      }

      return true;
    },

    jwt({ token, user, trigger, session }) {
      // On sign-in, inject custom fields into token
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.mosqueId = user.mosqueId;
        token.picture = user.image ?? token.picture;
      }

      // When update() is called from the client (after onboarding)
      if (trigger === "update" && session) {
        token.mosqueId = session.mosqueId ?? token.mosqueId;
        token.role = session.role ?? token.role;
      }

      return token;
    },

    session({ session, token }) {
      session.user.id = token.id;
      session.user.role = token.role;
      session.user.mosqueId = token.mosqueId;
      session.user.image = token.picture as string | undefined;
      return session;
    },
  },

  pages: {
    signIn: "/login",
    error: "/login",
  },

  session: { strategy: "jwt" },
};
