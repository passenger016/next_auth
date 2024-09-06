"use server";

import * as z from "zod";
import { LoginSchema } from "@/schema";
import { signIn } from "@/auth";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { AuthError } from "next-auth";

export const login = async (values: z.infer<typeof LoginSchema>) => {
  console.log(values); // will be logged in the server

  // client side validation can be easly bypassed
  // hence we will schema validate our data on both sides of the application (server and client)
  // In the context of LoginSchema.safeParse(values), this line is used to validate the values object against the schema defined in LoginSchema. Here’s a detailed breakdown of its usage and purpose:
  const validatedFields = LoginSchema.safeParse(values);

  // if validation is passed then validationFields.success will be set to `True` else `False`
  if (!validatedFields.success) return { error: "Invalid Credentials" };

  const { email, password } = validatedFields.data;

  try{
    // we are using the "credentials" provider by NextAuth in this case
    await signIn("credentials",{
      email,
      password,
      redirectTo: DEFAULT_LOGIN_REDIRECT
    })
  }
  catch(err){
    if(err instanceof AuthError){
      switch (err.type){
        case "CredentialsSignin": 
          return {error: "Inavlid credentials"}
          break;
        default:
          return {error: "Something went wrong"}
      }
    }
    // also we need to throw the error because next js recommends it
    throw err
  }

};
