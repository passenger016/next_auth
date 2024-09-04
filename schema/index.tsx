import * as z from "zod";

export const LoginSchema = z.object({
  email: z.string().email(
    /* you can add a property called `message:""` and whatever you add there will be displyed whenever an invalid input is 
    encountered or else the default input will bs used */
  ),
  /* the .min() function is used to specify that a minimum of 1 character is required */
  password: z.string().min(1,{
    message:"Password is required"
  }),
});
