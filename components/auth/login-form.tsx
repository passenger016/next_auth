"use client";

import { LuEye } from "react-icons/lu";
import { LuEyeClosed } from "react-icons/lu";
import { Spinner } from "@/components/ui/spinner";
import { CardWrapper } from "./card-wrapper";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "../ui/input";
import { useEffect, useState, useTransition } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

import * as z from "zod";
import { LoginSchema } from "@/schema";
import { Button } from "../ui/button";
import { FormError } from "../FormError";
import { FormSuccess } from "../FormSuccess";
import { login } from "@/actions/login";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

// we are not exporting default here because this is just a component not a page
export const LoginForm = () => {
  // we are going to use useSearchParams to check the query parameter in the URL
  const searchParams = useSearchParams();
  const urlError =
    searchParams.get("error") === "OAuthAccountNotLinked"
      ? "Email already in use with different provider"
      : "";
  // NOTE: update timer value to 30 secconds in order to avoid spamming the resend button
  const timerDelay: number = 30; // in seconds
  // we are using useTransition to check when server action isPending and during that time we are disabling the button and input fields so that new data doesn't interfare before the server action has been completed
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [showTwoFactor, setShowTwoFactor] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [timerValue, setTimerValue] = useState<number>(timerDelay);
  const [twoFactorSentCount, setTwoFactorSentCount] = useState<number>(0);
  // we will store the email and password in a state variable so that when the user clicks on resend we can use the same email and password to resend the 2FA code
  const [credentials, setCredentials] = useState<{
    email: string;
    password: string;
  } | null>(null);

  // getting the update function from useSession to refresh the session after login
  // router replacement to avoid history issues
  const { update } = useSession();
  const router = useRouter();

  const handleResend = () => {
    if (credentials) {
      login({
        email: credentials.email,
        password: credentials.password,
        code: "",
      }); // triggers resend logic
    }
    setTwoFactorSentCount((prev) => prev + 1);
    setTimerValue(timerDelay);
  };

  // useEffect to handle the timer countdown for resending the 2FA code
  useEffect(() => {
    const timer = setInterval(() => {
      /** IMPORTANT:
       * Timer logic for 2FA countdown:
       * The timer seems to "stop" automatically during form submission or when not in 2FA stage.
       * This happens because:
       * 1. The useEffect depends on [showTwoFactor, isPending, timerValue, twoFactorSentCount].
       *    Whenever any of these values change, React runs the cleanup function and clears the existing interval.
       * 2. When isPending is true (form submission in progress) or showTwoFactor is false (before 2FA),
       *    the interval is cleared, effectively pausing the timer.
       * 3. The conditional inside setInterval (`showTwoFactor && setTimerValue(...)`) ensures the timer only decrements
       *    when in 2FA stage and timerValue > 0.
       * 4. NOTE: the timer doesn't actually "stop" but the interval is cleared and a new one is created when the dependencies change.
       * 5. Since the timer restarts from the last value of timerValue, it continues counting down correctly.
       *
       * Together, React's cleanup + this conditional causes the timer to start, stop, and resume at the expected times.
       */

      showTwoFactor &&
        setTimerValue((prev) => {
          return prev > 0 ? prev - 1 : 0;
        });
      // NOTE: the timerdelay needs to be in miliseconds not in seconds for the interval to work
    }, 1000); // the timer updates every second not every timerDelay * 100 second
    // IMPORTANT: setInterval is supposed to ru~n every second to update the timerValue state variable
    // it has no relation to the timerDelay variable except for the initial value of timerValue state variable
    // the amount of time the timer runs is controlled by the timerValue state variable which is set to timerDelay initially and then decremented every second until it reaches 0

    return () => clearInterval(timer); // clear the interval
  }, [showTwoFactor, isPending, twoFactorSentCount]); // whenever these values changes we will restart the timer

  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
      code: "", // always present, not required unless 2FA
    },
  });

  const onSubmit = (values: z.infer<typeof LoginSchema>) => {
    console.log("FORM SUBMITTED");
    // storing the email and password in the state variable
    setCredentials({ email: values.email, password: values.password });
    // clearing all error and submit messages whenever a new submit is occuring
    setError("");
    setSuccess("");
    // since the zod schema has code set to optional but we neeeded to include in for handling of the logic in the login.ts
    // we will validate if the code has been entered or not here before sending the data to the server
    // if showTwoFactor is true and the code is empty or only spaces then we will set the error
    // checks the code by looking "if it exists" using the optional chaining operator "?"
    // if both the conditions are true then we will set the error or else we will proceed with the login
    if (showTwoFactor && !values.code?.trim()) {
      setError("Code is required");
      return;
    }

    startTransition(() => {
      // alternatively implement a async await logic instead of .then and .catch since it is easier to manage
      login(values)
        .then(async (data) => {
          setError(data?.error);
          if (data?.error) {
            if (showTwoFactor) {
              form.setValue("code", "");
            } else {
              // reset the form if there is an error for better user experience
              form.reset();
            }
            // set the error
            setError(data.error);
            return; // if an error occurs then we will not trigger the window refresh
          }
          if (data?.success) {
            form.reset();
            setSuccess(data.success);
            return; // -- now it's working, if verification email sent successfully then we will not trigger the window refresh
          }
          // Try to refresh next-auth client cache first (preferred)
          // if (update) {
          // try {
          //   await update(); // re-fetches session endpoint and updates useSession()
          // } catch (e) {
          //   // swallow, we'll fallback to router.refresh below
          // }
          // }

          // Ensure server components are re-run so SSR UI reflects new cookie
          // try {
          //   router.refresh();
          // } catch (e) {
          //   // ignore refresh failure
          // }

          // if (data?.isLoggedIn) {
          //   // If the router and session are stale, fallback to full reload
          //   // setTimeout(() => {
          //   //   window.location.reload();
          //   // }, 300); // fallback after short delay if session still not visible
          //   console.log("Reloading window...");
          //   window.location.reload();
          // }

          // temporary solution to the non showing of the protected routes after login using client side session
          // triggering a full window reload to make sure all components are reloaded and the session is fetched again
          console.log("Reloading window...");
          window.location.reload();
          // Optional small delay (uncomment only if you encounter a race):
          // await new Promise((r) => setTimeout(r, 100));
          
          if (data?.twoFactor) {
            setShowTwoFactor(true);
          }
        })
        .catch(() => setError("Something went wrong"));
    });
  };

  return (
    <CardWrapper
      headerLabel="Welcome Back"
      backButtonLabel="Don't have a account?"
      backButtonHref="/auth/register"
      showSocial
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* if twoFactor doesn't exist then we will only show two form fields*/}
          {!showTwoFactor && (
            <>
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="john@example.com"
                        type="email"
                        disabled={isPending}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        {/* the password input is controlled by React Hook Form using the 'field' object, which provides value and onChange. 
                            To toggle password visibility, change the type prop between "password" and "text" based on isPasswordVisible. No separate state for the value is needed. */}
                        <Input
                          {...field}
                          placeholder="******"
                          type={isPasswordVisible ? "text" : "password"}
                          disabled={isPending}
                          className="relative"
                        />
                        {/* top-1/2: moves the button to 50% from the top of the container.
                        -translate-y-1/2: shifts it up by half its own height, perfectly centering it vertically. */}
                        {/* IMPORTANT: By default, a <button> inside a form will act as type="submit" if no type is specified. 
                        This means clicking it will submit the form, which is not what you want for actions like toggling password visibility. */}
                        <button
                          type="button"
                          className="absolute right-0 top-1/2 -translate-y-1/2 p-2"
                          onClick={() =>
                            setIsPasswordVisible(!isPasswordVisible)
                          }
                        >
                          {/* or you can use 'prev' state like  onClick={()=>setIsPasswordVisible((prev) => !prev)} */}
                          {isPasswordVisible ? <LuEye /> : <LuEyeClosed />}
                        </button>
                      </div>
                    </FormControl>
                    {/* the asChild prop tells the Button to render Link component as the actual DOM component and not as a <button> while still applying all the styles of button */}
                    <Button
                      size="sm"
                      variant="link"
                      asChild
                      className="px-0 font-normal"
                    >
                      <Link href="/auth/reset">Forgot Password?</Link>
                    </Button>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </>
          )}
          {/* if we do have twoFactor then we will show only one field for entering and validating the 2FA token*/}
          {showTwoFactor && (
            <>
              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Two Factor Code</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="123456"
                        type="text"
                        disabled={isPending}
                        autoComplete="off"
                      />
                    </FormControl>
                    {/* the asChild prop tells the Button to render Link component as the actual DOM component and not as a <button> while still applying all the styles of button */}
                    <Button
                      size="sm"
                      variant="link"
                      asChild
                      className="px-0 font-normal"
                    ></Button>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </>
          )}
          <FormError message={error || urlError} />
          <FormSuccess message={success} />
          {/* this is the button container */}
          <div className="flex flex-col gap-3">
            {showTwoFactor && (
              <>
                <div className="flex flex-row justify-start items-center">
                  <span className="font-normal text-xs">
                    Haven&apos;t received the code?
                  </span>
                  {timerValue === 0 ? (
                    // all buttons inside a form need to be defined as type="button" because inside a form it defaults to type="submit"
                    <Button
                      type="button"
                      variant="link"
                      className="font-bold"
                      size="sm"
                      onClick={handleResend}
                      disabled={isPending}
                    >
                      Resend Email
                    </Button>
                  ) : (
                    <div className="font-normal text-xs px-3 h-8 inline-flex items-center justify-center whitespace-nowrap">
                      {isPending
                        ? "Timer paused"
                        : `Resend Code in ${timerValue}s`}
                    </div>
                  )}
                </div>
              </>
            )}
            <Button type="submit" className="w-full" disabled={isPending}>
              {/* the button label will change to "Confirm" if twoFactor is on or else t will stay as Login */}
              {isPending ? <Spinner /> : showTwoFactor ? "Confirm" : "Login"}
            </Button>
            {/* TODO: Add a separate button for the 2fa click with a onClick trigger to start the interval and restart it */}
          </div>
        </form>
      </Form>
    </CardWrapper>
  );
};
