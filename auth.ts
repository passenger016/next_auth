import NextAuth from "next-auth"
// the prisma adapter don't work on edge hence we will use /auth.config.ts to invoke the middleware instead
import { UserRole } from "@prisma/client"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { PrismaClient } from "@prisma/client"
import authConfig from "./auth.config"
import { db } from "./lib/db"
import {getUserById} from "@/data/user"
 
const prisma = new PrismaClient()
 
export const { auth, handlers, signIn, signOut } = NextAuth({

  // defining the routes that should be followed on different occassions
  pages:{
    signIn: "/auth/login",
    error: "/auth/error",
  },



  events:{
    async linkAccount({user}){
      await db.user.update({
        where:{id: user.id},
        data: {emailVerified: true}
      })
    }
  },



  // the `session` callback returns the session
  // the `jwt` is the actually jwt token
  callbacks:{

    // if the email is not verified then signin won't be allowed
    // async signIn(user){

    //   const exitsingUser = await getUserById(user.user.id);
    //   console.log(user.user.id);
    //   if (!exitsingUser || !exitsingUser.emailVerified){
    //     return false;
    //   }

    //   return true;
    // },

    // this is the session token
    async session({token,session}){
      console.log({
        sessionToken: token,
      })
      if(token.sub && session.user){
        session.user.id = token.sub;
      }

      if(token.role && session.user)
        session.user.role = token.role as "ADMIN" | "USER";

      return session;
    }, 
    async jwt({token}){
      console.log(token)
      // if token.sub is not present that means we are logged out
      if(!token.sub){
        return token
      }


      // if we want to get additional information about the user then we can get them from ID
      const exitsingUser = await getUserById(token.sub);
      if(!exitsingUser) return token;

      token.role = exitsingUser.role;

      // we will use the sub from ths token which is basically the id and transfer it to the session token
      // always return the token in the end to avoid error
      return token;
    }
  },
  adapter: PrismaAdapter(db),
  // we are using jwt as the session strategy
  session: { strategy: "jwt" },
  ...authConfig,
})