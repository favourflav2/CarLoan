import * as React from "react";
import { USDollar } from "../CarPage";
import { CarObjWithFormattedData } from "../../../redux/features/modalSlices/carModalSlice";
import CompareLoamCard from "../../../components/cards/CompareLoanCard";
import { MonthlyPayment } from "../../../components/helperFunctions/loanfunctions/LoanFunction";

export interface IExtraMonthlyBoxProps {
  header: string;
  selectedGoal: CarObjWithFormattedData;
  extraMonthlyPayment: number;
  numberOfMonths: number;
  monthlyPayment: MonthlyPayment;
  getExtraPaymentTotalPaid(
    months: number,
    monthlyP: number,
    downPayment: number,
    carPrice: number
  ):
    | {
        nonFormattedValue: number;
        formattedValue: string;
        interestNonFormattedValue: string;
        interestFormattedValue: number;
      }
    | {
        nonFormattedValue: number;
        formattedValue: string;
        interestNonFormattedValue: number;
        interestFormattedValue: string;
      };
}

export default function ExtraMonthlyBox({ header, selectedGoal, extraMonthlyPayment, numberOfMonths, monthlyPayment, getExtraPaymentTotalPaid }: IExtraMonthlyBoxProps) {
  return (
    <>
      {selectedGoal.extraPayment > 0 && (
        <div className="w-full h-auto flex flex-col">
          {/*Top */}
          <div className="flex w-full flex-col mb-3">
            <h1 className=" italic text-[20px]">{header}</h1>
            <h1 className=" text-[24px] underline">{USDollar.format(Number(extraMonthlyPayment?.toFixed(2)))}</h1>
          </div>

          <div className="w-full flex flex-col">
            {/* Loan Amount */}
            <div className="w-full flex flex-col h-auto">
              <div className="w-full justify-between items-center flex">
                <h1 className="text-[15px]">Loan Amount</h1>
                <h1 className="text-[15px] text-gray-500 dark:text-gray-400 font-semibold">{USDollar.format(Number((selectedGoal.price - selectedGoal.downPayment).toFixed(2)))}</h1>
              </div>

              <hr className="border border-gray-300 mt-1 mb-2" />
            </div>

            {/* Total Interest */}
            <CompareLoamCard
              type="Car"
              value={getExtraPaymentTotalPaid(numberOfMonths, extraMonthlyPayment, selectedGoal.downPayment, selectedGoal.price)?.interestFormattedValue}
              title="Total Interest"
              compareExtra={Number(getExtraPaymentTotalPaid(numberOfMonths, extraMonthlyPayment, selectedGoal.downPayment, selectedGoal.price)?.interestNonFormattedValue)}
              compareReg={monthlyPayment?.interestSum}
            />

            {/* Term */}
            {<CompareLoamCard type="Car" value={numberOfMonths} title="Term (months)" compareExtra={numberOfMonths} compareReg={selectedGoal?.term} />}

            {/* Total Amount Paid*/}
            <CompareLoamCard
              type="Car"
              value={getExtraPaymentTotalPaid(numberOfMonths, extraMonthlyPayment, selectedGoal.downPayment, selectedGoal.price)?.formattedValue}
              title="Total Amount Paid"
              compareExtra={getExtraPaymentTotalPaid(numberOfMonths, extraMonthlyPayment, selectedGoal.downPayment, selectedGoal.price)?.nonFormattedValue}
              compareReg={monthlyPayment?.totalAmountPaid}
            />
          </div>
        </div>
      )}
    </>
  );
}
