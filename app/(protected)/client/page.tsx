"use client";

import { currentUser } from "@/lib/auth";
import { UserInfo } from "../_components/user-info";
import { useCurrentUser } from "@/hooks/use-current-user";

/* In this page we will directly use client actions here to get the session data */
/* useCurrentUser is used to get the session data using the client side hook useSession() */
/* currentUser is used to get the session data using server side actions by await auth() */

const ClientPage = () => {
  // get the session data first
  const user = useCurrentUser();

  return <UserInfo label="Client component📱" user={user} />;
};

export default ClientPage;
