import NextAuth from "next-auth";
// the prisma adapter don't work on edge hence we will use /auth.config.ts to invoke the middleware instead
import { UserRole } from "@prisma/client";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";
import authConfig from "@/auth.config";
import { db } from "@/lib/db";
import { getUserById } from "@/data/user";
import { getTwoFactorConfirmationByUserId } from "@/data/two-factor-confirmation";

const prisma = new PrismaClient();

export const { auth, handlers, signIn, signOut } = NextAuth({
  // defining the routes that should be followed on different occassions
  pages: {
    signIn: "/auth/login",
    error: "/auth/error",
  },

  events: {
    async linkAccount({ user }) {
      await db.user.update({
        where: { id: user.id },
        data: { emailVerified: true },
      });
    },
  },

  // the `session` callback returns the session
  // the `jwt` is the actually jwt token
  callbacks: {
    // if the email is not verified then signin won't be allowed
    async signIn({ user, account }) {
      //we will allow OAUTH providers linked accounts without email verification
      if (account?.provider !== "credentials") return true;
      // if not OAUTH then we will stop if not verified
      if(!user.id) return false
      const exitsingUser = await getUserById(user.id);
      console.log(user.id);

      // Prevent SignIn without email verification for credential login
      if (!exitsingUser || !exitsingUser.emailVerified) {
        return false;
      }

      if (exitsingUser.isTwoFactorEnabled) {
        const twoFactorConfirmation = await getTwoFactorConfirmationByUserId(
          user.id
        );
        if (!twoFactorConfirmation) return false;

        // Delete two factor confirmation if the user successfully logs in for the next signin
        await db.twoFactorConfirmation.delete({
          where: { id: twoFactorConfirmation.id },
        });
      }

      return true;
    },

    // this is the session token
    async session({ token, session }) {
      console.log({
        sessionToken: token,
      });
      // extending session token with custom values
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }

      if (token.role && session.user) {
        session.user.role = token.role as "ADMIN" | "USER";
      }

      // we will only check for session.user since isTwoFactorEnabled can be false if two factor is turned off
      if (session.user) {
        session.user.isTwoFactorEnabled = token.isTwoFactorEnabled as boolean;
      }

      return session;
    },
    async jwt({ token }) {
      console.log(token);
      // if token.sub is not present that means we are logged out
      if (!token.sub) {
        return token;
      }

      // if we want to get additional information about the user then we can get them from ID
      const exitsingUser = await getUserById(token.sub);
      if (!exitsingUser) return token;

      // extending the token with custom values like role and isTwoFactorEnabled
      token.role = exitsingUser.role;
      token.isTwoFactorEnabled = exitsingUser.isTwoFactorEnabled;

      // we will use the sub from ths token which is basically the id and transfer it to the session token
      // always return the token in the end to avoid error
      return token;
    },
  },
  adapter: PrismaAdapter(db),
  // we are using jwt as the session strategy
  session: { strategy: "jwt" },
  ...authConfig,
});
