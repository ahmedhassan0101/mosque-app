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

export const authConfig: NextAuthConfig = {
  // Custom pages
  pages: {
    signIn: "/login",
    error: "/login",
  },
  callbacks: {
    //  JWT callback
    //  Runs:
    //  - On login
    //  - On every request
    async jwt({ token, user }) {
      // First login only
      if (user) {
        token.id = user.id!;
        token.role = user.role;
        token.mosqueId = user.mosqueId ?? "";
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
  providers: [],
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
