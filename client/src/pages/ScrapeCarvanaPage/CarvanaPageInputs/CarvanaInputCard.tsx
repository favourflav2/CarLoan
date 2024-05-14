import * as React from "react";
import { Controller } from "react-hook-form";
import { NumericFormat } from "react-number-format";
import { FormFields } from "../hooks/useFormHook";
import { ICarvanaInputCardProps } from "../hooks/useFormHook";





export default function CarvanaInputCard({ errors, control, name, label, placeholder, type, breakPoint }: ICarvanaInputCardProps) {
  return (
    <div className={`w-full h-auto flex flex-col`}>
      {/* <label htmlFor={name} className="text-[12px] dark:text-gray-300 text-black">
        {label}
      </label> */}

      <Controller
        render={({ field: { onChange, value } }) => (
          <NumericFormat
            className={`outline-none w-full border rounded-sm border-black text-black  dark:border-none p-[6px] mt-1 bg-white placeholder:text-[15px] ${
              errors[name as keyof FormFields] && "border-2 border-red-500"
            }`}
            prefix={`${type === "Number" ? "$" : ""}`}
            suffix={`${type === "Percent" ? "%" : ""}`}
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
      {errors?.[name as keyof FormFields] && <p className="text-red-500 text-[12px] mt-1 ">{errors?.[name]?.message}</p>}
    </div>
  );
}
