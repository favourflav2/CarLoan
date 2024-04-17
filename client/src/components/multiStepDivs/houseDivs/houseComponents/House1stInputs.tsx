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
import { addHouseGoal } from "../../../../redux/features/modalSlices/houseSlice";
import { setAnyTypeOfModal } from "../../../../redux/features/applicationSlice";

const arr = ["10", "15", "20", "25", "30", "60"];

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
  const dispatch = Dispatch()

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
    control,
    formState: { errors },
  } = useForm<FormFields>({
    mode: "all",
    defaultValues: {
      term: 30,
      extraPayment: "0",
      mortgageInsurance: "0",
      propertyTax: "0",
      insurance: "0",
      appreciation: "0",
      maintenance: "0",
      opportunityCostRate: "0",
    },
    resolver: zodResolver(house1stSchema),
  });

  const allInputData = watch();
  const twentyPercentValue = Number(parseInt(allInputData.price) * .20)
  const downPayment = watch("downPayment")

  const onSubmit: SubmitHandler<FormFields> = (data) => {
    let dataTwentyPercentValue = Number(parseInt(data.price) * .20)

    // If the down payment is greater than 20% we need to set the mortagage insurance to 0
    //* if the down payment is not greater than 20% we do nothing 
    if(parseInt(data.downPayment) > dataTwentyPercentValue){
      setValue("mortgageInsurance","0")
      data.mortgageInsurance = "0"
      dispatch(addHouseGoal(data))
      dispatch(setAnyTypeOfModal({ value: false, type: "House" }));
      
    }else{
      dispatch(addHouseGoal(data))
      dispatch(setAnyTypeOfModal({ value: false, type: "House" }));
    }
    
  };

  // Handle Change
  const handleChange = (event: SelectChangeEvent) => {
    setValue("term", Number(event.target.value) as number);
  };

  React.useEffect(() => {
    setValue("id", dateFormat);
  }, [setValue, dateFormat]);

  React.useEffect(()=>{
    
  },[downPayment,twentyPercentValue])

  React.useEffect(() => {
    if (updatedImg) {
      setValue("img", updatedImg);
    } else {
      setValue("img", undefined);
    }
  }, [updatedImg, setValue]);

  // This will not allow google api
  const user = true;

  

  return (
    <div className="my-10">
      <form className="w-full h-auto flex flex-col mt-5" onSubmit={handleSubmit(onSubmit)}>
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
                {arr.map((item: string) => (
                  <MenuItem key={item} value={item}>
                    {item}
                  </MenuItem>
                ))}
              </Select>
            </div>
          </div>

          {/* Mortgage Insurance */}
          {twentyPercentValue > parseInt(downPayment)  && (
            <HouseControllerInput type="Percent" control={control} errors={errors} name="mortgageInsurance" label="Mortgage Insurance" placeholder="Enter an mortgage nsurancet rate..." />
          )}
        </div>

        <button className="w-full p-2 rounded-lg mt-2 mb-3 bg-chartYellow dark:text-lightText">Save & Continue</button>
      </form>
    </div>
  );
}