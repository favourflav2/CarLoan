import * as React from "react";
import { CarObjWithFormattedData } from "../../redux/features/modalSlices/carModalSlice";
import { ExtraNumberMonths } from "../../components/helperFunctions/loanfunctions/LoanFunction";
import { MonthlyPayment } from "../../components/helperFunctions/loanfunctions/LoanFunction";
import { USDollar } from "./CarPage";
import MonthlyPaymentBox from "./components/MonthlyPaymentBox";
import ExtraMonthlyBox from "./components/ExtraMonthlyBox";

export interface ICarPageSummaryProps {
  selectedGoal: CarObjWithFormattedData;
  monthlyPayment: MonthlyPayment;
  extraNumberOfMonths: ExtraNumberMonths | undefined;
}

export interface AllMonths extends MonthlyPayment {
  term: number;
}

export default function CarPageSummary({ selectedGoal, monthlyPayment, extraNumberOfMonths }: ICarPageSummaryProps) {
  // values obj destructure
  const numberOfMonths = extraNumberOfMonths?.numberOfMonths ? extraNumberOfMonths.numberOfMonthsNoRounding : 0;
  const extraMonthlyPayment = monthlyPayment?.extraMonthlyPayment ? monthlyPayment?.extraMonthlyPayment : 0;

  function getExtraPaymentTotalPaid(months: number, monthlyP: number, downPayment: number, carPrice: number) {
    if (!months || !monthlyP! || !downPayment === undefined || !carPrice) return { nonFormattedValue: 0, formattedValue: "", interestNonFormattedValue: "", interestFormattedValue: 0 };

    const value = months * monthlyP + downPayment;
    const loanAmount = carPrice - downPayment
    const totalAmountPaidWithNoDownPayment = (monthlyP * months)
    const value2 = Number(Math.abs(totalAmountPaidWithNoDownPayment - loanAmount));

    return {
      nonFormattedValue: value,
      formattedValue: USDollar.format(Number(value.toFixed(2))),
      interestNonFormattedValue: value2,
      interestFormattedValue: USDollar.format(Number(value2.toFixed(2))),
    };
  }

  return (
    <div className="w-full h-auto">
      {/* Content */}
      <div className="w-full h-full flex flex-col">
        <h1 className="my-3 font-semibold">Your Loan Estimate</h1>

        <div className="w-auto grid md:grid-cols-2 md:gap-x-10 grid-cols-1 gap-y-7">
          {/* 1st Box */}
          <MonthlyPaymentBox header="Monthly Payment" selectedGoal={selectedGoal} monthlyPayment={monthlyPayment} />

          {/* 2nd Box Extra Monthly Payment */}
          <ExtraMonthlyBox
            header="Extra Monthly Payment"
            selectedGoal={selectedGoal}
            extraMonthlyPayment={extraMonthlyPayment}
            numberOfMonths={numberOfMonths}
            monthlyPayment={monthlyPayment}
            getExtraPaymentTotalPaid={getExtraPaymentTotalPaid}
          />
        </div>
      </div>
    </div>
  );
}
