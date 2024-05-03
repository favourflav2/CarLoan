
import * as React from "react";
import { Controller, FieldErrors, Control } from "react-hook-form";
import { NumericFormat } from "react-number-format";

export interface IHouseControllerInputProps {
  label: string;
  name: "price" | "downPayment" | "interest" | "mortgageInsurance" | "extraPayment" | "propertyTax" | "insurance"
  placeholder: string;
  type: "Number" | "Percent";
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
}>
  control: Control<{
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
}, any, {
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
}>
}

type FormFields = {
  price: string;
  downPayment: string;
  interest: string;
  streetAddress: string;
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
}

export default function HouseControllerInput({ errors, control, name, label, placeholder, type }: IHouseControllerInputProps) {
  return (
    <div className="w-full  flex flex-col mb-3">
      <label htmlFor={name} className="text-[12px] dark:text-gray-300 text-black">
        {label}
      </label>

      <Controller
        render={({ field: { onChange, value } }) => (
          <NumericFormat
            className={`outline-none border border-black text-black  dark:border-none p-[6px] mt-1 bg-white placeholder:text-[15px] ${errors[name as keyof FormFields] && "border-2 border-red-500"}`}
            prefix={`${type === "Number" ? '$' : ''}`}
            suffix={`${type === "Percent" ? '%' : ''}`}
            thousandSeparator=","
            decimalSeparator="."
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
      {errors?.[name as keyof FormFields] && <p className="text-red-500 text-[13px] ">{errors?.[name]?.message}</p>}
      {!errors?.[name as keyof FormFields] && name === "mortgageInsurance" && <p className="text-orange-800 dark:text-orange-400 text-[13px] mt-[1px] ">Since your down payment is less than 20%, you will need to pay mortgage insurance</p>}
    </div>
  );
}
