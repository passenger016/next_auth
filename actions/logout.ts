"use server";

import { signOut } from "@/auth";

export const logout = async () => {
  // use this server action for signOut if any additional logic is required before signing out the user like for clearing user data.
  await signOut();
};
