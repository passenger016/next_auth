"use client";

import { UserButton } from "@/components/auth/user-button";
import { Button } from "@/components/ui/button";
import clsx from "clsx";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { signOut } from "next-auth/react";

export const Navbar = () => {
  const pathName = usePathname();
  console.log(pathName);

  const [isActive, setIsActive] = useState(false);
  // we can use the async and await logic inside a client component as well
  // however the difference between a client and a server component is that the server component itself can be async and awaited
  // whereas in a client component we need to define a function which can be async and awaited
  // also note that the function defined inside the client component cannot be async itself as it is an event handler function
  // so we define another async function inside the event handler function and call it
  // this is because the event handler function expects a return type of void and if we make it async then it will return a promise which is not expected
  // hence we define another async function inside the event handler function and call it
  const signOutUser = async () => {
    await signOut();
  };

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
          "md:hidden md:h-auto absolute h-[100vh] bg-white w-[75%] top-0 right-0 p-4 justify-between z-10",
          isActive ? "flex" : "hidden"
        )}
      >
        {/* outer container for both the mobile nav items and the logout button */}
        <div className="flex flex-col mt-36 w-full justify-between">
          {/* this part contains other tabs in the navbar */}
          <div className={clsx("flex flex-col w-full")}>
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
          <Button variant="link" onClick={signOutUser}>
            Sign Out
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
