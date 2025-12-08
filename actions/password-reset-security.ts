"use server";
import * as z from "zod";
import { db } from "@/lib/db";
import { PasswordResetSecuritySchema } from "@/schema";
import { currentUser } from "@/lib/auth";
import { getUserById } from "@/data/user";
import bcryptjs from "bcryptjs";
import { getCache } from "@/lib/nodeCacheHelper";

// server action to handle password reset
// primarily being used under the /(protected)/security page
// IMPORTANT: constrast to the reset action under actions/reset.ts which is used to send password reset emails
// this is used to update the user's password directly since the user is already logged in
export const passwordResetSecurity = async (
  values: z.infer<typeof PasswordResetSecuritySchema>
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
    (values.password = undefined), (values.confirmPassword = undefined);
    return { error: "OAUTH users cannot change password" };
  }

  // on the backend we will also check if the password is validated before allowing password reset
  // because frontend form can be bypassed
  const isPasswordValidated = getCache(`password-validated:${user.id}`);
  if (!isPasswordValidated) {
    return { error: "Unauthorized" };
  }

  // check for if both the password and confirm password fields are matching
  if (values.password !== values.confirmPassword) {
    return { error: "Passwords do not match!" };
  }
  // check for if the password field is entered but the confirm password field is maissing
  if (!values.password || !values.confirmPassword) {
    return { error: "Please confirm your password!" };
  }
  // check for if the password field is not entered but the confirm password field is entered
  if (!values.password || !values.confirmPassword) {
    return { error: "Both the fields are required!" };
  }

  // check if the newly entered password is the same as the previous password
  const isSamePassword = await bcryptjs.compare(values.password, dbUser.password!);
  if (isSamePassword) {
    return { error: "New password must not match the old password" };
  }

  // if everything is fine then we will proceed to update the password
  // hashing the new password using bcrypt
  const hashedNewPassword = await bcryptjs.hash(values.password, 10);

  try {
    await db.user.update({
      where: { id: dbUser.id },
      data: {
        password: hashedNewPassword,
      },
    });
    return { success: "Password updated successfully" };
  } catch (error) {
    return { error: "Failed to update password" };
  }
};
