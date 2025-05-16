/* NOTE: if you are using the currentRole function from the /lib folder then you cannot have this file as client component */
/* for using server side actions using currentRole we also need to add an `async` and `await` */
/* if you are using useCurrentRole from the /hooks folder then you need to have this file as a client component and not use async and await */

import { RoleGate } from "@/components/auth/role-gate";
import { FormSuccess } from "@/components/FormSuccess";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { UserRole } from "@prisma/client";

const AdminPage = async () => {
  return (
    <Card className="w-[600px]">
      <CardHeader>
        <p className="text-2xl font-semibold text-center">Admin Page🔑</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <RoleGate allowedRole={UserRole.ADMIN}>
          {/* the children being passed here will only be rendered on the conditional rendering of the RoleGate if the user has the required rol or else not */}
          <FormSuccess message="You are allowed to see this content" />
        </RoleGate>
      </CardContent>
    </Card>
  );
};

export default AdminPage;
