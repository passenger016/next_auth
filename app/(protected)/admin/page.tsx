/* NOTE: if you are using the currentRole function from the /lib folder then you cannot have this file as client component */
/* for using server side actions using currentRole we also need to add an `async` and `await` */
/* if you are using useCurrentRole from the /hooks folder then you need to have this file as a client component and not use async and await */

import currentRole from "@/lib/currentRole";

const AdminPage = async () => {
  const role = await currentRole();
  return <div>Admin Page role:{role}</div>;
};

export default AdminPage;
