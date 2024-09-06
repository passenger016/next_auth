"use server";

import bcryptjs from "bcryptjs";
import * as z from "zod";
import { RegisterSchema } from "@/schema";
import { db } from "@/lib/db";
import { getUserByEmail } from "@/data/user";

export const register = async (values: z.infer<typeof RegisterSchema>) => {
  // console.log(values); // will be logged in the server

  // client side validation can be easly bypassed
  // hence we will schema validate our data on both sides of the application (server and client)

  const validatedFields = RegisterSchema.safeParse(values);

  // if validation is passed then validationFields.success will be set to `True` else `False`

  if (!validatedFields.success) return { error: "Invalid Credentials" };

  // destructuring the data from the validated fields once we are confirmed that the fields being entered are valid
  const { email, password, name } = validatedFields.data;
  // hashing the password using bcrypt
  const hashedPassword = await bcryptjs.hash(password, 10);

  // confirming that email that has been entered is not already taken
  const existingUser = await getUserByEmail(email);

  // if user exists then prompt an error message
  if (existingUser) return { error: "Email Already Taken" };

  // else you can create an user
  await db.user.create({
    data: {
      name,
      email,
      // make sure to use the hashedPassword in the database not the plain password
      password: hashedPassword,
    },
  });

  // TODO: Send verification token email

  return { success: "User created!" };
};
