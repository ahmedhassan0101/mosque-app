/* eslint-disable @typescript-eslint/no-explicit-any */
// src\lib\auth\options.ts

import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import { connectDB } from "@/lib/db/connect";
import User from "@/models/User";
import { z } from "zod";
import { authConfig } from "./config";
import crypto from "crypto";
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
    /**
     * Google OAuth
     * On first sign-in: creates user with mosqueId=null → /onboarding
     * On subsequent sign-ins: logs in normally
     */
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),

    /**
     * Credentials (Email + Password)
     * Classic login — supports manual provisioning by admin
     */
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

        console.log("🚀 ~ user2442456:", user);

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
  /**
   * signIn event — creates user record for Google on first sign-in
   */
  // events: {
  //   async signIn({ user, account }) {
  //     if (account?.provider !== "google") return;

  //     await connectDB();

  //     // Upsert — create if not exists, leave mosqueId null for onboarding
  //     await User.findOneAndUpdate(
  //       { email: user.email! },
  //       {
  //         $setOnInsert: {
  //           name: user.name ?? "مستخدم جديد",
  //           email: user.email,
  //           provider: "google",
  //           role: "admin",
  //           mosqueId: null,
  //         },
  //       },
  //       { upsert: true, new: true },
  //     );
  //   },
  // },

  /**
   * jwt callback — attach mosqueId from DB for Google users
   * (Google OAuth doesn't carry mosqueId in the initial token)
   */
  callbacks: {
    ...authConfig.callbacks,
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        await connectDB();

        const existing = await User.findOne({ email: user.email });

        if (!existing) {
          // إنشاء يوزر جديد
          const newUser = await User.create({
            name: user.name,
            email: user.email,
            password: crypto.randomBytes(32).toString("hex"), // dummy password
            provider: "google",
            role: "admin",
            mosqueId: null,
          });
          user.id = newUser._id.toString();
        } else {
          user.id = existing._id.toString();
        }
      }
      return true;
    },
    async jwt({ token, user, account, trigger }) {
      // First login
      if (user) {
        token.id = user.id!;
        token.role = (user as any).role ?? "admin";
        token.mosqueId = (user as any).mosqueId ?? "";
      }
      if (account?.provider === "google") {
        await connectDB();
        const dbUser = await User.findOne({ email: token.email }).lean();
        if (dbUser) {
          token.id = dbUser._id.toString();
          token.mosqueId = dbUser.mosqueId?.toString() ?? "";
          token.role = dbUser.role;
        }
      }
      // عند update() من الـ client بعد onboarding
      if (trigger === "update") {
        await connectDB();
        const dbUser = await User.findOne({ email: token.email }).lean();
        if (dbUser) {
          token.mosqueId = dbUser.mosqueId?.toString() ?? "";
        }
      }
      // // For Google: fetch mosqueId from DB (may have been set after onboarding)
      // if (account?.provider === "google" || trigger === "update") {
      //   await connectDB();
      //   const dbUser = await User.findOne({ email: token.email }).lean();
      //   if (dbUser) {
      //     token.mosqueId = dbUser.mosqueId?.toString() ?? "";
      //     token.role = dbUser.role;
      //     token.id = dbUser._id.toString();
      //   }
      // }

      return token;
    },
    // async jwt({ token, user, account, trigger }) {
    //   // 1. عند تسجيل الدخول لأول مرة (يمر من هنا جوجل و Credentials)
    //   if (user) {
    //     token.id = user.id!;
    //     token.role = (user as any).role ?? "admin";
    //     token.mosqueId = (user as any).mosqueId ?? "";
    //   }

    //   // 2. معالجة حساب جوجل: يجب أن نتأكد من تزامنه مع الداتابيز واستخراج الـ ObjectId
    //   if (account?.provider === "google") {
    //     await connectDB();

    //     // Blocking Operation: لن يكمل الكود حتى يتأكد من وجود/إنشاء المستخدم
    //     const dbUser = await User.findOneAndUpdate(
    //       { email: token.email },
    //       {
    //         $setOnInsert: {
    //           name: token.name ?? "مستخدم جديد",
    //           email: token.email,
    //           provider: "google",
    //           role: "admin",
    //           mosqueId: null,
    //         },
    //       },
    //       { upsert: true, returnDocument: "after" }, // استخدمنا returnDocument لحل تحذير Mongoose السابق
    //     );

    //     // ✅ هنا الـ Override الحقيقي: نستبدل الـ UUID الخاص بجوجل بالـ ObjectId الخاص بـ MongoDB
    //     token.id = dbUser._id.toString();
    //     token.role = dbUser.role;
    //     token.mosqueId = dbUser.mosqueId?.toString() ?? "";
    //   }

    //   // 3. في حالة تحديث الجلسة يدوياً (update)
    //   if (trigger === "update") {
    //     await connectDB();
    //     const dbUser = await User.findOne({ email: token.email }).lean();
    //     if (dbUser) {
    //       token.mosqueId = dbUser.mosqueId?.toString() ?? "";
    //       token.role = dbUser.role;
    //       token.id = dbUser._id.toString();
    //     }
    //   }

    //   return token;
    // },
  },
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
