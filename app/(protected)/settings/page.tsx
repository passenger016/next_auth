// if the user is logged out we don't want them access the settings page
// we will be using client components here
"use client";

import { useCurrentUser } from "@/hooks/use-current-user";
import { signOut } from "next-auth/react";

const SettingsPage = () => {
  // we are using the useCurrentUser hook to directly get the data of the `user` other than having to do a session.data?.user everytime
  // we have to stringy the data in order to display it
  const user = useCurrentUser();
  const signOutUser = async () => {
    await signOut();
    // or import logout() from @/actions/logout.ts and call logout() to implement server actions for logout logic.
    // the above approach is better if there is additional logic required before logging out the user or else the current logic works perfectly.
  };

  return (
    <div className="bg-white rounded-xl p-10">
      <button type="submit" onClick={signOutUser}>
        Sign Out
      </button>
    </div>
  );
};

export default SettingsPage;
