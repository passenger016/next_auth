// IMPORTANT: there is no need to mark this component as a "use server" component because it is not a react component
// this is just a utility function to send email using nodemailer
// IMPORTANT: whenever this file is imported in a server component it will be treated as a server component automatically

import { transporter, accountEmail } from "../config/nodemailer";
import {
  passwordResetEmailTemplate,
  verificationEmailTemplate,
} from "./emailTemplate";

// setting the Base Url from the environement variables
const BASE_URL = process.env.DOMAIN_URL;

// function to send verification email using nodemailer
export const sendVerificationEmailNodemailer = async ({
  to,
  subject,
  token,
  userName,
}: {
  to: string | null;
  subject: string;
  token: string;
  userName: string | null;
}) => {
  // first we will validate that all the required fields are present
  if (!to || !subject || !token) {
    throw new Error("Missing required fields");
  }

  // this is the link that will be sent in the email, it is being stored in a constant
  const confirmLink = `${BASE_URL}/auth/new-verification?token=${token}`;

  // object containing the mail options which we will use to generate the email template
  const mailInfo = {
    confirmLink: confirmLink,
    userName: userName,
    projectName: "Next Auth V5",
  };

  const emailTemplate = verificationEmailTemplate(mailInfo);
  //   console.log(`The current email template being used is ${emailTemplate}`);

  // before we start sending we will verify that nodemailer can connect to SMTP server
  await transporter.verify();
  console.log("Server is ready to take our message");

  // final mailing options object
  const mailOptions = {
    from: `"Next Auth V5" <${accountEmail}>`, // <-- custom sender name
    to: to,
    subject: subject,
    html: emailTemplate,
  };

  // this is where the email is being sent using nodemailer
  // older callback style of sending email using nodemailer -- commented out as in vercel serverless enviromenet it might lead to issues
  // transporter.sendMail(mailOptions, (err, info) => {
  //   // if error happens then
  //   if (err) {
  //     // we will use 'return' to break the response
  //     return console.log(
  //       `Error occured while attempting to send a email using Nodemailer: ${err}`
  //     );
  //   }
  //   // else we log the success
  //   console.log("Email sent:" + info.response);
  // });

  // this is where the email is being sent using nodemailer
  // newer async/await style of sending email using nodemailer -- should work fine in vercel serverless enviromenet
  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent:" + info.response);
  } catch (err) {
    console.log(
      `Error occured while attempting to send a email using Nodemailer: ${err}`
    );
  }
};

// function to send password reset email using nodemailer
export const sendPasswordResetEmailNodemailer = async ({
  to,
  subject,
  token,
  userName,
}: {
  to: string | null;
  subject: string;
  token: string;
  userName: string | null;
}) => {
  // first we will validate that all the required fields are present
  if (!to || !subject || !token) {
    throw new Error("Missing required fields");
  }

  // this is the link that will be sent in the email, it is being stored in a constant
  const resetLink = `${BASE_URL}/auth/new-password?token=${token}`;

  // object containing the mail options which we will use to generate the email template
  const mailInfo = {
    resetLink: resetLink,
    userName: userName,
    projectName: "Next Auth V5",
  };

  const emailTemplate = passwordResetEmailTemplate(mailInfo);
  //   console.log(`The current email template being used is ${emailTemplate}`);

  // before we start sending we will verify that nodemailer can connect to SMTP server
  await transporter.verify();
  console.log("Server is ready to take our message");

  // final mailing options object
  const mailOptions = {
    from: `"Next Auth V5" <${accountEmail}>`, // <-- custom sender name
    to: to,
    subject: subject,
    html: emailTemplate,
  };

  // this is where the email is being sent using nodemailer
  // older callback style of sending email using nodemailer -- commented out as in vercel serverless enviromenet it might lead to issues
  // transporter.sendMail(mailOptions, (err, info) => {
  //   // if error happens then
  //   if (err) {
  //     // we will use 'return' to break the response
  //     return console.log(
  //       `Error occured while attempting to send a email using Nodemailer: ${err}`
  //     );
  //   }
  //   // else we log the success
  //   console.log("Email sent:" + info.response);
  // });

  // this is where the email is being sent using nodemailer
  // newer async/await style of sending email using nodemailer -- should work fine in vercel serverless enviromenet
  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent:" + info.response);
  } catch (err) {
    console.log(
      `Error occured while attempting to send a email using Nodemailer: ${err}`
    );
  }
};
