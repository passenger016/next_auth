"use client";

import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { signIn } from "next-auth/react";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";

export const Socials = () => {

  const onClick = (provider: "google" | "github")=>{
    signIn(provider,{
      callbackUrl: DEFAULT_LOGIN_REDIRECT // similar to the callbackUrl in server actions
    })
  }

  return <div className="flex items-cnter w-full gap-x-2">
    <Button size="lg" className="w-full" variant="outline" onClick={()=>{onClick("google")}}>
        <FcGoogle className="h-5 w-5" />
    </Button>
    <Button size="lg" className="w-full" variant="outline" onClick={()=>{onClick("github")}}>
        <FaGithub className="h-5 w-5" />
    </Button>
  </div>;
};
