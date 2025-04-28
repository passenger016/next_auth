"use client";

import { CardWrapper } from "./card-wrapper";
import { PulseLoader } from "react-spinners";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { newVerification } from "@/actions/new-verification";
import { FormSuccess } from "../FormSuccess";
import { FormError } from "../FormError";

const NewVerificationForm = () => {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [error, setError] = useState<string | undefined>();
  const [success, setSuccess] = useState<string | undefined>();

  const onSubmit = useCallback(() => {
    if (!token) {
      setError("Missing token!");
      // break the function
      return;
    }
    console.log(token);

    newVerification(token)
      .then((data) => {
        // the resolved promise in the newVerification either resolves in an success state or and error state but it is "resolved"
        setSuccess(data.success);
        setError(data.error);
      })
      .catch(() => {
        // if the promise is rejected due to runtime errors like newtwork/api/exception thrown in the newVerification then it is caught in here
        setError("Something went wrong!");
      });
  }, [token]);

  useEffect(() => {
    onSubmit();
  }, [onSubmit]);

  return (
    <CardWrapper
      headerLabel="Confirming you verification"
      backButtonLabel="Back to Login"
      backButtonHref="/auth/login"
    >
      <div className="flex w-full items-center justify-center">
        {/* show animation only if there is no success and no error that is the processing of the token is still going on */}
        {!success && !error && <PulseLoader size={10} />}
      </div>
      {/* Note: in dev environment there will be a token success immeditaly accompanied by a token does not exist this is because in dev environment react calls useEffect() twice but this problem won't persist in production environment */}
      <div className="w-full flex items-center justify-center">
        <FormSuccess message={success} />
        <FormError message={error} />
      </div>
    </CardWrapper>
  );
};

export default NewVerificationForm;
