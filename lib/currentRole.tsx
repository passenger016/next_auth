import { auth } from "@/auth";

/* NOTE: in the tutorial the session data for admin was being extracted using the client side useSession() in /hooks folder and under 
the file name `use-current-role` but for some reason it was resulting in errors so I am using the 
server side "auth" to display the data of the USER instead */

export default async function userCurrentRole() {
  // get the session data using the server side auth
  const session = await auth();
  // extract `role` from the session object
  const role = session?.user?.role;

  return role;
}
