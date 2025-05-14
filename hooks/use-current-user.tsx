"use client";

// we will export the user part from the session object so that we can use it directly instead of having to referrence it using user.session.user
import { useSession } from "next-auth/react";

export const useCurrentUser = () => {
  const session = useSession();
  return session.data?.user;
};
