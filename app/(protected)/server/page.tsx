"use server";

import { currentUser } from "@/lib/auth";

/* In this page we will directly use server actions here to get the session data */

const ServerPage = async () => {
  // get the session data first
  const user = await currentUser();

  return <div>{JSON.stringify(user)}</div>;
};

export default ServerPage;
