import * as React from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { signUpSchema } from "../signUpSchema";

export type FormFieldsSignUp = z.infer<typeof signUpSchema>;

export default function useFormHookSignUp() {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    setError,
    clearErrors,
    control,
    formState: { errors, isSubmitSuccessful, isSubmitted },
  } = useForm<FormFieldsSignUp>({
    mode: "all",
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    resolver: zodResolver(signUpSchema),
  });

  React.useEffect(() => {
    reset({
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    });
  }, []); // eslint-disable-line
  return {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    setError,
    clearErrors,
    control,
    errors,
    isSubmitSuccessful,
    isSubmitted
  };
}
