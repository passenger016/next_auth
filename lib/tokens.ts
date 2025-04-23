// functions which are used to actually generate the tokens

import { getVerificationTokenByEmail } from "@/data/verification-token";
import { v4 as uuidv4 } from "uuid";
import { db } from "./db";
import {
  getPasswordResetTokenbyEmail,
  getPasswordResetTokenbyToken,
} from "@/data/password-reset-token";

// token is generated when the user clicks on a button to generate a new token for email verification so it can be replaced as many times as the user clicks for a new verification token
export const generateVerificationToken = async (email: string) => {
  const token = uuidv4(); // generating the unique token for email verification.
  const expires = new Date(new Date().getTime() + 3600 * 1000); // calculating the entire expiry time in milliseconds adding an hour in millisceonds and creating a date at future point of that.

  // checking if a verification token already exists
  const verificationTokenExists = await getVerificationTokenByEmail(email);
  if (verificationTokenExists)
    await db.verificationToken.delete({
      where: {
        id: verificationTokenExists.id,
      },
    });
  // now add the new verification token
  const verificationToken = await db.verificationToken.create({
    data: {
      email,
      token,
      expires,
    },
  });

  return verificationToken;
};

export const generatePasswordResetToken = async (email: string) => {
  const token = uuidv4(); // generating the unique token for password reset.

  // setting expiry to 15 minutes
  const expires = new Date(new Date().getTime() + 900 * 1000);

  // check if a token already exists
  const existingToken = await getPasswordResetTokenbyEmail(email);
  if (existingToken) {
    // if token exists then we will first delete that token entirely
    await db.passwordResetToken.delete({
      where: { id: existingToken.id },
    });
  }
  // now add the new token
  const passwordResetToken = await db.passwordResetToken.create({
    data: {
      email,
      token,
      expires,
    },
  });

  return passwordResetToken;
};
