import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import connectDB from "@/lib/db/connect";
import User from "@/models/User";
import { z } from "zod";

const credSchema = z.object({
  email: z.email(),
  password: z.string().min(8),
});

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: { label: "البريد الإلكتروني", type: "email" },
        password: { label: "كلمة المرور", type: "password" },
      },

      async authorize(credentials) {
        /* Validate input using Zod */
        const parsed = credSchema.safeParse(credentials);
        if (!parsed.success) return null;

        /* Connect to database */
        await connectDB();

        /* Find user and include password field */
        const user = await User.findOne({ email: parsed.data.email }).select(
          "+password",
        );

        if (!user) return null;

        /* Compare hashed password */
        const valid = await user.comparePassword(parsed.data.password);
        if (!valid) return null;

        /* Return user data to be stored in JWT */
        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role,
          mosqueId: user.mosqueId.toString(),
        };
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      /* First login: store extra data inside JWT */
      if (user) {
        token.id = user.id!;
        token.role = user.role;
        token.mosqueId = user.mosqueId;
      }
      return token;
    },
    async session({ session, token }) {
      // Attach JWT data to session

      session.user.id = token.id as string;
      session.user.role = token.role as string;
      session.user.mosqueId = token.mosqueId as string;

      return session;
    },
  },

  pages: {
    signIn: "/login",
    error: "/login",
  },
  session: { strategy: "jwt" },
  /* Secret used to sign JWT */
  secret: process.env.NEXTAUTH_SECRET,
});
