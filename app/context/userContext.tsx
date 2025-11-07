"use client";

import { createContext, useContext } from "react";

// createContext creates a React Context object which allows you to share data (in this case user) across the component tree without passing props manually at every level.
// The initial/default value is null.
const UserContext = createContext<any>(null);

// Defines a custom hook that wraps useContext(UserContext).
// Any component can call useUser() to get the current user from context.
// useContext subscribes the component to this context, so it re-renders if context value changes
export const useUser = () => useContext(UserContext);

// A wrapper component to provide a user value to all child components.
// It wraps its children with <UserContext.Provider>.
// Passes the user data down via the value prop of the provider.
// Any component inside this provider in the tree can access the user through the useUser hook.
export function UserProvider({
  user,
  children,
}: {
  user: any;
  children: React.ReactNode;
}) {
  return <UserContext.Provider value={user}>{children}</UserContext.Provider>;
}

/* SUMMARY: 
- This pattern enables global state sharing (the user object) in a React app without prop drilling.
- UserProvider wraps parts of your app to make user accessible via React Context.
- Components can simply call useUser() to access the current user wherever they are in the tree. */