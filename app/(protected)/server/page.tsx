"use server";

import { currentUser } from "@/lib/auth";
import { UserInfo } from "../_components/user-info";

/* In this page we will directly use server actions here to get the session data */

const ServerPage = async () => {
  // get the session data first
  const user = await currentUser();

  return <UserInfo label="hello" />;
};

export default ServerPage;
