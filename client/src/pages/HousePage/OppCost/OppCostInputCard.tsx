import * as React from "react";
import { Controller, FieldErrors, Control } from "react-hook-form";
import { NumericFormat } from "react-number-format";
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import { Tooltip } from "@mui/material";

export interface IOppCostInputCardProps {
  name: "interest" | "rent" | "propertyTax" | "appreciation" | "maintenance" | "opportunityCostRate";
  placeholder: string;
  tooltip:string;
  type: "Number" | "Percent";
  label: string;
  errors: FieldErrors<{
    interest: string;
    propertyTax: string;
    appreciation: string;
    opportunityCostRate: string;
    maintenance: string;
    rent: string;
  }>;
  control: Control<
    {
      opportunityCostRate: string;
      maintenance: string;
      rent: string;
      appreciation: string;
      propertyTax: string;
      interest: string;
    },
    any
  >;
}
type FormFields = {
  interest: string;
  rent: string;
  propertyTax: string;
  appreciation: string;
  opportunityCostRate: string;
  maintenance: string;
};

export default function OppCostInputCard({ errors, control, name, label, placeholder, type,tooltip }: IOppCostInputCardProps) {
  return (
    <div className="w-full  flex flex-col mb-3">
      <div className="w-auto flex ">
        <label htmlFor={name} className="text-[12px] dark:text-gray-300 text-black">
          {label}
        </label>

        <Tooltip title={`${tooltip}`} placement="top-end">
            <HelpOutlineIcon className="text-[15px] ml-[2px]"/>
        </Tooltip>
      </div>

      <Controller
        render={({ field: { onChange, value } }) => (
          <NumericFormat
            className={`outline-none border border-black text-black  dark:border-none p-[6px] mt-1 bg-white placeholder:text-[15px] ${errors[name as keyof FormFields] && "border-2 border-red-500"}`}
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
      {errors?.[name as keyof FormFields] && <p className="text-red-500 text-[13px] ">{errors?.[name]?.message}</p>}
    </div>
  );
}
