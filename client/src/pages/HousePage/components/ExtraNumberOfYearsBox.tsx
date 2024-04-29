import * as React from "react";
import { HouseObjWithFormattedData } from "../../../redux/features/modalSlices/houseSlice";
import { HouseMonthlyPayment } from "../../../components/helperFunctions/loanfunctions/HouseLoanFuntion";
import { USDollar } from "../../CarPage/CarPage";
import CompareLoanCard from "../../../components/cards/CompareLoanCard";

export interface IExtraNumberOfYearsBoxProps {
  header: string;
  selectedGoal: HouseObjWithFormattedData;
  extraMonthlyPayment: number;
  numberOfYears: number;
  monthlyPayment: HouseMonthlyPayment;
  getExtraPaymentTotalPaid(
    years: number,
    monthlyP: number,
    downPayment: number,
    price: number
  ):
    | {
        nonFormattedValue: number;
        formattedValue: string;
        interestNonFormattedValue: number;
        interestFormattedValue: string;
      }
    | undefined;
}

export default function ExtraNumberOfYearsBox({ header, selectedGoal, extraMonthlyPayment, numberOfYears, monthlyPayment, getExtraPaymentTotalPaid }: IExtraNumberOfYearsBoxProps) {
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
            {getExtraPaymentTotalPaid(numberOfYears, extraMonthlyPayment, selectedGoal.downPayment, selectedGoal.price) && (
              <CompareLoanCard
                type="House"
                value={getExtraPaymentTotalPaid(numberOfYears, extraMonthlyPayment, selectedGoal.downPayment, selectedGoal.price)?.interestFormattedValue}
                title="Total Interest"
                compareExtra={Number(getExtraPaymentTotalPaid(numberOfYears, extraMonthlyPayment, selectedGoal.downPayment, selectedGoal.price)?.interestNonFormattedValue)}
                compareReg={monthlyPayment?.interestSum}
              />
            )}

            {/* Term */}
            {<CompareLoanCard type="House" value={numberOfYears} title="Term (years)" compareExtra={numberOfYears} compareReg={selectedGoal?.term} />}

            {/* Total Amount Paid*/}
            {getExtraPaymentTotalPaid(numberOfYears, extraMonthlyPayment, selectedGoal.downPayment, selectedGoal.price) && (
              <CompareLoanCard
                type="House"
                value={getExtraPaymentTotalPaid(numberOfYears, extraMonthlyPayment, selectedGoal.downPayment, selectedGoal.price)?.formattedValue}
                title="Total Amount Paid"
                compareExtra={Number(getExtraPaymentTotalPaid(numberOfYears, extraMonthlyPayment, selectedGoal.downPayment, selectedGoal.price)?.nonFormattedValue)}
                compareReg={monthlyPayment?.totalAmountPaid}
              />
            )}
          </div>
        </div>
      )}
    </>
  );
}
