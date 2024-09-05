"use server";

import * as z from "zod";
import { RegisterSchema } from "@/schema";

export const register = async (values: z.infer<typeof RegisterSchema>) => {
  console.log(values); // will be logged in the server

  // client side validation can be easly bypassed
  // hence we will schema validate our data on both sides of the application (server and client)

  const validatedFields = RegisterSchema.safeParse(values);

  // if validation is passed then validationFields.success will be set to `True` else `False` 

  if (!validatedFields.success) 
    return { error: "Invalid Credentials" };

  return { success: "Email Sent!" };
};
