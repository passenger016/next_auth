"use client";

import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import React, { useState, useTransition } from "react";

// for form handling and validation
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod"; // for zod validation with react hook form -- it basically links zod with react hook form
import { PasswordResetSecuritySchema, ValidatePasswordSchema } from "@/schema";
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
import { passwordValidationSecurity } from "@/actions/password-validation-security";

const SecurityPage = () => {
  // we are using useTransition to manage the pending state of the server action
  // isPending and startTransition are destructured from useTransition hook
  // they are the standard way of handling transitions in React
  const [isPending, startTransition] = useTransition(); // for the password reset form
  const [isPendingValidation, startTransitionValidation] = useTransition(); // for the password validation form
  // for displaying success or error messages for the form submission
  const [error, setError] = useState<string | undefined>();
  const [success, setSuccess] = useState<string | undefined>();
  const [passwordValidated, setPasswordValidated] = useState(false);

  // get the current user using the front end hook
  const user = useCurrentUser();

  // defining the form for password validation prior to showing password reset fields
  const ValidateUserPasswordForm = useForm<
    z.infer<typeof ValidatePasswordSchema>
  >({
    resolver: zodResolver(ValidatePasswordSchema),
    defaultValues: {
      password: "",
    },
  });

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
  const { watch, reset } = PasswordResetForm;
  const passwordInputValue = watch("password");
  const confirmPasswordInputValue = watch("confirmPassword");
  // for disabling the password validation button
  const { watch: watchPasswordValidation } = ValidateUserPasswordForm;
  const passwordValidationInputValue = watchPasswordValidation("password"); // watching the password validation form's password field

  // different variable for disabling the password validation form
  const disablePasswordValidationButton = !passwordValidationInputValue;
  // this variable will be true if either of the fields is empty
  const disableButton = !passwordInputValue || !confirmPasswordInputValue;

  const onSubmitValidateUserPassword = (
    values: z.infer<typeof ValidatePasswordSchema>
  ) => {
    // on a fresh submit we will clear any previous error or success message
    setError("");
    setSuccess("");
    // then start the transition
    startTransitionValidation(() => {
      passwordValidationSecurity({
        password: values.password,
      })
        .then((data) => {
          // we won't always fire the update
          if (data.error) {
            setError(data.error);
          }
          if (data.success) {
            setSuccess(data.success);
            if (data.passWordValidated) {
              setPasswordValidated(true);
            }
          }
        })
        // fallback for any unexpected error
        .catch(() => {
          setError("Something went wrong!");
        });
    });
  };

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
    <Card className="w-[80%] md:w-[600px] shadow-md">
      <CardHeader>
        <h2 className="text-2xl font-semibold text-center">Security🔏</h2>
      </CardHeader>
      <CardContent>
        {/* Button with sign out functionality as a example of implementing signOut or related server actions logic on a client component */}
        {/* <Button variant="outline" onClick={signOutUser}>
              Sign Out
            </Button> */}
        {/* Button will be diabled during the transition */}
        {user?.isOAuthUser && (
          // this form info is for OAUTH users
          <FormInfo
            message={`Your account is linked to OAuth hence certain fields cannot be changed.`}
          />
        )}
        {!passwordValidated && (
          // this form info is for non OAUTH users who have to validate their password first
          <FormInfo message="In order to change password, please confirm it's you by entering your old password" />
        )}
        {!passwordValidated && (
          <Form {...ValidateUserPasswordForm}>
            <form
              onSubmit={ValidateUserPasswordForm.handleSubmit(
                onSubmitValidateUserPassword
              )}
              className="space-y-4"
            >
              <div className="space-y-4">
                <FormField
                  // the control of the form is passed here
                  // this basically connects the form field with react hook form
                  control={ValidateUserPasswordForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem
                      className={
                        user?.isOAuthUser ? "opacity-50 cursor-not-allowed" : ""
                      }
                    >
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter password"
                          {...field}
                          disabled={isPendingValidation || user?.isOAuthUser}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormError message={error} />
                <FormSuccess message={success} />
                <Button
                  type={passwordValidated ? "button" : "submit"}
                  disabled={
                    isPendingValidation ||
                    disablePasswordValidationButton ||
                    passwordValidated
                  }
                >
                  {isPendingValidation ? <Spinner /> : "Confirm"}
                </Button>
              </div>
            </form>
          </Form>
        )}
        {passwordValidated && (
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
                    <FormItem
                      className={
                        user?.isOAuthUser ? "opacity-50 cursor-not-allowed" : ""
                      }
                    >
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter new password"
                          {...field}
                          disabled={isPending || user?.isOAuthUser}
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
              <div className="flex gap-x-2">
                <Button
                  type={passwordValidated ? "submit" : "button"}
                  // if passwordValidated is false then we will disable the button regardless of isPending or disableButton state
                  // it will be NOT of value since if passwordValidated is true then NOT of true will be false so button will be enabled and vice versa
                  // since button is disabled for true value, i.e. disabled={true} means button is disabled
                  disabled={(isPending || disableButton) && !passwordValidated}
                >
                  {isPending ? <Spinner /> : "Update"}
                </Button>
                <Button
                  variant="secondary"
                  type="reset"
                  disabled={isPending || disableButton}
                  onClick={() => reset()}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </Form>
        )}
      </CardContent>
    </Card>
  );
};

export default SecurityPage;
