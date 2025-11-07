import { auth } from "@/auth";
import { cache } from "react";

// NOTE: cache from React is only meant to be used in server components and server actions.
// When you wrap a function with cache, React creates a memoized version of that function.
// When this memoized function is called with specific arguments, it first checks if a result for those exact arguments is already present in its cache.
// If a cached result exists, it returns that value without re-executing the original function.
// If no cached result is found, the original function is executed, its result is stored in the cache for future use with the same arguments, and then the result is returned.

export const getSession = cache(async () => {
  const session = await auth();
  return session;
});

export const currentUser = cache(async () => {
  const session = await getSession();
  return session?.user || null;
});

export const isAdmin = cache(async () => {
  const user = await currentUser();
  return user?.role === "ADMIN";
});