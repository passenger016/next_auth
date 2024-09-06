import NextAuth from "next-auth"
// the prisma adapter don't work on edge hence we will use /auth.config.ts to invoke the middleware instead
import { PrismaAdapter } from "@auth/prisma-adapter"
import { PrismaClient } from "@prisma/client"
import authConfig from "./auth.config"
import { db } from "./lib/db"
 
const prisma = new PrismaClient()
 
export const { auth, handlers, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(db),
  // we are using jwt as the session strategy
  session: { strategy: "jwt" },
  ...authConfig,
})