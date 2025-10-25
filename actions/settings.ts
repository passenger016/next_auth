"use server";

import { SettingsSchema } from "@/schema";
import * as z from "zod";
import { db } from "@/lib/db";
import { getUserById } from "@/data/user";
import { currentUser } from "@/lib/auth"; // currentUser fetches the current user data using server actions not from client side
import { revalidatePath } from "next/cache";

// the values we will recieved in the settings function will be of the type inferred from SettingsSchema
// this way we ensure type safety and also validation using zod schema
export const settings = async (values: z.infer<typeof SettingsSchema>) => {
  // firstly we will check if the user is authenticated or not
  const user = await currentUser(); // get the current user data
  if (!user) {
    return { error: "Unauthorized" };
  }
  if (!user.id) {
    // handle missing id explicitly
    return { error: "Missing user id" };
  }
  // now check if the user exists in the database
  const dbUser = await getUserById(user.id);
  if (!dbUser) {
    return { error: "User not found" };
  }

  // if the user is linked to an OAUTH provider then we will not allow them to update their fields
  // which are directly managed by the OAUTH provider
  // this code is for handling that case on the server
  // we will also disable it on the client side
  if (user.isOAuthUser) {
    (values.email = undefined), (values.isTwoFactorEnabled = undefined);
  }

  // disabled name checking because of the same form for all the fields
  // check if the entered name is the same as the current name
  // if same then we won't fire the update
  // if (values.name?.trim() === user?.name) {
  //   return { error: "Please use a different name than your current one" };
  // }

  // now we will update the user data in the database
  await db.user.update({
    where: { id: dbUser.id },
    data: {
      ...values,
    },
  });

  // revalidatePath is used to revalidate the server cache for a specific path and is part of the next/cache module
  // do not pass any extension like .tsx — those are source filenames, not URL paths.
  // Route groups (segments wrapped in parentheses, e.g. (protected)) are not part of the public URL. The URL path should reflect the published route.
  // we did call call revalidatePath('/(protected)/server') and it worked, it’s because Next resolved that string — but it's safer and clearer to use the actual public path (the one shown in the browser).
  // that is the best practise is it remove segments wrapped in parentheses from the path while using revalidatePath.
  revalidatePath("/server");

  return { success: "Profile updated successfully" };
};
