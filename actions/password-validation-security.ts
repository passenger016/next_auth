"use server";
import * as z from "zod";
import { db } from "@/lib/db";
import { ValidatePasswordSchema } from "@/schema";
import { currentUser } from "@/lib/auth";
import { getUserById } from "@/data/user";
import bcryptjs from "bcryptjs";
import { getCache, setCache } from "@/lib/nodeCacheHelper";

export const passwordValidationSecurity = async (
  values: z.infer<typeof ValidatePasswordSchema>
) => {
  // get the current user from the database
  // using the server actions
  const user = await currentUser(); // get the current user data
  if (!user) {
    return { error: "Unauthorized" };
  }
  if (!user.id) {
    // handle missing id explicitly
    return { error: "Missing user id" };
  }
  // now check if the user exists in the database
  const dbUser = await getUserById(user.id);
  if (!dbUser) {
    return { error: "User not found" };
  }
  // if the user is linked to an OAUTH provider then we will not allow them to update their password
  if (user.isOAuthUser) {
    (values.password = undefined)
    return { error: "OAUTH users cannot change password" };
  }
    // verify the entered password with the stored hashed password
    const isPasswordValid = await bcryptjs.compare(values.password || "", dbUser.password || "");
    if (!isPasswordValid) {
        return { error: "Invalid password" };
    }
    // first check if password validated for the user.id exists in the cache or not
    const isPasswordValidated = getCache(`password-validated:${user.id}`);
    if (isPasswordValidated) {
        return { success: "Password already validated", passWordValidated: true};
    }
    // else we will allow access to password reset form
    setCache(`password-validated:${user.id}`, true); // set cache indicating successful validation
    return { success: "Password validated successfully", passWordValidated: true};
};
