import * as React from "react";
import { Controller, FieldErrors, Control, UseFormSetValue } from "react-hook-form";
import { NumericFormat } from "react-number-format";
import { FormFieldsItemDetails } from "../hooks/useItemDetailsFormHook";
import { termArr } from "../../../components/multiStepDivs/carDivs/CarComponets/Car1stInputs";

export interface IItemDetailsInputCardProps {
  name: "price" | "downPayment" | "interest" | "extraPayment" | "term";
  placeholder: string;
  type: "Number" | "Percent";
  label: string;
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
    any
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
}

export default function ItemDetailsInputCard({ errors, control, name, label, placeholder, type, allInputData, setValue }: IItemDetailsInputCardProps) {
  return (
    <div className={`w-full  flex flex-col ${name === "price" ? "" : "mb-3"}`}>
      <label htmlFor={name} className="text-[12px] dark:text-gray-300 text-black">
        {label}
      </label>

      {name === "term" ? (
        <select
          name="term"
          onChange={(e) => setValue("term", parseFloat(e.target.value))}
          value={allInputData.term}
          className={`outline-none border h-[38px] w-full border-black text-black  dark:border-none p-[6px] mt-1 bg-white placeholder:text-[15px] ${
            errors[name as keyof FormFieldsItemDetails] && "border-2 border-red-500"
          }`}
        >
          {termArr.map((item: number) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      ) : (
        <Controller
          render={({ field: { onChange, value } }) => (
            <NumericFormat
              className={`outline-none border w-full border-black text-black  dark:border-none p-[6px] mt-1 bg-white placeholder:text-[15px] ${
                errors[name as keyof FormFieldsItemDetails] && "border-2 border-red-500"
              }`}
              prefix={`${type === "Number" ? "$" : ""}`}
              suffix={`${type === "Percent" ? "%" : ""}`}
              thousandSeparator=","
              decimalSeparator="."
              readOnly={name === "price" ? true : false}
              decimalScale={2}
              autoComplete="off"
              placeholder={placeholder}
              allowNegative={false}
              onValueChange={(v) => {
                onChange(v.value);
              }}
              value={value}
            />
          )}
          name={name}
          control={control}
        />
      )}
      {name === "price" && <p className="w-full flex items-end justify-end text-[10px] mt-[1px]">Read Only</p>}
      {errors?.[name as keyof FormFieldsItemDetails] && <p className="text-red-500 text-[13px] ">{errors?.[name]?.message}</p>}
    </div>
  );
}
