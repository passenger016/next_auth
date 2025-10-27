"use client";

import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import React, { useState, useTransition } from "react";

// for form handling and validation
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod"; // for zod validation with react hook form -- it basically links zod with react hook form
import { PasswordResetSecuritySchema } from "@/schema";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormDescription,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { FormInfo } from "@/components/FormInfo";
import { useCurrentUser } from "@/hooks/use-current-user";
import clsx from "clsx";
import { Switch } from "@/components/ui/switch";
import { FormSuccess } from "@/components/FormSuccess";
import { FormError } from "@/components/FormError";
import { passwordResetSecurity } from "@/actions/password-reset-security";
import { Button } from "@/components/ui/button";

const SecurityPage = () => {
  // we are using useTransition to manage the pending state of the server action
  // isPending and startTransition are destructured from useTransition hook
  // they are the standard way of handling transitions in React
  const [isPending, startTransition] = useTransition();
  // for displaying success or error messages for the form submission
  const [error, setError] = useState<string | undefined>();
  const [success, setSuccess] = useState<string | undefined>();

  // get the current user using the front end hook
  const user = useCurrentUser();

  // defining our form for security page
  const PasswordResetForm = useForm<
    z.infer<typeof PasswordResetSecuritySchema>
  >({
    resolver: zodResolver(PasswordResetSecuritySchema),
    defaultValues: {
      // we are not gonna prefill values since this is a security page
      // if needed to prefill values then refer to /(protected)/settings page implementation
      password: "",
      confirmPassword: "", // RHF doesn't prefer 'undefined' for input fields
    },
  });

  // RHF gives a watch method to watch specific form fields
  // we will keep an eye on both the password and confirm password fields, it will track changes realtime
  // NOTE: using onChange() function with RHF caused unexpected behaviours hence we are using watch()
  // so that we can disable the submit button if any of them is empty
  const { watch } = PasswordResetForm;
  const passwordInputValue = watch("password");
  const confirmPasswordInputValue = watch("confirmPassword");

  // this variable will be true if either of the fields is empty  
  const disableButton = !passwordInputValue || !confirmPasswordInputValue;

  // the values being passed here are of the type inferred from SettingsSchema
  // the z.infer utility type is used to extract the TypeScript type from a Zod schema
  // and then set values parameter to that type
  // this ensures type safety and validation
  const onSubmitPasswordReset = (
    values: z.infer<typeof PasswordResetSecuritySchema>
  ) => {
    // on a fresh submit we will clear any previous error or success message
    setError("");
    setSuccess("");

    // then start the transition
    startTransition(() => {
      passwordResetSecurity({
        password: values.password,
        confirmPassword: values.confirmPassword,
      })
        .then((data) => {
          // we won't always fire the update
          if (data.error) {
            setError(data.error);
          }
          if (data.success) {
            setSuccess(data.success);
          }
        })
        // fallback for any unexpected error
        .catch(() => {
          setError("Something went wrong!");
        });
    });
  };

  return (
    <div>
      <Card className="w-[80%] md:w-[600px] shadow-md">
        <CardHeader>
          <h2 className="text-2xl font-semibold text-center">🔑Security</h2>
        </CardHeader>
        <CardContent>
          {/* Button with sign out functionality as a example of implementing signOut or related server actions logic on a client component */}
          {/* <Button variant="outline" onClick={signOutUser}>
              Sign Out
            </Button> */}
          {/* Button will be diabled during the transition */}
          {user?.isOAuthUser && (
            <FormInfo
              message={`Your account is linked to OAuth hence certain fields cannot be changed.`}
            />
          )}
          <Form {...PasswordResetForm}>
            <form
              onSubmit={PasswordResetForm.handleSubmit(onSubmitPasswordReset)}
              className="space-y-4"
            >
              <div className="space-y-4">
                <FormField
                  // the control of the form is passed here
                  // this basically connects the form field with react hook form
                  control={PasswordResetForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter new password"
                          {...field}
                          disabled={isPending}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  // the control of the form is passed here
                  // this basically connects the form field with react hook form
                  control={PasswordResetForm.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem
                      className={
                        user?.isOAuthUser ? "opacity-50 cursor-not-allowed" : ""
                      }
                    >
                      <FormLabel>Confirm Password</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Cofirm new password"
                          {...field}
                          disabled={isPending || user?.isOAuthUser}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              {/* display error or success message if any */}
              <FormError message={error} />
              <FormSuccess message={success} />
              <Button type="submit" disabled={isPending || disableButton}>
                {isPending ? <Spinner /> : "Save"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default SecurityPage;
