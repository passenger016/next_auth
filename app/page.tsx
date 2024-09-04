import { Poppins } from "next/font/google";

import Image from "next/image";
import { Button } from "@/components/ui/button"; // using the import alias "@" which is equivalent to being in the root of the application
import { cn } from "@/lib/utils";
import { LoginButton } from "@/components/auth/login-button";

const font = Poppins({
  subsets: ["latin"],
  weight: ["600"],
});

export default function Home() {
  return (
    <main className="flex h-full flex-col items-center justify-center bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-sky-400 to-blue-800">
      <div className="space-y-6 text-center">
        <h1
          className={cn(
            "text-6xl font-semibold text-white drop-shadow-md",
            font.className
          )}
        >
          🔏Auth
        </h1>
        <p className="text-white text-lg">A simple authentication system</p>
        <LoginButton>
          {/* the shadcn ui components have props assigned to them and we can also add our own custom props as variants to the components */}
          <Button size="lg" variant="secondary">
            Sign In
          </Button>
        </LoginButton>
      </div>
    </main>
  );
}
