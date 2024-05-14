import * as React from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Control, FieldErrors } from "react-hook-form";
import { carvanaSchema } from "../CarvanaPageInputs/CarvanaInputSchema";
import { FilterDataObj } from "../../../redux/features/carStateSlice";

export type FormFields = z.infer<typeof carvanaSchema>;

interface FormHook {
  states: FilterDataObj;
}
export default function useFormHook({ states }: FormHook) {
  const { lowPrice, highPrice, lowMileage, highMileage, sortByState, makeAndModalStates } = states;

  const {
    Acura,
    AlfaRomeo,
    Audi,
    BMW,
    Buick,
    Cadillac,
    Chevrolet,
    Chrysler,
    Dodge,
    FIAT,
    Ford,
    Genesis,
    GMC,
    Honda,
    Hyundai,
    INFINITI,
    Jaguar,
    Jeep,
    Kia,
    LandRover,
    Lexus,
    Lincoln,
    Lucid,
    Maserati,
    Mazada,
    MercedesBenz,
    MINI,
    Mitsubishi,
    Nissan,
    Polestar,
    Porsche,
    Ram,
    Rivian,
    Scion,
    Subaru,
    Telsa,
    Toyota,
    Volkswagen,
    Volvo,
  } = makeAndModalStates;
  // Form Feilds
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
  } = useForm<FormFields>({
    mode: "all",
    defaultValues: {
      lowMileage: "0",
      lowPrice: "0",
      highMileage: "300000",
      highPrice: "1750000",
      sortByState: "All",
      Acura: false,
      AlfaRomeo: false,
      Audi: false,
      BMW: false,
      Buick: false,
      Cadillac: false,
      Chevrolet: false,
      Chrysler: false,
      Dodge: false,
      FIAT: false,
      Ford: false,
      Genesis: false,
      GMC: false,
      Honda: false,
      Hyundai: false,
      INFINITI: false,
      Jaguar: false,
      Jeep: false,
      Kia: false,
      LandRover: false,
      Lexus: false,
      Lincoln: false,
      Lucid: false,
      Maserati: false,
      Mazada: false,
      MercedesBenz: false,
      MINI: false,
      Mitsubishi: false,
      Nissan: false,
      Polestar: false,
      Porsche: false,
      Ram: false,
      Rivian: false,
      Scion: false,
      Subaru: false,
      Telsa: false,
      Toyota: false,
      Volkswagen: false,
      Volvo: false,
    },
    resolver: zodResolver(carvanaSchema),
  });

  React.useEffect(() => {
    reset({
      lowMileage: lowMileage.toString(),
      lowPrice: lowPrice.toString(),
      highMileage: highMileage.toString(),
      highPrice: highPrice.toString(),
      sortByState: sortByState,
      Acura,
      AlfaRomeo,
      Audi,
      BMW,
      Buick,
      Cadillac,
      Chevrolet,
      Chrysler,
      Dodge,
      FIAT,
      Ford,
      Genesis,
      GMC,
      Honda,
      Hyundai,
      INFINITI,
      Jaguar,
      Jeep,
      Kia,
      LandRover,
      Lexus,
      Lincoln,
      Lucid,
      Maserati,
      Mazada,
      MercedesBenz,
      MINI,
      Mitsubishi,
      Nissan,
      Polestar,
      Porsche,
      Ram,
      Rivian,
      Scion,
      Subaru,
      Telsa,
      Toyota,
      Volkswagen,
      Volvo,
    });
  }, [states]); // eslint-disable-line

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

export interface ICarvanaInputCardProps {
  breakPoint: "Desktop" | "Mobile";
  label: string;
  name: "lowMileage" | "lowPrice" | "highMileage" | "highPrice" | "sortByState";
  placeholder: string;
  type: "Number" | "Percent" | "None";
  errors: FieldErrors<{
    sortByState: "All" | "Highest Price" | "Lowest Price" | "Lowest Mileage";
    lowPrice: string;
    highPrice: string;
    lowMileage: string;
    highMileage: string;
    Acura: boolean;
    AlfaRomeo: boolean;
    Audi: boolean;
    BMW: boolean;
    Buick: boolean;
    Cadillac: boolean;
    Chevrolet: boolean;
    Chrysler: boolean;
    Dodge: boolean;
    FIAT: boolean;
    Ford: boolean;
    Genesis: boolean;
    GMC: boolean;
    Honda: boolean;
    Hyundai: boolean;
    INFINITI: boolean;
    Jaguar: boolean;
    Jeep: boolean;
    Kia: boolean;
    LandRover: boolean;
    Lexus: boolean;
    Lincoln: boolean;
    Lucid: boolean;
    Maserati: boolean;
    Mazada: boolean;
    MercedesBenz: boolean;
    MINI: boolean;
    Mitsubishi: boolean;
    Nissan: boolean;
    Polestar: boolean;
    Porsche: boolean;
    Ram: boolean;
    Rivian: boolean;
    Scion: boolean;
    Subaru: boolean;
    Telsa: boolean;
    Toyota: boolean;
    Volkswagen: boolean;
    Volvo: boolean;
  }>;
  control: Control<
    {
      sortByState: "All" | "Highest Price" | "Lowest Price" | "Lowest Mileage";
      lowPrice: string;
      highPrice: string;
      lowMileage: string;
      highMileage: string;
      Acura: boolean;
      AlfaRomeo: boolean;
      Audi: boolean;
      BMW: boolean;
      Buick: boolean;
      Cadillac: boolean;
      Chevrolet: boolean;
      Chrysler: boolean;
      Dodge: boolean;
      FIAT: boolean;
      Ford: boolean;
      Genesis: boolean;
      GMC: boolean;
      Honda: boolean;
      Hyundai: boolean;
      INFINITI: boolean;
      Jaguar: boolean;
      Jeep: boolean;
      Kia: boolean;
      LandRover: boolean;
      Lexus: boolean;
      Lincoln: boolean;
      Lucid: boolean;
      Maserati: boolean;
      Mazada: boolean;
      MercedesBenz: boolean;
      MINI: boolean;
      Mitsubishi: boolean;
      Nissan: boolean;
      Polestar: boolean;
      Porsche: boolean;
      Ram: boolean;
      Rivian: boolean;
      Scion: boolean;
      Subaru: boolean;
      Telsa: boolean;
      Toyota: boolean;
      Volkswagen: boolean;
      Volvo: boolean;
    },
    any,
    {
      sortByState: "All" | "Highest Price" | "Lowest Price" | "Lowest Mileage";
      lowPrice: string;
      highPrice: string;
      lowMileage: string;
      highMileage: string;
      Acura: boolean;
      AlfaRomeo: boolean;
      Audi: boolean;
      BMW: boolean;
      Buick: boolean;
      Cadillac: boolean;
      Chevrolet: boolean;
      Chrysler: boolean;
      Dodge: boolean;
      FIAT: boolean;
      Ford: boolean;
      Genesis: boolean;
      GMC: boolean;
      Honda: boolean;
      Hyundai: boolean;
      INFINITI: boolean;
      Jaguar: boolean;
      Jeep: boolean;
      Kia: boolean;
      LandRover: boolean;
      Lexus: boolean;
      Lincoln: boolean;
      Lucid: boolean;
      Maserati: boolean;
      Mazada: boolean;
      MercedesBenz: boolean;
      MINI: boolean;
      Mitsubishi: boolean;
      Nissan: boolean;
      Polestar: boolean;
      Porsche: boolean;
      Ram: boolean;
      Rivian: boolean;
      Scion: boolean;
      Subaru: boolean;
      Telsa: boolean;
      Toyota: boolean;
      Volkswagen: boolean;
      Volvo: boolean;
    }
  >;
}
