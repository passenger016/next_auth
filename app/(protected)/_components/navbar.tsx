"use client";

import { UserButton } from "@/components/auth/user-button";
import { Button } from "@/components/ui/button";
import clsx from "clsx";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

export const Navbar = () => {
  const pathName = usePathname();
  console.log(pathName);

  const [isActive, setIsActive] = useState(false);

  return (
    <>
      {/* hamburger menu button */}
      <button
        className={clsx(
          "md:hidden hamburger hamburger--slider visible absolute top-6 right-6 z-[100]",
          isActive ? "is-active" : ""
        )}
        type="button"
        // setIsActive takes the previous state and toggles it
        // it is not the event object rather the state stored in the isActive and it is a boolean value
        // 'prev' here refers to the previous state of 'isActive'
        onClick={() => setIsActive((prev) => !prev)}
      >
        <span className="hamburger-box">
          <span className="hamburger-inner"></span>
        </span>
      </button>

      {/* navbar for tablet and mobile view */}
      <nav
        className={clsx(
          "md:hidden absolute bg-white min-h-screen w-[75%] top-0 right-0 p-4 justify-between z-10",
          isActive ? "flex" : "hidden"
        )}
      >
        {/* this part contains other tabs in the navbar */}
        <div className={clsx("flex flex-col mt-36 w-full")}>
          <Button
            asChild
            variant={pathName === "/settings" ? "default" : "link"}
            onClick={() => setIsActive(false)}
          >
            <Link href="/settings">Settings</Link>
          </Button>
          <Button
            asChild
            variant={pathName === "/client" ? "default" : "link"}
            onClick={() => setIsActive(false)}
          >
            <Link href="/client">Client</Link>
          </Button>
          <Button
            asChild
            variant={pathName === "/server" ? "default" : "link"}
            onClick={() => setIsActive(false)}
          >
            <Link href="/server">Server</Link>
          </Button>
          <Button
            asChild
            variant={pathName === "/admin" ? "default" : "link"}
            onClick={() => setIsActive(false)}
          >
            <Link href="/admin">Admin</Link>
          </Button>
        </div>
      </nav>
      {/* navbar for screens larger than medium view */}
      <nav className="bg-secondary hidden md:flex justify-between items-center rounded-xl p-4 md:w-[600px]">
        {/* this part contains other tabs in the navbar */}
        <div className="flex gap-x-2">
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
          <Button
            asChild
            variant={pathName === "/admin" ? "default" : "outline"}
          >
            <Link href="/admin">Admin</Link>
          </Button>
        </div>
        {/* this part contains the user button which has a dropdown to logout of the app */}
        <UserButton />
      </nav>
    </>
  );
};
