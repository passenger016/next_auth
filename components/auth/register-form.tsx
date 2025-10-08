"use client";

import { LuEye } from "react-icons/lu";
import { LuEyeClosed } from "react-icons/lu";
import { Spinner } from "../ui/spinner";
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
import { RegisterSchema } from "@/schema";
import { Button } from "../ui/button";
import { FormError } from "../FormError";
import { FormSuccess } from "../FormSuccess";
import { register } from "@/actions/register";

// we are not exporting default here because this is just a component not a page
export const RegisterForm = () => {
  // we are using useTransition to check when server action isPending and during that time we are disabling the button and input fields so that new data doesn't interfare before the server action has been completed
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const form = useForm<z.infer<typeof RegisterSchema>>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      email: "",
      password: "",
      name: "",
    },
  });

  const onSubmit = (values: z.infer<typeof RegisterSchema>) => {
    console.log("FORM SUBMITTED");

    // clearing all error and submit messages whenever a new submit is occuring
    setError("");
    setSuccess("");

    startTransition(() => {
      register(values).then((data) => {
        setError(data.error);
        setSuccess(data.success);
      });
    });
  };

  return (
    <CardWrapper
      headerLabel="Create An Account"
      backButtonLabel="Already have a account?"
      backButtonHref="/auth/login"
      showSocial
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="John Doe"
                    disabled={isPending}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
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
                      onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                    >
                      {/* or you can use 'prev' state like  onClick={()=>setIsPasswordVisible((prev) => !prev)} */}
                      {isPasswordVisible ? <LuEye /> : <LuEyeClosed />}
                    </button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormError message={error} />
          <FormSuccess message={success} />
          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? <Spinner /> : "Register account"}
          </Button>
        </form>
      </Form>
    </CardWrapper>
  );
};
