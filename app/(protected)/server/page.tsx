"use server";

import { currentUser } from "@/lib/auth";
import { UserInfo } from "../_components/user-info";

/* In this page we will directly use server actions here to get the session data */
/* currentUser is used to get the session data using server side actions by await auth() */
/* useCurrentUser is used to get the session data using the client side hook useSession() */

const ServerPage = async () => {
  // get the session data first
  const user = await currentUser();
  const alertLabel = "The data being displayed here is fetched using server actions";

  return <UserInfo label="Server component💻" user={user}  alertLabel={alertLabel} />;
};

export default ServerPage;
