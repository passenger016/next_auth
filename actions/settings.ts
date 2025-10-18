"use server";

import { SettingsSchema } from "@/schema";
import * as z from "zod";
import { db } from "@/lib/db";
import { getUserById } from "@/data/user";
import { currentUser } from "@/lib/auth"; // currentUser fetches the current user data using server actions not from client side

// the values we will recieved in the settings function will be of the type inferred from SettingsSchema
// this way we ensure type safety and also validation using zod schema
export const settings = async (values: z.infer<typeof SettingsSchema>) => {
  // firstly we will check if the user is authenticated or not
  const user = await currentUser(); // get the current user data
  if (!user) {
    return { error: "Unauthorized" };
  }
  // now check if the user exists in the database
  const dbUser = await getUserById(user.id);
  if (!dbUser) {
    return { error: "User not found" };
  }

  // now we will update the user data in the database
  await db.user.update({
    where: { id: dbUser.id },
    data: {
      ...values,
    },
  });
  return { success: "Profile updated successfully" };
};
