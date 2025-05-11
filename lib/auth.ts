import { auth } from "@/auth";

export const currentUser = async () => {
  // get the session data using server actions
  const session = await auth();

  // if session exists then return session.user for the user data
  return session?.user
};
