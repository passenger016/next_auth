// utility functions to get/modify the passowrd reset token by querying the appropiate table in the database

import { db } from "@/lib/db";

export const getPasswordResetTokenbyToken = async (token: string) => {
  try {
    const passwordResetToken = db.passwordResetToken.findUnique({
      where: { token },
    });
    return passwordResetToken;
  } catch (err) {
    // if no token exists then just return null which will get stored in passwordToken
    return null;
  }
};

export const getPasswordResetTokenbyEmail = async (email: string) => {
  try {
    const passwordResetToken = db.passwordResetToken.findFirst({
      where: { email },
    });
    return passwordResetToken;
  } catch (err) {
    // if no token exists then just return null it will be caught by the appropiate variable when this function is being called and the error will be dealt with accordingly there
    return null;
  }
};
