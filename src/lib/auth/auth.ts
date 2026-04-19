// // src\auth.ts
// /**
//  * @file auth.ts
//  * @description Full Auth.js instance with Node.js-dependent callbacks.
//  * ⚠️  NEVER import this file in proxy.ts or any Edge-runtime code.
//  *     Only import from Server Actions, API Route Handlers, and Server Components.
//  */

// import NextAuth from "next-auth";
// import Credentials from "next-auth/providers/credentials";
// import { authConfig } from "./auth.config";
// import { connectDB } from "../db/db";
// import { User } from "@/models/user.model";

// import bcrypt from "bcryptjs";
// import { loginSchema } from "@/schemas/auth.schema";

// export const { auth, signIn, signOut, handlers } = NextAuth({
//   ...authConfig,

//   providers: [
//     // Re-spread Google from authConfig (already defined there)
//     ...authConfig.providers,

//     Credentials({
//       /**
//        * Validates credentials against MongoDB.
//        * Returns a user object on success, null on failure.
//        */
//       async authorize(credentials) {
//         const parsed = loginSchema.safeParse(credentials);
//         if (!parsed.success) return null;

//         await connectDB();

//         const user = await User.findOne({ email: parsed.data.email }).select(
//           "+password"
//         );
//         if (!user || !user.password) return null;

//         const isValid = await bcrypt.compare(
//           parsed.data.password,
//           user.password
//         );
//         if (!isValid) return null;

//         return {
//           id: user._id.toString(),
//           name: user.name,
//           email: user.email,
//           image: user.image,
//           role: user.role,
//           mosqueId: user.mosqueId?.toString(),
//           // onboardingComplete: user.onboardingComplete,
//         };
//       },
//     }),
//   ],

//   callbacks: {
//     ...authConfig.callbacks,

//     /**
//      * Enriches the JWT token with custom user fields on first sign-in.
//      */
//     async jwt({ token, user }) {
//       if (user) {
//         token.id = user.id;
//         token.role = (user as { role?: string }).role;
//         token.mosqueId = (user as { mosqueId?: string }).mosqueId;
//         token.onboardingComplete = (
//           user as { onboardingComplete?: boolean }
//         ).onboardingComplete;
//       }
//       return token;
//     },

//     /**
//      * Exposes custom token fields on the client-side session object.
//      */
//     async session({ session, token }) {
//       if (token && session.user) {
//         session.user.id = token.id as string;
//         session.user.role = token.role as string;
//         session.user.mosqueId = token.mosqueId as string | undefined;
//         // session.user.onboardingComplete =
//           token.onboardingComplete as boolean | undefined;
//       }
//       return session;
//     },
//   },
// });

// src\auth.ts
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import { authConfig } from "./auth.config";
import { connectDB } from "@/lib/db/db";
import { User } from "@/models/user.model";
import { loginSchema } from "@/schemas/auth.schema";

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,

  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),

    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },

      /**
       * Validates credentials against MongoDB.
       * Returns null on failure to trigger AuthError.
       */
      async authorize(credentials) {
        const parsed = loginSchema.safeParse(credentials);
        if (!parsed.success) return null;

        await connectDB();

        const user = await User.findOne({ email: parsed.data.email }).select(
          "+password",
        );

        if (!user || !user.password) return null;

        const isValid = await user.comparePassword(parsed.data.password);
        if (!isValid) return null;

        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          image: user.image,
          role: user.role,
          mosqueId: user.mosqueId?.toString() ?? null,
        };
      },
    }),
  ],

  callbacks: {
    ...authConfig.callbacks,

    /**
     * Handles Google OAuth sign-in: creates user if first time.
     */
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        console.log("We are here");
        await connectDB();

        const existing = await User.findOne({ email: user.email });
        if (!existing) {
          await User.create({
            name: user.name as string,
            email: user.email as string,
            image: user.image as string,
            provider: "google",
            role: "SUPERVISOR",
          });
        } else {
          // Keep image fresh

          existing.image = user.image ?? existing.image;
          await existing.save();
        }
        const dbUser = await User.findOne({ email: user.email });
        if (!dbUser) return false;
        user.id = dbUser._id.toString();
        user.role = dbUser.role;
        user.mosqueId = dbUser.mosqueId?.toString() ?? null;
      }

      return true;
    },
  },
});
