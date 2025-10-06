"use server";

import { PasswordResetSchema } from "@/schema";
import { getUserByEmail } from "@/data/user";
import * as z from "zod";
import { sendPasswordResetEmail } from "@/lib/mail";
import { generatePasswordResetToken } from "@/lib/tokens";
import { sendPasswordResetEmailNodemailer } from "@/lib/mailUsingNodemailer";

export const reset = async (values: z.infer<typeof PasswordResetSchema>) => {
  console.log(values); // will be logged in the server

  // making sure that the vields are valid in accordance to the schema mentioned in the PasswordResetSchema
  const validatedFields = PasswordResetSchema.safeParse(values);

  // if not valid then throw an appropiate erro
  if (!validatedFields.success) return { error: "Invalid Credentials!" };

  // else continue with the process
  const { email } = validatedFields.data;
  const existingUser = await getUserByEmail(email);

  if (!existingUser) return { error: "No user found for this email!" };

  const passwordResetToken = await generatePasswordResetToken(email);

  // sending email using nodemailer
  await sendPasswordResetEmailNodemailer({
    to: passwordResetToken.email,
    subject: "Password Reset Request",
    token: passwordResetToken.token,
    userName: existingUser.name,
  });

  // sending email using the resend service -- commented out because we are now using nodemailer
  // await sendPasswordResetEmail(
  //   passwordResetToken.email,
  //   passwordResetToken.token
  // );

  // if everything went right then throw an success email
  return { success: "Password reset email sent" };
};
