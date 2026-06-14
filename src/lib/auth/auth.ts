// src\auth.ts
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import { authConfig } from "./auth.config";
import { connectDB } from "@/lib/db/client";
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

        // Block login for unverified credentials users
        if (!user.emailVerified) {
          // Return a special object that signals email not verified
          // We use `null` to trigger AuthError, but we need to guide the user.
          // Better: throw a specific error that handleActionError catches
          throw new Error("EMAIL_NOT_VERIFIED");
        }

        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          image: user.image,
          role: user.role,
          mosqueId: user.mosqueId?.toString() ?? null,
          emailVerified: user.emailVerified ?? null,
        };
      },
    }),
  ],

  callbacks: {
    ...authConfig.callbacks,

    /**
     * Handles Google OAuth sign-in: auto-verifies email since Google guarantees it.
     */
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        await connectDB();

        const existing = await User.findOne({ email: user.email });
        if (!existing) {
          await User.create({
            name: user.name as string,
            email: user.email as string,
            image: user.image as string,
            provider: "google",
            role: "SUPERVISOR",
            // Google accounts are inherently verified
            emailVerified: new Date(),
          });
        } else {
          // Keep image fresh

          existing.image = user.image ?? existing.image;
          // Ensure existing google users are marked as verified
          if (!existing.emailVerified) {
            existing.emailVerified = new Date();
          }
          await existing.save();
        }
        const dbUser = await User.findOne({ email: user.email });
        if (!dbUser) return false;

        user.name = dbUser.name; // new
        user.id = dbUser._id.toString();
        user.role = dbUser.role;
        user.mosqueId = dbUser.mosqueId?.toString() ?? null;
        user.emailVerified = dbUser.emailVerified ?? null;
      }

      return true;
    },
  },
});

// --------------------------
// auth.ts (أو ملف إعدادات Next-Auth الخاص بك)

// import { connectDB } from "@/lib/db";
// import { User } from "@/models/user.model";

// export const authOptions = {
//   // ... باقي إعداداتك (Providers, pages, etc.)

//   callbacks: {
//     async jwt({ token, user }) {
//       // أول مرة المستخدم بيعمل Login، بنحط الـ User ID في التوكن
//       if (user) {
//         token.id = user.id;
//         token.role = user.role;
//       }

//       // في كل مرة النظام بيقرأ التوكن (مثلاً وهو بيتنقل بين الصفحات)
//       // بنعمل استعلام سريع للداتا بيز عشان نجيب أحدث دور (Role) ليه
//       if (token?.id) {
//         try {
//           await connectDB();
//           const freshUser = await User.findById(token.id).select("role mosqueId").lean();

//           if (freshUser) {
//             // تحديث التوكن بالبيانات الطازجة من الداتا بيز
//             token.role = freshUser.role;
//           }
//         } catch (error) {
//           console.error("Error refreshing token role:", error);
//         }
//       }

//       return token;
//     },

//     async session({ session, token }) {
//       // تمرير الدور المُحدث من التوكن للسيشن عشان الكلاينت (UI) يشوفه
//       if (token && session.user) {
//         session.user.id = token.id as string;
//         session.user.role = token.role as string;
//       }
//       return session;
//     }
//   }
// }
