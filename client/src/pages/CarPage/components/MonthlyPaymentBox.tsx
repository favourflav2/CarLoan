import * as React from "react";
import { CarObjWithFormattedData } from "../../../redux/features/modalSlices/carModalSlice";
import { USDollar } from "../CarPage";
import { MonthlyPayment } from "../../../components/helperFunctions/loanfunctions/LoanFunction";
import { HouseObjWithFormattedData } from "../../../redux/features/modalSlices/houseSlice";

export interface IMonthlyPaymentBoxProps {
  header: string;
  selectedGoal: CarObjWithFormattedData | HouseObjWithFormattedData;
  monthlyPayment: MonthlyPayment;
}

export default function MonthlyPaymentBox({ header, selectedGoal, monthlyPayment }: IMonthlyPaymentBoxProps) {
  
  return (
    <div className="w-full h-auto flex flex-col">
      {/* Top */}
      <div className="flex w-full flex-col mb-3">
        <h1 className=" italic text-[20px]">{header}</h1>
        <h1 className={` text-[24px] underline  `}>{USDollar.format(Number(monthlyPayment?.monthlyPayment.toFixed(2)))}</h1>
      </div>

      {/* Bottom */}
      <div className={`w-full flex flex-col `}>
        {/* Loan Amount */}
        <div className="w-full flex flex-col h-auto">
          <div className="w-full justify-between items-center flex">
            <h1 className="text-[15px]">Loan Amount</h1>
            <h1 className={` text-[15px] font-semibold text-gray-500 dark:text-gray-400`}>{USDollar.format(Number((selectedGoal.price - selectedGoal.downPayment).toFixed(2)))}</h1>
          </div>

          <hr className="border border-gray-300 mt-1 mb-2" />
        </div>

        {/* Total Interest */}
        <div className="w-full flex flex-col h-auto">
          <div className="w-full justify-between items-center flex">
            <h1 className="text-[15px]">Total Interest</h1>
            <h1 className={` text-[15px] font-semibold ${selectedGoal.extraPayment > 0 ? "text-red-500" : "text-chartGreen"}`}>{USDollar.format(Number(monthlyPayment?.interestSum.toFixed(2)))}</h1>
          </div>

          <hr className="border border-gray-300 mt-1 mb-2" />
        </div>

        {/* Term */}
        <div className="w-full flex flex-col h-auto">
          <div className="w-full justify-between items-center flex">
            <h1 className="text-[15px]">{selectedGoal.type === "Car" ? 'Term (months)' : 'Term (years)'}</h1>
            <h1 className={` text-[15px] font-semibold ${selectedGoal.extraPayment > 0 ? "text-red-500" : "text-chartGreen"}`}>{selectedGoal.type === "Car" ? `${selectedGoal.term} months` : `${selectedGoal.term} years`}</h1>
          </div>

          <hr className="border border-gray-300 mt-1 mb-2" />
        </div>

        {/* Total Amount Paid*/}
        <div className="w-full flex flex-col h-auto">
          <div className="w-full justify-between items-center flex">
            <h1 className="text-[15px]">Total Amount Paid</h1>
            <h1 className={` text-[15px] font-semibold ${selectedGoal.extraPayment > 0 ? "text-red-500" : "text-chartGreen"}`}>
              {USDollar.format(Number(monthlyPayment?.totalAmountPaid.toFixed(2)))}
            </h1>
          </div>

          <hr className="border border-gray-300 mt-1 mb-2" />
        </div>
      </div>
    </div>
  );
}
