import { getVerificationTokenByEmail } from "@/data/verification-token";
import { v4 as uuidv4 } from "uuid";
import { db } from "./db";

// token is generated when the user clicks on a button to generate a new token for email verification so it can be replaced as many tims as the user clicks for a new verification token
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
