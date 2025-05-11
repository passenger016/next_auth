"use server";
import { auth } from "@/auth";

/* In this page we will directly use server actions here to get the session data */

const ServerPage = async () => {
  // get the session data first
  const session = await auth();

  return <div>{JSON.stringify(session)}</div>;
};

export default ServerPage;
