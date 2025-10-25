import * as z from "zod";

export const NewPasswordSchema = z.object({
  /* the .min() function is used to specify that a minimum of 1 character is required */
  password: z.string().min(6, {
    message: "Minimum 6 characters required",
  }),
});

export const PasswordResetSchema = z.object({
  email: z
    .string()
    .email
    /* you can add a property called `message:""` and whatever you add there will be displyed whenever an invalid input is 
    encountered or else the default input will bs used */
    (),
});

export const LoginSchema = z.object({
  email: z
    .string()
    .email
    /* you can add a property called `message:""` and whatever you add there will be displyed whenever an invalid input is 
    encountered or else the default input will bs used */
    (),
  /* the .min() function is used to specify that a minimum of 1 character is required */
  password: z.string().min(1, {
    message: "Password is required",
  }),
  /* an additional field which will be used when the 2fa token has to be entered */
  code: z.optional(z.string()),
});

export const RegisterSchema = z.object({
  email: z.string().email(
    /* you can add a property called `message:""` and whatever you add there will be displyed whenever an invalid input is 
    encountered or else the default input will bs used */
    {
      message: "Email is required",
    }
  ),
  /* the .min() function is used to specify that a minimum of 1 character is required */
  password: z.string().min(6, {
    message: "Minimum 6 characters required",
  }),
  name: z.string().min(3, {
    message: "Name is required with minimum 3 characters",
  }),
});

/* schema for user profile under /settings page */
export const SettingsSchema = z.object({
  name: z.optional(
    z.string().min(3, { message: "Name is required with minimum 3 characters" })
  ),
  isTwoFactorEnabled: z.optional(z.boolean()),
  email: z.optional(z.string().email({ message: "Invalid email address" })),
  // TODO: implement password change functionality either here or on a separate page
  // but instead of taking an input old password and new password,
  // we will take new password and confirm new password fields for better UX
});
