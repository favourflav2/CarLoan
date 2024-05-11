import * as React from "react";
import { Select, SelectChangeEvent } from "@mui/material";
import { house1stSchema } from "./house1stSchema";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { MenuItem } from "@mui/material";
import HouseControllerInput from "./HouseControllerInput";
import dayjs from "dayjs";
import HouseAddressInput from "./HouseAddressInput";
import { Dispatch } from "../../../../redux/store";
import { HouseObj, addHouseGoal } from "../../../../redux/features/modalSlices/houseSlice";
import { setAnyTypeOfModal } from "../../../../redux/features/applicationSlice";

export const houseTerms = ["10", "15", "20", "25", "30", "60"];

type FormFields = z.infer<typeof house1stSchema>;

export interface SelectedAddress {
  [key: string]: any;
  address_components: Array<{
    long_name: string;
    short_name: string;
    types: Array<string>;
  }>;
}

export interface IHouseFirstInputsProps {
  updatedImg: string;
}

export default function HouseFirstInputs({ updatedImg }: IHouseFirstInputsProps) {
  // Redux States
  const [selectedAddress, setSelectedAddress] = React.useState<SelectedAddress>();
  const dispatch = Dispatch();

  // Error for google api
  const [googleError, setGoogleError] = React.useState(false);

  // Date
  const date = new Date();
  const dateFormat = dayjs(date).format("MMM D, YYYY h:mm:ss a");

  // Form Feilds
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    setError,
    clearErrors,
    control,
    formState: { errors },
  } = useForm<FormFields>({
    mode: "all",
    // the average annual cost of homeowners insurance in the U.S. is $2,511.25
    defaultValues: {
      term: 30,
      extraPayment: "0",
      mortgageInsurance: "0",
      propertyTax: "1.11",
      insurance: "209.27",
      appreciation: "2",
      maintenance: "1",
      opportunityCostRate: "7",
      rent:"1515"
    },
    resolver: zodResolver(house1stSchema),
  });

  const allInputData = watch();
  const twentyPercentValue = Number(parseFloat(allInputData.price) * 0.2);
  const downPayment = watch("downPayment");

  const onSubmit: SubmitHandler<FormFields> = (data) => {
    const { id, price, downPayment, interest, term, extraPayment, streetAddress, propertyTax, insurance, mortgageInsurance, appreciation, opportunityCostRate, maintenance, img, rent } = data;

    const newObj:HouseObj = {
      id,
      price,
      downPayment,
      interest,
      term,
      extraPayment,
      streetAddress,
      propertyTax,
      insurance,
      mortgageInsurance,
      rent,
      appreciation,
      opportunityCostRate,
      maintenance,
      img:img ? img : "",
      showInputs:true,
      showOppCostInputs:true
    }
    dispatch(addHouseGoal(newObj));
    dispatch(setAnyTypeOfModal({ value: false, type: "House" }));
  };

  function SubmitValidation(e: any) {
    e.preventDefault();
    if (!downPayment || !twentyPercentValue || !allInputData.mortgageInsurance) return;

    // If the down payment is less than 20%
    if (parseFloat(downPayment) < twentyPercentValue) {
      // if the mortgage insurance is less than or equal to 0 ... and a user clicks we show and error ... else we continue
      if (parseFloat(allInputData.mortgageInsurance) <= 0) {
        setError("mortgageInsurance", { type: "custom", message: "Please enter a value greater than 0%" });
      } else {
        handleSubmit(onSubmit)();
      }
    } else {
      // if the down payment is not less than 20% ... then we dont have mortgage insurance
      clearErrors("mortgageInsurance");
      setValue("mortgageInsurance", "0");
      handleSubmit(onSubmit)();
    }
  }

  // Handle Change
  const handleChange = (event: SelectChangeEvent) => {
    setValue("term", Number(event.target.value) as number);
  };

  React.useEffect(() => {
    setValue("id", dateFormat);
  }, [setValue, dateFormat]);

  React.useEffect(() => {
    if (updatedImg) {
      setValue("img", updatedImg);
    } else {
      setValue("img", "");
    }
  }, [updatedImg, setValue]);

  // This will not allow google api
  const user = true;

  return (
    <div className="mb-2">
      <form className="w-full h-auto flex flex-col mt-5" onSubmit={(e) => SubmitValidation(e)}>
        {/* Input Container */}
        <div className="w-full h-auto flex flex-col">
          {/* 1st Row with address and price */}
          <div className="w-full h-auto grid grid-cols-1 gap-x-4">
            {/* Street Address */}
            {googleError || user ? (
              <div className="w-full  flex flex-col mb-3  ">
                <label htmlFor="streetAddress" className="text-[12px] dark:text-gray-300 text-black">
                  Address
                </label>
                <input
                  type="text"
                  placeholder="Enter an address"
                  {...register("streetAddress")}
                  autoComplete="off"
                  className={`outline-none dark:text-lightText border border-black  dark:border-none p-[6px] mt-1 bg-white placeholder:text-[15px] ${
                    errors?.streetAddress && "border-2 border-red-500"
                  }`}
                />
                {errors?.streetAddress && <p className="text-red-500 text-[13px] ">{errors?.streetAddress?.message}</p>}
              </div>
            ) : (
              <HouseAddressInput
                errors={errors}
                label="Address"
                name="streetAddress"
                placeholder="Enter an address"
                allInputData={allInputData}
                selectedAddress={selectedAddress}
                register={register}
                setSelectedAddress={setSelectedAddress}
                setValue={setValue}
                setGoogleError={setGoogleError}
                googleError={googleError}
                control={control}
              />
            )}

            {/* Price */}
            <HouseControllerInput type="Number" control={control} errors={errors} name="price" label="House Price" placeholder="Enter a price..." />
          </div>

          {/* Down Payment */}
          <HouseControllerInput type="Number" control={control} errors={errors} name="downPayment" label="Down Payment" placeholder="Enter a down payment..." />

          {/* Other Inputs */}
          <div className="w-full h-auto grid grid-cols-2 gap-x-4">
            {/* Interest */}
            <HouseControllerInput type="Percent" control={control} errors={errors} name="interest" label="Interest Rate" placeholder="Enter an interest rate..." />

            {/* Loan Term */}
            <div className="w-auto flex flex-col mb-2">
              <label htmlFor="term" className="text-[12px]">
                Loan Term (Years)
              </label>
              <Select
                label="Loan Term"
                MenuProps={{ PaperProps: { sx: { maxHeight: 150 } } }}
                sx={{
                  boxShadow: "none",
                  ".MuiOutlinedInput-notchedOutline": { border: 0 },
                  "&.MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline": {
                    border: 0,
                  },
                  "&.MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    border: 0,
                  },
                }}
                className={`outline-none border border-black h-[38px]  dark:border-none  mt-1 bg-white placeholder:text-[15px] ${errors.term && "border-2 border-red-500"}`}
                onChange={handleChange}
                value={allInputData.term.toString()}
              >
                {houseTerms.map((item: string) => (
                  <MenuItem key={item} value={item}>
                    {item}
                  </MenuItem>
                ))}
              </Select>
            </div>
          </div>

          {/* Mortgage Insurance */}
          {twentyPercentValue > parseFloat(downPayment) && (
            <HouseControllerInput type="Percent" control={control} errors={errors} name="mortgageInsurance" label="Mortgage Insurance" placeholder="Enter an mortgage nsurancet rate..." />
          )}
        </div>

        <button className="w-full p-2 rounded-lg mt-2  bg-chartYellow dark:text-lightText">Save & Continue</button>
      </form>
    </div>
  );
}
