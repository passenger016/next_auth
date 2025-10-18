// if the user is logged out we don't want them access the settings page
// we will be using client components here
"use client";

import { useCurrentUser } from "@/hooks/use-current-user";
import { signOut, useSession } from "next-auth/react";
import { CardContent, CardHeader, Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { settings } from "@/actions/settings";
import { useTransition } from "react";

/* 
  NOTE: async await functions can be used in a client component but they cannot be used directly in the component body
  they can be used in event handlers or useEffect hooks 
*/
const SettingsPage = () => {
  // we are using useTransition to manage the pending state of the server action
  // isPending and startTransition are destructured from useTransition hook
  // they are the standard way of handling transitions in React
  const [isPending, startTransition] = useTransition();

  // we are using the useCurrentUser hook to directly get the data of the `user` other than having to do a session.data?.user everytime
  // we have to stringy the data in order to display it
  const user = useCurrentUser();
  const signOutUser = async () => {
    await signOut();
    // or import logout() from @/actions/logout.ts and call logout() to implement server actions for logout logic.
    // the above approach is better if there is additional logic required before logging out the user or else the current logic works perfectly.
  };

  const { update } = useSession();

  const updateName = () => {
    startTransition(() => {
      settings({
        name: "hui",
      }).then(() => {
        update(); // to update the session data after the settings have been updated
      });
    });
  };

  return (
    <Card className="w-[80%] md:w-[600px] shadow-md">
      <CardHeader>
        <h2 className="text-2xl font-semibold text-center">⚙️Settings</h2>
      </CardHeader>
      <CardContent>
        {/* Button with sign out functionality as a example of implementing signOut or related server actions logic on a client component */}
        {/* <Button variant="outline" onClick={signOutUser}>
          Sign Out
        </Button> */}
        {/* Button will be diabled during the transition */}
        <Button onClick={updateName} disabled={isPending}>
          Update Name
        </Button>
      </CardContent>
    </Card>
  );
};

export default SettingsPage;
