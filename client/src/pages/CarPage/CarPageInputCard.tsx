import * as React from "react";
import { NumericFormat } from "react-number-format";
import { Controller, FieldErrors, Control } from "react-hook-form";
import CustomSlider from "../../components/customSlider/CustomSlider";
import { IndexNames } from "./CarPageInputs";

export interface ICarPageInputCardProps {
  label: string;
  min: number;
  max: number;
  indexName: IndexNames;
  handleSliderChange: (event: Event, newValue: number | number[], name: "mileage" | "price" | "downPayment" | "interest" | "term" | "salary") => void;
  errors: FieldErrors<{
    mileage: string;
    price: string;
    downPayment: string;
    interest: string;
    id: string;
    name: string;
    term: number;
    salary: string;
    modal: string;
    img?: any;
  }>;
  allInputData: {
    name: string;
    modal: string;
    price: string;
    mileage: string;
    downPayment: string;
    interest: string;
    salary: string;
    term: number;
    id: string;
    img?: any;
  };
  control: Control<{
    mileage: string;
    price: string;
    downPayment: string;
    interest: string;
    id: string;
    name: string;
    term: number;
    salary: string;
    modal: string;
    extraPayment: string;
    img?: any;
}, any, {
    mileage: string;
    price: string;
    downPayment: string;
    interest: string;
    id: string;
    name: string;
    term: number;
    salary: string;
    modal: string;
    extraPayment: string;
    img?: any;
}>


  updateList: string[]
}
type objError = {
  mileage: string;
  price: string;
  downPayment: string;
  interest: string;
  id: string;
  name: string;
  term: number;
  salary: string;
  modal: string;
  img?: any;
};

type ControlType = {
  name: string;
  modal: string;
  price: string;
  mileage: string;
  downPayment: string;
  interest: string;
  salary: string;
  term: number;
  id: string;
  img?: any;
};

export default function CarPageInputCard({ label, min, max, handleSliderChange, allInputData, errors, control, indexName, updateList }: ICarPageInputCardProps) {
  const USDollar = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: `USD`,
  });

  function prefixSwitch(type:IndexNames){
    switch(type){
      case "term":
        return ""
      case "interest":
        return ""
      default:
        return "$"
    }
  }

 function suffixSwitch(type:IndexNames){
  switch(type){
    case "term":
      return " months"
    case "interest":
      return "%"
    default:
      return ""
  }
  }

  function maxAndMinSwitch(type:IndexNames, min:number, max:number){
    switch(type){
      case "term":
        return {
          min: `${min}(mths)`,
          max: `${max}(mths)`
        }
      case "interest":
        return {
          min:`${min}%`,
          max: `${max}%`
        }
      default:
        return {
          min: USDollar.format(min),
          max: USDollar.format(max)
        }
    }
  }

  

  return (
    <div className="w-full flex flex-col">
      <div className="w-full flex flex-col mb-7 justify-center items-center">
        <label htmlFor="" className="text-[16px] underline font-semibold ">
          {label}
        </label>
        <Controller
          render={({ field: { onChange, value } }) => (
            <NumericFormat
              className={`max-w-[120px] text-[15px] outline-none text-center bg-inherit border-b border-gray-300 ${errors[indexName as keyof objError] && "border-2 border-red-500"}`}
              prefix={prefixSwitch(indexName)}
              suffix={suffixSwitch(indexName)}
              thousandSeparator=","
              decimalSeparator="."
              decimalScale={2}
              autoComplete="off"
              allowNegative={false}
              onValueChange={(v) => {
                onChange(indexName === "term" ? Number(v.value) : v.value);
              }}
              value={value}
            />
          )}
          name={`${indexName as keyof ControlType}`}
          control={control}
        />
      </div>

      {/* Slider */}
      <div className="w-full flex items-center">
        <p className="text-gray-500 dark:text-gray-400 text-[15px] mr-1">{maxAndMinSwitch(indexName,min,max).min}</p>
        <CustomSlider
          value={parseInt(allInputData[indexName as keyof ControlType])}
          handleSliderChange={(e: any) => handleSliderChange(e, e.target.value, `${indexName}`)}
          indexName={indexName}
          max={max}
          min={min}
          updateList={updateList}
        />
        <p className="text-gray-500 dark:text-gray-400 text-[15px] ml-1">{maxAndMinSwitch(indexName,min,max).max}</p>
      </div>
      {errors[indexName as keyof objError]?.message && <p className="text-red-500 text-[13px] ">{errors[indexName as keyof ControlType]?.message?.toString()}</p>}
    </div>
  );
}
