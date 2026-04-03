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

import type { NextAuthConfig } from "next-auth";

export const authConfig: NextAuthConfig  = {
  pages: {
    signIn: "/login",
    error: "/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id!;
        token.role = user.role;
        token.mosqueId = user.mosqueId ?? "";
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.user.mosqueId = token.mosqueId as string;
      }
      return session;
    },
  },
  providers: [], // سنتركه فارغاً هنا ونضيفه في ملف options
} satisfies NextAuthConfig;