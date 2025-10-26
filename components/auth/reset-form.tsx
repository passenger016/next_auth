"use client";

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

import * as z from "zod";
import { PasswordResetSchema } from "@/schema";
import { Button } from "../ui/button";
import { FormError } from "../FormError";
import { FormSuccess } from "../FormSuccess";
import { reset } from "@/actions/reset";
import { Spinner } from "../ui/spinner";

// we are not exporting default here because this is just a component not a page
export const ResetForm = () => {
  const [resetPassSentCount, setResetPassSentCount] = useState<number>(0); // to keep track of how many times the reset link has been sent
  // const [attemptCount, setAttemptCount] = useState<number>(0);
  let timerDelay: number = resetPassSentCount === 0 ? 0 : 30; // in seconds
  // we are using useTransition to check when server action isPending and during that time we are disabling the button and input fields so that new data doesn't interfare before the server action has been completed
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [timerValue, setTimerValue] = useState<number>(timerDelay);
  const [disablePassButton, setDisablePassButton] = useState<boolean>(false);
  // we will store the email and password in a state variable so that when the user clicks on resend we can use the same email and password to resend the 2FA code
  const [credentials, setCredentials] = useState<{
    email: string;
    password: string;
  } | null>(null);

  // this function is not useful here since we have a dedicated send reset link button
  // but we will keep it here for future reference
  // we will however disable the send reset link button until the timer reaches 0
  const handleResend = () => {
    if (credentials) {
      reset({
        email: credentials.email,
      }); // triggers resend logic
    }
    setResetPassSentCount((prev) => prev + 1);
    setTimerValue(timerDelay);
  };

  // useEffect to handle the timer countdown for resending the 2FA code
  useEffect(() => {
    // if the attempt count is greater than 0, we will start the timer for resending the reset link
    if (resetPassSentCount > 0) {
      setTimerValue(timerDelay);
    }
    const timer = setInterval(() => {
      /** IMPORTANT:
       * Timer logic for 2FA countdown:
       * The timer seems to "stop" automatically during form submission or when not in 2FA stage.
       * This happens because:
       * 1. The useEffect depends on [showTwoFactor, isPending, timerValue, resetPassSentCount].
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
      setTimerValue((prev) => {
        return prev > 0 ? prev - 1 : 0;
      });
      // NOTE: the timerdelay needs to be in miliseconds not in seconds for the interval to work
    }, 1000); // the timer updates every second not every timerDelay * 100 second
    // IMPORTANT: setInterval is supposed to run every second to update the timerValue state variable
    // it has no relation to the timerDelay variable except for the initial value of timerValue state variable
    // the amount of time the timer runs is controlled by the timerValue state variable which is set to timerDelay initially and then decremented every second until it reaches 0

    return () => clearInterval(timer); // clear the interval
  }, [isPending, resetPassSentCount]); // whenever these values changes we will restart the timer

  // useEffect to disable the send reset link button when the timer is running
  // we will only observer the timerValue state variable here
  // if the timer value changes we will check if it is greater than 0 and disable the button accordingly
  useEffect(() => {
    setDisablePassButton(timerValue > 0);
  }, [timerValue]);

  const onSubmit = (values: z.infer<typeof PasswordResetSchema>) => {
    console.log("FORM SUBMITTED");

    // clearing all error and submit messages whenever a new submit is occuring
    setError("");
    setSuccess("");

    startTransition(() => {
      reset(values).then((data) => {
        setError(data?.error);
        setSuccess(data?.success);
        // incresing the attempt count only if there was no error
        if (data?.success) {
          setResetPassSentCount((prev) => prev + 1);
        }
      });
    });

    console.log(values);
  };

  const form = useForm<z.infer<typeof PasswordResetSchema>>({
    resolver: zodResolver(PasswordResetSchema),
    defaultValues: {
      email: "",
    },
  });

  return (
    <CardWrapper
      headerLabel="Reset your password"
      backButtonLabel="Back to Login"
      backButtonHref="/auth/login"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
          <FormError message={error} />
          <FormSuccess message={success} />
          {/* this is the button container */}
          <div className="flex flex-col gap-3">
            {/* show resend button text and timer only if the code is being send the second time onwards. */}
            {resetPassSentCount > 0 ? (
              <>
                <div className="flex flex-row justify-start items-center">
                  <span className="font-normal text-xs">
                    Haven&apos;t received the code?
                  </span>
                  {timerValue === 0 ? (
                    // since we have a dedicated send reset link button, we will just show a text here
                    // still keeping the button code commented for future reference -- uncomment if needed

                    // all buttons inside a form need to be defined as type="button" because inside a form it defaults to type="submit"
                    // <Button
                    //   type="button"
                    //   variant="link"
                    //   className="font-bold"
                    //   size="sm"
                    //   onClick={handleResend}
                    //   disabled={isPending}
                    // >
                    //   Resend Email
                    // </Button>
                    <span className="font-bold text-xs px-3 h-8 inline-flex items-center justify-center whitespace-nowrap">
                      Click the button below
                    </span>
                  ) : (
                    <div className="font-normal text-xs px-3 h-8 inline-flex items-center justify-center whitespace-nowrap">
                      {isPending
                        ? "Timer paused"
                        : `Resend Code in ${timerValue}s`}
                    </div>
                  )}
                </div>
              </>
            ) : (
              ""
            )}
            <Button
              type="submit"
              className="w-full"
              disabled={isPending || disablePassButton}
            >
              {isPending ? <Spinner /> : "Send Reset Link"}
            </Button>
          </div>
        </form>
      </Form>
    </CardWrapper>
  );
};
