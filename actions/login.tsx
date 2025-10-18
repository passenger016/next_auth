"use server";

// these are supposed to be .ts file no need for a .tsx file

import * as z from "zod";
import { LoginSchema } from "@/schema";
import { signIn } from "@/auth";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { AuthError } from "next-auth";
import {
  generateVerificationToken,
  generateTwoFactorToken,
} from "@/lib/tokens";
import { getUserByEmail } from "@/data/user";
import { sendVerificationEmail, sendTwoFactorEmail } from "@/lib/mail";
import { getTwoFactorTokenByEmail } from "@/data/two-factor-token";
import { db } from "@/lib/db";
import { getTwoFactorConfirmationByUserId } from "@/data/two-factor-confirmation";
import {
  sendTwoFactorAuthEmailNodemailer,
  sendVerificationEmailNodemailer,
} from "@/lib/mailUsingNodemailer";
import bcryptjs from "bcryptjs";

export const login = async (values: z.infer<typeof LoginSchema>) => {
  console.log(values); // will be logged in the server

  // client side validation can be easly bypassed
  // hence we will schema validate our data on both sides of the application (server and client)
  // In the context of LoginSchema.safeParse(values), this line is used to validate the values object against the schema defined in LoginSchema.
  const validatedFields = LoginSchema.safeParse(values);

  // if validation is passed then validationFields.success will be set to `True` else `False`
  if (!validatedFields.success) return { error: "Invalid Credentials" };

  // we are destructring the email, password and the code(which might or might not exist depending on whether 2FA is enabled or not)
  const { email, password, code } = validatedFields.data;

  const existingUser = await getUserByEmail(email);

  if (!existingUser || !existingUser.password || !existingUser.email) {
    return { error: "Email does not exist or does not exist on credentials" };
  }

  // if email exists but the user is not verified in that case as well we will stop the login and resend the verification token with a new token
  if (!existingUser.emailVerified) {
    // passing the existing user email to generate the new verification token
    const verificationToken = await generateVerificationToken(
      existingUser.email
    );

    // TODO: when sending the email using nodemailer we need to extract the 'name' of the person from the 'existingUser' object

    // sending email using nodemailer
    await sendVerificationEmailNodemailer({
      to: existingUser.email,
      subject: "Please verify your email",
      token: verificationToken.token,
      userName: existingUser.name,
    });

    // sending email using the resend service -- commented out because we are now using nodemailer
    // await sendVerificationEmail(
    //   verificationToken.email,
    //   verificationToken.token
    // );

    return { success: "Confirmation Email Resent!" };
  }

  // if the email exists and the user is verified then we will check if the password matches the one in the database
  // IMPORTANT: this step is imoportant to make sure that if the 2FA is enabled we will not send the 2FA code to the email if the password itself is wrong
  const passwordCheck = await bcryptjs.compare(password, existingUser.password); // NOTE: the correct order is to put the plain text password first and then the hashed password second

  if (!passwordCheck) return { error: "Invalid Credentials" };

  // checking if the user exists and has two factor enabled
  if (existingUser.isTwoFactorEnabled && existingUser.email) {
    // since there is only one button which will be used for both the funtionality of login and sending 2FA email
    // we will differentiate based on whether we have the 2FA code or not if we have the code that means the email has been sent
    if (typeof code === "string" && code.trim().length > 0) {
      // we will verify the code
      const twoFactorToken = await getTwoFactorTokenByEmail(existingUser.email);
      // if after querying the database we couldn't find the 2FA token then we will return a appropiate error.
      if (!twoFactorToken) return { error: "Invalid code!" };

      // if the code being entered is not equal to the code in the db then return appropiate error.
      if (twoFactorToken.token !== code) return { error: "Invalid code!" };

      // check if the code has expired
      const hasExpired = new Date(twoFactorToken.expires) < new Date();

      // regardless of wether the code is correct or not we will return the code has expired
      if (hasExpired) {
        return { error: "Code has expired" };
      }

      // if the code has successfully passed all the checks and is still valid then we will delete it from the database and move ahead with the process of logging in
      await db.twoFactorToken.delete({
        where: { id: twoFactorToken.id },
      });

      // check if we have an existing confirmation
      const existingConfirmation = await getTwoFactorConfirmationByUserId(
        existingUser.id
      );

      // if an existing confirmation exists then delete that as well
      if (existingConfirmation) {
        await db.twoFactorConfirmation.delete({
          where: { id: existingConfirmation.id },
        });
      }

      // finally add the new confirmation
      await db.twoFactorConfirmation.create({
        data: {
          userId: existingUser.id,
        },
      });
      try {
        // we are using the "credentials" provider by NextAuth in this case
        await signIn("credentials", {
          email,
          password,
          redirectTo: DEFAULT_LOGIN_REDIRECT,
        });
      } catch (err) {
        if (err instanceof AuthError) {
          switch (err.type) {
            case "CredentialsSignin":
              return { error: "Inavlid credentials" };
            default:
              return { error: "Something went wrong" };
          }
        }
        // also we need to throw the error because next.js recommends it
        throw err;
      }
    }
    // if the code doesn't exist that means the email has not been sent and we need to send it.
    else {
      // if the user exists and has two factor enabled then we will generate the two factor token using the user's email
      const twoFactorToken = await generateTwoFactorToken(existingUser.email);

      // sending two factor email using nodemailer
      await sendTwoFactorAuthEmailNodemailer({
        to: twoFactorToken.email,
        subject: "Your 2FA code for login",
        token: twoFactorToken.token,
        userName: existingUser.name,
      });

      // older way of sending email using the resend service -- commented out because we are now using nodemailer
      // then we will send that token using the email sending utitlity function
      // await sendTwoFactorEmail(twoFactorToken.email, twoFactorToken.token);
    }

    // returning the frontend a sepcific value
    return { twoFactor: true };
  }

  try {
    // we are using the "credentials" provider by NextAuth in this case
    await signIn("credentials", {
      email,
      password,
      redirectTo: DEFAULT_LOGIN_REDIRECT,
    });
  } catch (err) {
    if (err instanceof AuthError) {
      switch (err.type) {
        case "CredentialsSignin":
          return { error: "Inavlid credentials" };
        default:
          return { error: "Something went wrong" };
      }
    }
    // also we need to throw the error because next.js recommends it
    throw err;
  }
};
