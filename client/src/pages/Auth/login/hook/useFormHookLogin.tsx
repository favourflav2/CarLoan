import * as React from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { loginSchema } from "./loginSchema";

export type FormFieldsLogin = z.infer<typeof loginSchema>;

export default function useFormHookLogin() {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    setError,
    clearErrors,
    control,
    formState: { errors },
  } = useForm<FormFieldsLogin>({
    mode: "all",
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: zodResolver(loginSchema),
  });

  React.useEffect(() => {
    reset({
      email: "",
      password: "",
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
  };
}
