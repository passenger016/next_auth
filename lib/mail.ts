import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendVerificationEmail = async (email: string, token: string) => {
  // this is the link that will be sent in the email, it is being stored in a constant
  const confirmLink = `https://localhost:3000/auth/new-verification?token=${token}`;

  // this is where the email is being sent
  await resend.emails.send({
    from: "onboarding@resend.dev",
    to: email,
    subject: "Confirm Your Email",
    html: `
    <p>Please Click on the link given below to confirm your email</p>
    <p><a href=${confirmLink}>here</a></p>
    `,
  });
};
