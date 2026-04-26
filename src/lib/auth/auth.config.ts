/* eslint-disable @typescript-eslint/no-unused-vars */
// src\auth.config.ts

import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
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
      
      // const { nextUrl } = request;
      // const isLoggedIn = !!auth?.user;
      // const hasMosque = !!auth?.user?.mosqueId;
      // const isEmailVerified = !!auth?.user?.emailVerified;

      // const isOnDashboard = nextUrl.pathname.startsWith("/dashboard");
      // const isOnOnboarding = nextUrl.pathname.startsWith("/onboarding");
      // const isOnAuth =
      //   nextUrl.pathname.startsWith("/login") ||
      //   nextUrl.pathname.startsWith("/register");
      // const isOnWaiting = nextUrl.pathname.startsWith("/waiting-verification");
      // const isOnVerify = nextUrl.pathname.startsWith("/verify-email");

      // // Allow the verification pages for everyone
      // if (isOnWaiting || isOnVerify) return true;

      // if (isOnDashboard) {
      //   if (!isLoggedIn) return false; // → redirect to /login
      //   // Block unverified credentials users
      //   if (!isEmailVerified)
      //     return Response.redirect(new URL("/waiting-verification", nextUrl));
      //   if (!hasMosque)
      //     return Response.redirect(new URL("/onboarding", nextUrl));
      //   return true;
      // }

      // if (isOnOnboarding) {
      //   if (!isLoggedIn) return false;
      //   if (!isEmailVerified)
      //     return Response.redirect(new URL("/waiting-verification", nextUrl));
      //   if (hasMosque) return Response.redirect(new URL("/dashboard", nextUrl));
      //   return true;
      // }

      // if (isOnAuth && isLoggedIn) {
      //   if (!isEmailVerified)
      //     return Response.redirect(new URL("/waiting-verification", nextUrl));
      //   const dest = hasMosque ? "/dashboard" : "/onboarding";
      //   return Response.redirect(new URL(dest, nextUrl));
      // }

      return true;
    },

    jwt({ token, user, trigger, session }) {
      // On sign-in, inject custom fields into token
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.mosqueId = user.mosqueId;
        token.picture = user.image ?? token.picture;
        // Persist emailVerified status in JWT
        token.emailVerified = user.emailVerified ?? null;
      }

      // When update() is called from the client (after onboarding)
      if (trigger === "update" && session) {
        token.mosqueId = session.mosqueId ?? token.mosqueId;
        token.role = session.role ?? token.role;
        token.emailVerified = session.emailVerified ?? token.emailVerified;
      }

      return token;
    },

    session({ session, token }) {
      session.user.id = token.id;
      session.user.role = token.role;
      session.user.mosqueId = token.mosqueId;
      session.user.image = token.picture as string | undefined;
      session.user.emailVerified = token.emailVerified as Date | null;

      return session;
    },
  },

  pages: {
    signIn: "/login",
    error: "/login",
  },

  session: { strategy: "jwt" },
};
