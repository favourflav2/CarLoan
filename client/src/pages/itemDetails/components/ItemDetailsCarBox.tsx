import * as React from "react";
import { DataObj } from "../../../redux/features/carSlice";
import { USDollar } from "../../CarPage/CarPage";
import { FieldErrors } from "react-hook-form";

import { ItemDetailsState } from "../../../redux/features/carStateSlice";

export interface IItemDetailsCarBoxProps {
  singleCar: DataObj;

  errors: FieldErrors<{
    price: string;
    downPayment: string;
    interest: string;
    term: number;
    extraPayment: string;
  }>;
  itemDetailsState: ItemDetailsState;
}

export default function ItemDetailsCarBox({ singleCar, errors, itemDetailsState }: IItemDetailsCarBoxProps) {
  const errorArray = Object.keys(errors);

  return (
    <div className="w-auto flex flex-col sm:ml-4  mt-4 sm:mt-0">
      <h1 className="text-[15px]">
        <span className="font-bold text-[15px]">Car Name/Modal:</span> {singleCar.name_modal}
      </h1>
      <h1 className="text-[15px]">
        <span className="font-bold text-[15px]">Price:</span> <span className="text-chartYellow font-bold"> {USDollar.format(singleCar.price)}</span>
      </h1>
      {!Number.isNaN(itemDetailsState.downPayment) && (
        <h1 className="text-[15px]">
          <span className="font-bold text-[15px]">Down Payment:</span> <span className="text-red-500 font-bold"> {USDollar.format(itemDetailsState.downPayment)}</span>
        </h1>
      )}
      <h1 className="text-[15px]">
        <span className="font-bold text-[15px]">Miles:</span> {singleCar.mileage.toLocaleString()} miles
      </h1>

      <h1 className="text-[15px]">
        <span className="font-bold text-[15px]">Term:</span> {itemDetailsState.term} months
      </h1>
      <h1 className="text-[15px]">
        <span className="font-bold text-[15px]">Interest Rate:</span> {itemDetailsState.interest}%
      </h1>

      {!errorArray.includes("downPayment") && (
        <h1 className="text-[15px]">
          <span className="font-bold text-[15px]">Loan Amount:</span> <span className="text-chartGreen font-bold">{USDollar.format(singleCar.price - itemDetailsState.downPayment)}</span>
        </h1>
      )}
    </div>
  );
}
