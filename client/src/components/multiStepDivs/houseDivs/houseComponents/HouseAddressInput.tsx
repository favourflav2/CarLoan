import * as React from "react";
import { FieldErrors, UseFormRegister, UseFormSetValue, Control, Controller } from "react-hook-form";
import { SelectedAddress } from "./House1stInputs";
import { motion, AnimatePresence, easeInOut } from "framer-motion";
import { Skeleton } from "@mui/material";
import usePlacesService from "react-google-autocomplete/lib/usePlacesAutocompleteService";
import { Input } from "@mui/material";

export interface IHouseAddressInputProps {
  label: string;
  name: "streetAddress";
  placeholder: string;
  errors: FieldErrors<{
    streetAddress: string;
    price: string;
    downPayment: string;
    interest: string;
    id: string;
    term: number;
    extraPayment: string;
    propertyTax: string;
    insurance: string;
    mortgageInsurance: string;
    appreciation: string;
    opportunityCostRate: string;
    maintenance: string;
    rent:string;
    img?: any;
  }>;
  register: UseFormRegister<{
    streetAddress: string;
    price: string;
    downPayment: string;
    interest: string;
    id: string;
    term: number;
    extraPayment: string;
    propertyTax: string;
    insurance: string;
    mortgageInsurance: string;
    appreciation: string;
    opportunityCostRate: string;
    maintenance: string;
    rent:string;
    img?: any;
  }>;
  allInputData: {
    streetAddress: string;
    price: string;
    downPayment: string;
    interest: string;
    id: string;
    term: number;
    extraPayment: string;
    propertyTax: string;
    insurance: string;
    mortgageInsurance: string;
    appreciation: string;
    opportunityCostRate: string;
    maintenance: string;
    img?: any;
  };
  setValue: UseFormSetValue<{
    streetAddress: string;
    price: string;
    downPayment: string;
    interest: string;
    id: string;
    term: number;
    extraPayment: string;
    propertyTax: string;
    insurance: string;
    mortgageInsurance: string;
    appreciation: string;
    opportunityCostRate: string;
    maintenance: string;
    rent: string;
    img?: any;
  }>;
  control: Control<
    {
      streetAddress: string;
      price: string;
      downPayment: string;
      interest: string;
      term: number;
      id: string;
      extraPayment: string;
      propertyTax: string;
      insurance: string;
      mortgageInsurance: string;
      appreciation: string;
      opportunityCostRate: string;
      maintenance: string;
      rent:string;
      img?: any;
    },
    any
  >;
  selectedAddress: SelectedAddress | undefined;
  setSelectedAddress: React.Dispatch<React.SetStateAction<SelectedAddress | undefined>>;
  setGoogleError: React.Dispatch<React.SetStateAction<boolean>>;
  googleError: boolean;
}

export default function HouseAddressInput({ errors, name, label, register, placeholder, allInputData, control, setSelectedAddress, setValue, setGoogleError, googleError }: IHouseAddressInputProps) {
  const fakeArr = new Array(5).fill("nothing");

  // Google Autocomplete
  const { placesService, placePredictions, getPlacePredictions, isPlacePredictionsLoading } = usePlacesService({
    apiKey: `${process.env.REACT_APP_GOOGLE_API_KEY}`,
    options: {
      componentRestrictions: { country: "us" },
      types: ["address"],
      input: allInputData.streetAddress,
    },
  });

  function debounceFunction(value: string) {
    setTimeout(() => {
      getPlacePredictions({ input: value });
    }, 1500);
  }

  function handleClick(item: google.maps.places.AutocompletePrediction) {
    setValue("streetAddress", item.description);
    placesService?.getDetails(
      {
        placeId: item.place_id,
      },
      (placeDetails: any) => {
        setSelectedAddress(placeDetails);
      }
    );
    getPlacePredictions({ input: "" });
  }

  // If theres any error with the google api i will return null
  React.useEffect(() => {
    // fetch place details for the first element in placePredictions array
    if (placePredictions.length)
      placesService?.getDetails(
        {
          placeId: placePredictions[0].place_id,
        },
        (info, status) => {
          switch (status) {
            case "OK":
              break;
            case "ZERO_RESULTS":
              break;
            default:
              return setGoogleError(true);
          }
        }
      );
  }, [placePredictions]); // eslint-disable-line

  if (googleError) return null;

  return (
    <div className="w-full h-auto relative  flex flex-col ">
      {/* Input */}
      <div className="w-full  flex flex-col mb-3  ">
        <label htmlFor={name} className="text-[12px] dark:text-gray-300 text-black">
          {label}
        </label>

        <Controller
          render={({ field: { onChange, value } }) => (
            <Input
              className={`outline-none border border-black text-black  dark:border-none p-[6px] mt-1 bg-white placeholder:text-[15px] ${errors[name] && "border-2 border-red-500"}`}
              placeholder={placeholder}
              onChange={(e) => {
                onChange(e.target.value);
                debounceFunction(e.target.value);
              }}
              value={value}
            />
          )}
          name={name}
          control={control}
        />
        {errors?.[name] && <p className="text-red-500 text-[13px] ">{errors?.[name]?.message}</p>}
      </div>

      {/* Dropdown */}
      <AnimatePresence>
        {placePredictions && placePredictions.length && (
          <motion.div
            className="w-full h-[178px] bg-white absolute  border-2 border-gray-600 rounded-sm top-[62px] z-20 overflow-y-auto no-scrollbar"
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1, transition: { duration: 0.3, delay: 0.1, ease: easeInOut, type: "spring", stiffness: 100 } }}
            exit={{ opacity: [0.8, 0.5, 0], transition: { duration: 0.3, delay: 0.1, ease: easeInOut } }}
          >
            {/* Content */}
            <div className="w-full grid grid-cols-1 ">
              {isPlacePredictionsLoading
                ? fakeArr.map((item: string, index: number) => <Skeleton key={index} variant="rectangular" className="w-full !h-[35px] my-[2px] bg-gray-300" />)
                : placePredictions?.map((item) => (
                    <div
                      key={item.place_id}
                      className="w-full h-[35px] flex flex-col items-center justify-center border-b border-gray-400 cursor-pointer transition ease-in-out delay-150 hover:bg-gray-300 duration-300"
                      onClick={() => handleClick(item)}
                    >
                      <h1 className="text-[15px] text-black">{item.description}</h1>
                    </div>
                  ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
