// if the user is logged out we don't want them access the settings page
// we will be using client components here
"use client";

import { useCurrentUser } from "@/hooks/use-current-user";
import { signOut, useSession } from "next-auth/react";
import { CardContent, CardHeader, Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { settings } from "@/actions/settings";
import { useTransition, useState } from "react";

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

  // get the current using using the front end hook
  const user = useCurrentUser();

  // defining our form
  const form = useForm<z.infer<typeof SettingsSchema>>({
    resolver: zodResolver(SettingsSchema),
    defaultValues: {
      name: user?.name || undefined,
    },
  });

  // older approach for form submission using server action -- commented out 
  // we are using the useCurrentUser hook to directly get the data of the `user` other than having to do a session.data?.user everytime
  // we have to stringy the data in order to display it
  // const user = useCurrentUser();
  // const signOutUser = async () => {
    // await signOut();
    // or import logout() from @/actions/logout.ts and call logout() to implement server actions for logout logic.
    // the above approach is better if there is additional logic required before logging out the user or else the current logic works perfectly.
  // };

  const { update } = useSession();

  // the values being passed here are of the type inferred from SettingsSchema
  // the z.infer utility type is used to extract the TypeScript type from a Zod schema
  // and then set values parameter to that type
  // this ensures type safety and validation
  const onSubmit = (values: z.infer<typeof SettingsSchema>) => {
    // TODO: check if the entered name is the same as the current name
    startTransition(() => {
      settings({
        name: values.name,
      })
        .then((data) => {
          // we won't always fire the update
          if (data.error) {
            setError(data.error);
          }
          if (data.success) {
            setSuccess(data.success);
            update(); // to update the session data after the settings have been updated
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
        <h2 className="text-2xl font-semibold text-center">⚙️Settings</h2>
      </CardHeader>
      <CardContent>
        {/* Button with sign out functionality as a example of implementing signOut or related server actions logic on a client component */}
        {/* <Button variant="outline" onClick={signOutUser}>
          Sign Out
        </Button> */}
        {/* Button will be diabled during the transition */}
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
            </div>
            <Button type="submit" disabled={isPending}>
              {isPending ? <Spinner /> : "Update Name"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default SettingsPage;
