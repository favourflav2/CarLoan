import * as React from 'react';
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { newPasswordSchema } from '../newPasswordSchema';

export type FormFieldsCreatePassword = z.infer<typeof newPasswordSchema>;

export default function useFormHookCreatePassword () {
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
      } = useForm<FormFieldsCreatePassword>({
        mode: "all",
        defaultValues: {
          password: "",
          confirmPassword: "",
        },
        resolver: zodResolver(newPasswordSchema),
      });
    
      React.useEffect(() => {
        reset({
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
      };
}