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

/* schema for the pass word reset form for logged in users */
/* 
  IMPORTANT: the password reset schema on the top is used for logged out users
  this schema is used to validate the password reset form for logged in users 
*/
export const PasswordResetSecuritySchema = z
  .object({
    password: z.optional(
      z.string().min(6, { message: "Minimum 6 characters required" })
    ),
    confirmPassword: z.optional(
      z.string().min(6, { message: "Minimum 6 characters required" })
    ),
  })
  // .refine((data) => { //--> commented out in favor of .superRefine
  //   // if password is missing but confirm password is entered
  //   if (!data.password && data.confirmPassword) {
  //     // return false;
  //   }
  //   // if password has been entered but confirm password is missing
  //   if (data.password && !data.confirmPassword) {
  //     // return false;
  //   }
  //   // if the password and confirm password do not match then we will return false
  //   if (data.password !== data.confirmPassword) {
  //     // return false;
  //   }
  //   // else we will continue with the normal flow
  //   return true;
  // });
  .superRefine((data, ctx) => {
    if (!data.password && data.confirmPassword) {
      // Add error for password if confirmPassword is entered but password is missing
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Please enter your password first",
        path: ["password"], // specify the path to the password field
      });
    }

    if (data.password && !data.confirmPassword) {
      // Add error for confirmPassword if password is entered but confirmPassword is missing
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Please confirm your password",
        path: ["confirmPassword"], // specify the path to the confirmPassword field
      });
    }

    if (data.password !== data.confirmPassword) {
      // Add error for confirmPassword if passwords do not match
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Passwords do not match",
        path: ["confirmPassword"],
      });
    }
  });
/* schema for logged in user password validation before allowing password reset */
export const ValidatePasswordSchema = z.object({
  password: z.optional(
    z.string().min(1, {
      message: "Password is required",
    })
  ),
});
