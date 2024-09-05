"use server";

import * as z from "zod";
import { LoginSchema } from "@/schema";

export const login = async (values: z.infer<typeof LoginSchema>) => {
  console.log(values); // will be logged in the server

  // client side validation can be easly bypassed
  // hence we will schema validate our data on both sides of the application (server and client)

  const validatedFields = LoginSchema.safeParse(values);

  // if validation is passed then validationFields.success will be set to `True` else `False` 

  if (!validatedFields.success) 
    return { error: "Invalid Credentials" };

  return { success: "Email Sent!" };
};
