import * as React from 'react';
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import HelpIcon from "@mui/icons-material/Help";
import { Tooltip } from "@mui/material";
import { USDollar } from '../../pages/CarPage/CarPage';
import { AllMonths } from '../../pages/CarPage/CarPageSummary';

export interface ITermCardProps {
    currentMonthlyPayment: number;
    currentInterestSum: number;
    currentTotalAmountPaid: number;
    obj: AllMonths
}

export default function TermCard ({currentInterestSum,currentMonthlyPayment,currentTotalAmountPaid,obj}: ITermCardProps) {
  return (
    <div className="h-auto p-4 w-full border-chartGreen border-2 rounded-md">
    {/* Content */}
    <div className="text-lightText dark:text-darkText w-full flex flex-col">
      {/* title term */}
      <div className="w-full h-auto flex flex-col items-center mb-3">
        <div className="w-auto flex">
          <h1 className="underline text-[22px]">{obj.term} Months</h1>
          <Tooltip title={`All values are being compared to the original loan estimate (${USDollar.format(Number(currentMonthlyPayment.toFixed(2)))})`} placement="top">
            <HelpIcon className="text-gray-400 text-[16px]" />
          </Tooltip>
        </div>
      </div>

      <div className="w-full h-auto flex flex-col items-center justify-center">
        {/* Total number of payments */}
        <div className="w-auto flex items-center mb-1">
          <h1 className='hidden lg:block'>Total number of {obj.term} payments:</h1>
          <h1 className='block lg:hidden'> {obj.term} payments:</h1>
          <div className={`w-auto flex items-center ml-[1px] ${currentTotalAmountPaid > obj.totalAmountPaid ? "text-chartGreen" : "text-red-500"}`}>
            {currentTotalAmountPaid > obj.totalAmountPaid ? <ArrowDropDownIcon className="p-0 m-0 text-[17px]" /> : <ArrowDropUpIcon />}
            <h1 className="font-bold">{USDollar.format(Number(obj.totalAmountPaid.toFixed(2)))}</h1>
          </div>
        </div>

        {/* Monthly Payment */}
        <div className="w-auto flex items-center mb-1">
          <h1>Monthly payment:</h1>
          <div className={`w-auto flex items-center ml-[1px] ${currentMonthlyPayment > obj.monthlyPayment ? "text-chartGreen" : "text-red-500"}`}>
            {currentMonthlyPayment > obj.monthlyPayment ? <ArrowDropDownIcon className="p-0 m-0 text-[17px]" /> : <ArrowDropUpIcon />}
            <h1 className="font-bold">{USDollar.format(Number(obj.monthlyPayment.toFixed(2)))}</h1>
          </div>
        </div>

        {/* Total interest */}
        <div className="w-auto flex items-center mb-1">
          <h1>Total interest:</h1>
          <div className={`w-auto flex items-center ml-[1px] ${currentInterestSum > obj.interestSum ? "text-chartGreen" : "text-red-500"}`}>
            {currentInterestSum > obj.interestSum ? <ArrowDropDownIcon className="p-0 m-0 text-[17px]" /> : <ArrowDropUpIcon />}
            <h1 className="font-bold">{USDollar.format(Number(obj.interestSum.toFixed(2)))}</h1>
          </div>
        </div>
      </div>

      {/* Explain */}
      <div className="w-full h-auto flex flex-col justify-center items-center my-2">
        {currentTotalAmountPaid > obj.totalAmountPaid ? (
          <div>
            <p className="text-[13px]">By paying of the loan faster you may have to pay a higher monthly payment. But you will save money in the long run.</p>
            <p className=" text-center text-[15px] mt-1">
              In this case you will save{" "}
              <span className="text-[16px] font-bold text-chartGreen underline">{USDollar.format(Number((currentTotalAmountPaid - obj.totalAmountPaid).toFixed(2)))}</span>
            </p>
          </div>
        ) : (
          <div>
            <p className="text-[13px]">By paying of the loan slower you will pay a smaller monthly payment. But you will pay more in interest over the long run.</p>
            <p className=" text-center text-[15px] mt-1">
              In this case by extending your term to {obj.term} months you lose{" "}
              <span className="text-[16px] font-bold text-red-500 underline">{USDollar.format(Number((currentTotalAmountPaid - obj.totalAmountPaid).toFixed(2)))}</span>
            </p>
          </div>
        )}
      </div>
    </div>
  </div>
  );
}
