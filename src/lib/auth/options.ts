// src\lib\auth\options.ts

import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { connectDB } from "@/lib/db/connect";
import User from "@/models/User";
import { z } from "zod";
import { authConfig } from "./config";

/**
 * Validate login input using Zod
 */
const credSchema = z.object({
  email: z.email(),
  password: z.string().min(8),
});

// Initialize NextAuth
export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig, // reuse shared config

  // Use JWT instead of database sessions
  session: { strategy: "jwt" },

  // Secret used to sign/encrypt JWT
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    // Fields shown in login form
    Credentials({
      credentials: {
        email: { label: "البريد الإلكتروني", type: "email" },
        password: { label: "كلمة المرور", type: "password" },
      },
      // Runs when user tries to login
      async authorize(credentials) {
        // 1. Validate input
        const parsed = credSchema.safeParse(credentials);
        if (!parsed.success) return null;

        // 2. Connect to DB
        await connectDB();
        
        // 3. Find user
        const user = await User.findOne({ email: parsed.data.email }).select(
          "+password",
        );
        if (!user) return null;

        // 4. Check password
        const valid = await user.comparePassword(parsed.data.password);
        if (!valid) return null;

        // 5. Return user data → goes to JWT callback
        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role,
          mosqueId: user.mosqueId?.toString() ?? "",
        };
      },
    }),
  ],
});

// export const { handlers, auth, signIn, signOut } = NextAuth({
//    ...authConfig,
//     // trustHost: true,
//   providers: [
//     Credentials({
//       credentials: {
//         email: { label: "البريد الإلكتروني", type: "email" },
//         password: { label: "كلمة المرور", type: "password" },
//       },

//       async authorize(credentials) {
//         /* Validate input using Zod */
//         const parsed = credSchema.safeParse(credentials);
//         if (!parsed.success) return null;

//         /* Connect to database */
//         await connectDB();

//         /* Find user and include password field */
//         const user = await User.findOne({ email: parsed.data.email }).select(
//           "+password",
//         );

//         if (!user) return null;

//         /* Compare hashed password */
//         const valid = await user.comparePassword(parsed.data.password);
//         if (!valid) return null;

//         /* Return user data to be stored in JWT */
//         return {
//           id: user._id.toString(),
//           name: user.name,
//           email: user.email,
//           role: user.role,
//           mosqueId: user.mosqueId?.toString() ?? "", // .......///
//         };
//       },
//     }),
//   ],

//   callbacks: {
//     async jwt({ token, user }) {
//       /* First login: store extra data inside JWT */
//       if (user) {
//         token.id = user.id!;
//         token.role = user.role;
//         token.mosqueId = user.mosqueId ?? ""; // "" if superadmin
//       }
//       return token;
//     },
//     async session({ session, token }) {
//       // Attach JWT data to session

//       session.user.id = token.id as string;
//       session.user.role = token.role as string;
//       session.user.mosqueId = token.mosqueId as string;

//       return session;
//     },
//   },

//   pages: {
//     signIn: "/login",
//     error: "/login",
//   },
//   session: { strategy: "jwt" },
//   /* Secret used to sign JWT */
//   secret: process.env.NEXTAUTH_SECRET,
// });
