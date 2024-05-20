import * as React from "react";

import { FieldErrors, Control, UseFormSetValue, SubmitHandler, UseFormHandleSubmit } from "react-hook-form";
import { DataObj } from "../../redux/features/carSlice";
import ItemDetailsInputCard from "./components/ItemDetailsInputCard";
import { motion, AnimatePresence, easeInOut } from "framer-motion";
import { UseSelector } from "../../redux/store";
import { useMediaQuery } from "@mui/material";
import { itemDetailsIsSameCheck } from "../ScrapeCarvanaPage/utils/ItemDetailsIsSameCheck";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";

export interface IItemDetailsInputsProps {
  singleCar: DataObj;
  errors: FieldErrors<{
    price: string;
    downPayment: string;
    interest: string;
    term: number;
    extraPayment: string;
  }>;
  control: Control<
    {
      price: string;
      downPayment: string;
      interest: string;
      term: number;
      extraPayment: string;
    },
    any,
    {
      price: string;
      downPayment: string;
      interest: string;
      term: number;
      extraPayment: string;
    }
  >;
  setValue: UseFormSetValue<{
    price: string;
    downPayment: string;
    interest: string;
    term: number;
    extraPayment: string;
  }>;
  allInputData: {
    price: string;
    downPayment: string;
    interest: string;
    term: number;
    extraPayment: string;
  };
  handleSubmit: UseFormHandleSubmit<
    {
      price: string;
      downPayment: string;
      interest: string;
      term: number;
      extraPayment: string;
    },
    {
      price: string;
      downPayment: string;
      interest: string;
      term: number;
      extraPayment: string;
    }
  >;
  onSubmit: SubmitHandler<{
    price: string;
    downPayment: string;
    interest: string;
    term: number;
    extraPayment: string;
  }>;
}

export default function ItemDetailsInputs({ singleCar, errors, allInputData, control, setValue, handleSubmit, onSubmit }: IItemDetailsInputsProps) {
  const { itemDetailsState } = UseSelector((state) => state.page);

  const [close, setClose] = React.useState(false);

  const errorsArray = Object.keys(errors);

  // Show Inputs on mobile states
  const matches = useMediaQuery("(min-width:1024px)");

  React.useEffect(()=>{
    if(close === true){
      if(matches){
        setClose(false)
      }
    }
  },[matches,singleCar,close])

  return (
    <div className="w-full h-full lg:max-h-[600px] lg:py-4 pt-4 pb-8 px-4 min-[900px]:px-3 flex flex-col bg-[#EADDCA] dark:bg-[#1814149c]">
      {/* Content */}
      <div className="w-full h-full flex flex-col">
        {/* Expand and Shrink Input Section Btn */}
        <div className="flex items-end justify-end w-full h-auto lg:hidden">
          {close ? (
            <KeyboardArrowUpIcon className="text-[28px] cursor-pointer" onClick={() => setClose(false)} />
          ) : (
            <KeyboardArrowDownIcon className="text-[28px] cursor-pointer" onClick={() => setClose(true)} />
          )}
        </div>
        {!close ? (
          <form className="w-full h-auto flex flex-col" onSubmit={handleSubmit(onSubmit)}>
            {/* Car Price */}
            <ItemDetailsInputCard errors={errors} control={control} name="price" label="Car Price" placeholder="" type="Number" setValue={setValue} allInputData={allInputData} />

            {/* Down Payment */}
            <ItemDetailsInputCard errors={errors} control={control} name="downPayment" label="Down Payment" placeholder="" type="Number" setValue={setValue} allInputData={allInputData} />

            {/* Extra Monthly Payment */}
            <ItemDetailsInputCard errors={errors} control={control} name="extraPayment" label="Extra Monthly Payment" placeholder="" type="Number" setValue={setValue} allInputData={allInputData} />

            {/* Term (Months) */}
            <ItemDetailsInputCard errors={errors} control={control} name="term" label="Term (Months)" placeholder="" type="Number" setValue={setValue} allInputData={allInputData} />

            {/* Interest Rate */}
            <ItemDetailsInputCard errors={errors} control={control} name="interest" label="Interest Rate" placeholder="" type="Percent" setValue={setValue} allInputData={allInputData} />

            <AnimatePresence>
              {itemDetailsState !== undefined && itemDetailsState && itemDetailsIsSameCheck(allInputData, itemDetailsState) && (
                <motion.button
                  className={` rounded-lg p-1 ${errorsArray.length ? "bg-gray-300 text-gray-400" : "bg-chartGreen text-white"}`}
                  initial={{ x: -100, opacity: 0 }}
                  animate={{ x: 0, opacity: 1, transition: { duration: 0.2, ease: easeInOut } }}
                  exit={{ opacity: [0.8, 0.5, 0], transition: { duration: 0.2, ease: easeInOut } }}
                  disabled={errorsArray.length ? true : false}
                >
                  Update
                </motion.button>
              )}
            </AnimatePresence>
          </form>
        ) : (
          <div className="flex items-end justify-end w-full h-auto">
            <p className="text-[12.5px] underline cursor-pointer" onClick={() => setClose(false)}>
              Show more
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
