// if the user is logged out we don't want them access the settings page
// we will be using client components here
"use client";

import { useSession, signOut } from "next-auth/react";

const SettingsPage = () => {
  const session = useSession();
  const signOutUser = async () => {
    await signOut();
  };

  return (
    <div>
      {JSON.stringify(session)}
      <button type="submit" onClick={signOutUser}>
        Sign Out
      </button>
    </div>
  );
};

export default SettingsPage;
