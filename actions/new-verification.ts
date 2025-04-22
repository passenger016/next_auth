"use server";

import { db } from "@/lib/db";
import { getVerificationTokenByToken } from "@/data/verification-token"; // to pass the token into the function and see if it is valid or not by querying the database (Verification Token Table) using the input token
import { getUserByEmail } from "@/data/user";

export const newVerification = async (token: string) => {
  // first we will check if an token exits in the database by using the input token
  const existingToken = await getVerificationTokenByToken(token);

  // if no token exists then
  if (!existingToken) {
    return { error: "Token does not exist" };
  }

  // if the current date (in milliseconds) is larger than the expiration date then it will be considered as expired.
  const hasExpired = new Date(existingToken.expires) < new Date();
  if (hasExpired) {
    return { error: "Token has expired" };
  }

  // checking if the user against that token exists or not
  const existingUser = await getUserByEmail(existingToken.email);
  if (!existingUser) {
    return { error: "User does not exist" };
  }

  // if all tests passes without error then we will update the db of that user by the email and set the email verified field to true
  await db.user.update({
    where: { id: existingUser.id },
    data: { emailVerified: true, email: existingToken.email },
  });

  // after that delete the verificationToken from the database as it is not required anymore
  await db.verificationToken.delete({
    where: { id: existingToken.id },
  });

  return { success: "Email Verified Successfully!" };
};
