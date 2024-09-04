"use client";

import { useRouter } from "next/navigation";

/*In TypeScript, the `?` symbol in an interface definition indicates that a property is optional. 
This means that the property may or may not be provided when an object conforms to that interface.*/

interface LoginButtonProps {
  children: React.ReactNode;
  mode?: "modal" | "redirect";
  asChild?: boolean;
}

export const LoginButton = ({
  children,
  mode = "redirect",
  asChild,
}: LoginButtonProps) => {
  const router = useRouter();

  const onClick = () => {
    console.log("LOGIN BUTTON CLICKED");
    router.push("/auth/login");
  };

  if (mode === "modal") {
    return <span>todo:implement modal</span>;
  }

  return (
    <span onClick={onClick} className="cursor">
      {children}
    </span>
  );
};
