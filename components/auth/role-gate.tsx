"use client";

import userCurrentRole from "@/lib/currentRole";
import { UserRole } from "@prisma/client";
import { FormError } from "../FormError";

interface RoleGateProps {
  children: React.ReactNode;
  allowedRole: UserRole;
}

export const RoleGate = async ({ children, allowedRole }: RoleGateProps) => {
  const role = await userCurrentRole();

  if (role !== allowedRole) {
    return <FormError message="You are not authorized to view this page." />;
  }

  // if the user if allowed to view the content then we render the children or else not.
  return <>{children}</>;
};
