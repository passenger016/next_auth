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
import { useState, useTransition } from "react";

import * as z from "zod";
import { NewPasswordSchema } from "@/schema";
import { Button } from "../ui/button";
import { FormError } from "../FormError";
import { FormSuccess } from "../FormSuccess";
import { newPassword } from "@/actions/new-password";
import { useSearchParams } from "next/navigation";

// we are not exporting default here because this is just a component not a page
export const NewPasswordForm = () => {
  // we are using useTransition to check when server action isPending and during that time we are disabling the button and input fields so that new data doesn't interfare before the server action has been completed
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");

  // in case of the password reset we need both the token to validate the request as well as the new password to change the password
  // unlike in email verification where we just required the token to perform the validation
  const params = useSearchParams();
  const token = params.get("token");

  const form = useForm<z.infer<typeof NewPasswordSchema>>({
    resolver: zodResolver(NewPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = (values: z.infer<typeof NewPasswordSchema>) => {
    console.log("FORM SUBMITTED");

    // clearing all error and submit messages whenever a new submit is occuring
    setError("");
    setSuccess("");

    startTransition(() => {
      newPassword(values, token).then((data) => {
        setError(data?.error);
        // TODO: Add when we add the 2FA
        setSuccess(data?.success);
      });
    });

    console.log(values);
  };

  return (
    <CardWrapper
      headerLabel="Enter a new password"
      backButtonLabel="Back to Login"
      backButtonHref="/auth/login"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="******"
                    type="password"
                    disabled={isPending}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm Password</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="******"
                    type="password"
                    disabled={isPending}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormError message={error} />
          <FormSuccess message={success} />
          <Button type="submit" className="w-full" disabled={isPending}>
            Set New Password
          </Button>
        </form>
      </Form>
    </CardWrapper>
  );
};
