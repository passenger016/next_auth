// NOTE: this file is purely for TypeScript type safety. It only affects compile-time types and does not run or change any runtime behavior.

// Imports NextAuth types so you can base your extensions on its built-in shapes.
import NextAuth, { type DefaultSession } from "next-auth"; 

// Creates a new type called ExtendedUser which is the DefaultSession.user shape plus:
// role: "ADMIN" | "USER"
// isTwoFactorEnabled: boolean
// isOAuthUser: boolean
// This ensures the user object has those fields in a type-safe way.
export type ExtendedUser = DefaultSession["user"] & {
  role: "ADMIN" | "USER";
  isTwoFactorEnabled: boolean;
  isOAuthUser: boolean;
};

// Uses TypeScript declaration merging to augment the types exported by the "next-auth" package:
// Replaces/extends the Session.user type to be ExtendedUser (so session.user.role, session.user.isTwoFactorEnabled are typed).
// Extends User so NextAuth adapter/DB user objects can be treated as the same extended user shape.
declare module "next-auth" {
  interface Session {
    user: ExtendedUser;
  }

  interface User extends ExtendedUser {}
}
