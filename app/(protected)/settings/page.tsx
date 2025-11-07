// if the user is logged out we don't want them access the settings page
// we will be using client components here
"use client";

import { signOut, useSession } from "next-auth/react";
import { CardContent, CardHeader, Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { settings } from "@/actions/settings";
import { useTransition, useState, useEffect } from "react";

// for form handling and validation
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod"; // for zod validation with react hook form -- it basically links zod with react hook form
import { SettingsSchema } from "@/schema";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormDescription,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
// for displaying error and success messages
import { FormError } from "@/components/FormError";
import { FormSuccess } from "@/components/FormSuccess";
import { Switch } from "@/components/ui/switch";
import clsx from "clsx";
import { FormInfo } from "@/components/FormInfo";
import { useUser } from "@/app/context/userContext";

/* 
  NOTE: async await functions can be used in a client component but they cannot be used directly in the component body
  they can be used in event handlers or useEffect hooks 
*/
const SettingsPage = () => {
  // we are using useTransition to manage the pending state of the server action
  // isPending and startTransition are destructured from useTransition hook
  // they are the standard way of handling transitions in React
  const [isPending, startTransition] = useTransition();
  // for displaying success or error messages for the form submission
  const [error, setError] = useState<string | undefined>();
  const [success, setSuccess] = useState<string | undefined>();

  // get the current user using the front end hook
  // const user = useCurrentUser(); // older method for fetching session data
  
  const user = useUser(); // new method for fetching user data from context that is being passed from the '@/app/layout.tsx' file

  // defining our form
  const form = useForm<z.infer<typeof SettingsSchema>>({
    resolver: zodResolver(SettingsSchema),
    defaultValues: {
      // the default values will automatically populate the form fields with the current user data
      name: user?.name || undefined,
      email: user?.email || undefined,
      // ??(nullish coalescing operator) returns the right-hand value only if the left-hand value is null or undefined
      // while ||(logical OR) returns the right-hand value if the left-hand value is any falsy value (false, 0, "", null, undefined, NaN)
      isTwoFactorEnabled: user?.isTwoFactorEnabled ?? false,
    },
  });

  // RHF gives a watch method to watch specific form fields
  // we will keep an eye on both the password and confirm password fields, it will track changes realtime
  // NOTE: using onChange() function with RHF caused unexpected behaviours hence we are using watch()
  // so that we can disable the submit button if any of them is empty
  const { watch, reset } = form;
  const nameInputValue = watch("name");
  const emailInputValue = watch("email");
  const isTwoFactorEnabledValue = watch("isTwoFactorEnabled");

  // Reset form values whenever user changes
  // React Hook Form's defaultValues are only set during the initial render and do not update automatically when the user data changes asynchronously.
  // hence we use useEffect to reset the form values whenever the user data changes.
  useEffect(() => {
    form.reset({
      name: user?.name || undefined,
      email: user?.email || undefined,
      // ??(nullish coalescing operator) returns the right-hand value only if the left-hand value is null or undefined
      // while ||(logical OR) returns the right-hand value if the left-hand value is any falsy value (false, 0, "", null, undefined, NaN)
      isTwoFactorEnabled: user?.isTwoFactorEnabled ?? false,
    });
  }, [user, form]);

  // we will disable the button if there are no changes made to the form
  // NOTE: contrary to password reset form, here we will disable the button if no changes are made
  // since the default values are already populated with the current user data unlike the password reset form which had empty default values
  const disableButton =
    nameInputValue === user?.name &&
    emailInputValue === user?.email &&
    isTwoFactorEnabledValue === user?.isTwoFactorEnabled;

  console.log(
    `user values: ${user?.name}, ${user?.email}, ${user?.isTwoFactorEnabled}`
  );
  console.log(
    `form values: ${nameInputValue}, ${emailInputValue}, ${isTwoFactorEnabledValue}`
  );

  // older approach for form submission using server action -- commented out
  // we are using the useCurrentUser hook to directly get the data of the `user` other than having to do a session.data?.user everytime
  // we have to stringy the data in order to display it
  // const user = useCurrentUser();
  // const signOutUser = async () => {
  // await signOut();
  // or import logout() from @/actions/logout.ts and call logout() to implement server actions for logout logic.
  // the above approach is better if there is additional logic required before logging out the user or else the current logic works perfectly.
  // };

  // the values being passed here are of the type inferred from SettingsSchema
  // the z.infer utility type is used to extract the TypeScript type from a Zod schema
  // and then set values parameter to that type
  // this ensures type safety and validation
  const onSubmit = (values: z.infer<typeof SettingsSchema>) => {
    // on a fresh submit we will clear any previous error or success message
    setError("");
    setSuccess("");

    // then start the transition
    startTransition(() => {
      settings({
        name: values.name,
        isTwoFactorEnabled: values.isTwoFactorEnabled,
        email: values.email,
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
        <h2 className="text-2xl font-semibold text-center">Settings⚙️</h2>
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
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-4">
              <FormField
                // the control of the form is passed here
                // this basically connects the form field with react hook form
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter a new name"
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
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem
                    className={
                      user?.isOAuthUser ? "opacity-50 cursor-not-allowed" : ""
                    }
                  >
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter a new email"
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
                control={form.control}
                name="isTwoFactorEnabled"
                render={({ field }) => (
                  <FormItem
                    className={clsx(
                      "flex flex-row item-center justify-between rounded-lg border p-3 shadow-sm",
                      isPending || user?.isOAuthUser
                        ? "cursor-not-allowed opacity-50"
                        : ""
                    )}
                  >
                    <div className="space-y-0.5">
                      <FormLabel>Two-Factor Authentication</FormLabel>
                      <FormDescription>
                        Enable or disable two-factor authentication for your
                        account.
                      </FormDescription>
                    </div>
                    <FormControl>
                      {/*
                          By doing onCheckedChange={field.onChange} you tell the Switch to call RHF's(React Hook Form's) field.onChange(checked) whenever the user toggles the switch. RHF then updates its internal value for that field.
                      */}
                      <Switch
                        disabled={isPending || user?.isOAuthUser}
                        checked={field.value}
                        onCheckedChange={field.onChange}
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
              <Button type="submit" disabled={isPending || disableButton}>
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
      </CardContent>
    </Card>
  );
};

export default SettingsPage;
