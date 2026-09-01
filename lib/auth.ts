import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

import connectDb from "@/lib/db";
import User from "@/models/User";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: {},
        password: {},
      },

      async authorize(credentials) {
        // 1. Check credentials exist
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        // 2. Connect MongoDB
        await connectDb();

        // 3. Find user
        const user = await User.findOne({
          email: credentials.email,
        });

        if (!user) {
          return null;
        }

        // 4. Compare password
        const isPasswordCorrect = await bcrypt.compare(
          credentials.password as string,
          user.password
        );

        if (!isPasswordCorrect) {
          return null;
        }

        // 5. Return user
        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
        };
      },
    }),
  ],
});