"use client";

import { UserInfo } from "../_components/user-info";
import { useUser } from "@/app/context/userContext";

/* In this page we will directly use client actions here to get the session data */
/* useCurrentUser is used to get the session data using the client side hook useSession() */
/* currentUser is used to get the session data using server side actions by await auth() */

const ClientPage = () => {
  // get the session data first
  // const user = useCurrentUser(); -- older method for fetching session data
  const user = useUser(); // new method for fetching user data from context that is being passed from the '@/app/layout.tsx' file

  const alertLabel =
    "The data being displayed here is fetched using client hooks";
  return (
    <UserInfo label="Client component📱" user={user} alertLabel={alertLabel} />
  );
};

export default ClientPage;
