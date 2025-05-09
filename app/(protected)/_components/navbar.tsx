"use client";

import { UserButton } from "@/components/auth/user-button";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { usePathname } from "next/navigation";

export const Navbar = () => {
  const pathName = usePathname();
  console.log(pathName);

  return (
    <nav className="bg-secondary flex justify-between items-center rounded-xl p-4 w-[600px]">
      {/* this part contains other tabs in the navbar */}
      <div className="flex g-x-2">
        <Button
          asChild
          variant={pathName === "/settings" ? "default" : "outline"}
        >
          <Link href="/settings">Settings</Link>
        </Button>
        <Button
          asChild
          variant={pathName === "/client" ? "default" : "outline"}
        >
          <Link href="/client">Client</Link>
        </Button>
        <Button
          asChild
          variant={pathName === "/server" ? "default" : "outline"}
        >
          <Link href="/server">Server</Link>
        </Button>
        <Button asChild variant={pathName === "/admin" ? "default" : "outline"}>
          <Link href="/admin">Admin</Link>
        </Button>
      </div>
      {/* this part contains the user button which has a dropdown to logout of the app */}
      <UserButton />
    </nav>
  );
};
