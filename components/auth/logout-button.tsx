"use client";

import { logout } from "@/actions/logout";

interface LogoutButtonProps {
  children?: React.ReactNode;
}

export const LogoutButton = ({ children }: LogoutButtonProps) => {
  const logoutUser = () => {
    logout();
  };

  return (
    <span onClick={logoutUser} className="cursor-pointer">
      {children}
    </span>
  );
};
