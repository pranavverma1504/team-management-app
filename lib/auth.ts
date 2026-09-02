import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

import connectDb from "@/lib/db";
import User from "@/models/User";

export const { handlers, signIn, signOut, auth } = NextAuth({
  pages: {
    signIn: "/login",
  },

  session: {
    strategy: "jwt",
  },

  callbacks: {
    authorized({ auth }) {
      return !!auth?.user;
    },

    async jwt({ token, user }) {
      if (user?.id) {
        token.id = user.id;
      }

      return token;
    },

    async session({ session, token }) {
      const userId = token.id ?? token.sub;

      if (session.user && typeof userId === "string") {
        session.user.id = userId;
      }

      return session;
    },
  },

  providers: [
    Credentials({
      credentials: {
        email: {},
        password: {},
      },

      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        await connectDb();

        const user = await User.findOne({
          email: credentials.email,
        });

        if (!user) {
          return null;
        }

        const isPasswordCorrect = await bcrypt.compare(
          credentials.password as string,
          user.password
        );

        if (!isPasswordCorrect) {
          return null;
        }

        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
        };
      },
    }),
  ],
});
