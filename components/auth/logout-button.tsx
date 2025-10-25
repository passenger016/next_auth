"use client";

import { logout } from "@/actions/logout";
import { useRouter } from "next/navigation";

interface LogoutButtonProps {
  children?: React.ReactNode;
}

export const LogoutButton = ({ children }: LogoutButtonProps) => {
  const router = useRouter();
  const logoutUser = async () => {
    await logout();
    router.replace("/login");
  };

  return (
    <span onClick={logoutUser} className="cursor-pointer">
      {children}
    </span>
  );
};
