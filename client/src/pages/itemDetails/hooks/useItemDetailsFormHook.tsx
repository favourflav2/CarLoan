import * as React from "react";
import { DataObj } from "../../../redux/features/carSlice";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { itemDetailsSchema } from "../itemDetailsSchema";
import { ItemDetailsState } from "../../../redux/features/carStateSlice";

export type FormFieldsItemDetails = z.infer<typeof itemDetailsSchema>;

export interface IuseItemDetailsFormHookProps {
  singleCar: DataObj | null;
  itemDetailsState: ItemDetailsState | null;
}

export default function useItemDetailsFormHook({ singleCar, itemDetailsState }: IuseItemDetailsFormHookProps) {
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
  } = useForm<FormFieldsItemDetails>({
    mode: "all",
    defaultValues: {
      price: singleCar ? singleCar.price.toString() : "0",
      downPayment: "0",
      interest: "11",
      term: 60,
      extraPayment: "0",
    },
    resolver: zodResolver(itemDetailsSchema),
  });

  React.useEffect(() => {
   
    reset({
      // using itemDetails to persist the inputs

      // price: singleCar ? singleCar.price.toString() : "0",
      // downPayment: itemDetailsState.downPayment.toString(),
      // interest: itemDetailsState.interest.toString(),
      // term: itemDetailsState.term,
      // extraPayment: itemDetailsState.extraPayment.toString(),

      //* Instead im going to refresh all the inputs on re render
      price: singleCar ? singleCar.price.toString() : "0",
      downPayment: "0",
      interest: "11",
      term: 60,
      extraPayment: "0",
    });
  }, [singleCar]); // eslint-disable-line

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
