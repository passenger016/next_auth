"use server";

import { db } from "@/lib/db";
import * as z from "zod";
import { NewPasswordSchema } from "@/schema";
import { getPasswordResetTokenbyToken } from "@/data/password-reset-token";
import { getUserByEmail } from "@/data/user";
import bcryptjs from "bcryptjs";

export const newPassword = async (
  values: z.infer<typeof NewPasswordSchema>,
  token?: string | null
) => {
  if (!token) {
    return { error: "Missing Token!" };
  }

  const validatedFields = NewPasswordSchema.safeParse(values);
  if (!validatedFields.success) {
    return { error: "Invalid Vields" };
  }

  const { password } = validatedFields.data;

  const existingToken = await getPasswordResetTokenbyToken(token);
  if (!existingToken) {
    return { error: "Invalid Token!" };
  }

  console.log(new Date(existingToken.expires));

  const hasExpired = new Date(existingToken.expires) < new Date();
  if (hasExpired) {
    return { error: "Token has expired!" };
  }
  const existingUser = await getUserByEmail(existingToken.email);
  if (!existingUser) {
    return { error: "Email does not exist" };
  }
  console.log(`Eixsting User's id : ${existingUser.id}`);
  // hashing the new password and updating it in the database
  const hashedPassword = await bcryptjs.hash(password, 10);
  console.log(`password:${password}`);

  // update the password in the database by finding the user by the id
  await db.user.update({
    where: { id: existingUser.id },
    data: { password: hashedPassword },
  });

  // delet the password reset token
  await db.passwordResetToken.delete({
    where: { id: existingToken.id },
  });

  return { success: "New password was set!" };
};
