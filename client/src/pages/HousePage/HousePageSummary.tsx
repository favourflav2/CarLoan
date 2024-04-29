import * as React from 'react';
import { HouseObjWithFormattedData } from '../../redux/features/modalSlices/houseSlice';
import { ExtraNumberYears, HouseMonthlyPayment } from '../../components/helperFunctions/loanfunctions/HouseLoanFuntion';
import { USDollar } from '../CarPage/CarPage';
import MonthlyPaymentBox from '../CarPage/components/MonthlyPaymentBox';
import ExtraNumberOfYearsBox from './components/ExtraNumberOfYearsBox';

export interface IHousePageSummaryProps {
    selectedGoal: HouseObjWithFormattedData
    monthlyPayment: HouseMonthlyPayment;
    extraNumberOfYears: ExtraNumberYears | undefined
}

export default function HousePageSummary ({selectedGoal, monthlyPayment,extraNumberOfYears}: IHousePageSummaryProps) {

     // values obj destructure
  const numberOfYears = extraNumberOfYears?.numberOfYears ? extraNumberOfYears.numberOfYearsNoRounding : undefined;
  const extraMonthlyPayment = monthlyPayment?.extraMonthlyPayment ? monthlyPayment?.extraMonthlyPayment : undefined;

  function getExtraPaymentTotalPaid(years: number, monthlyP: number, downPayment: number, price: number) {
    if (!years || !monthlyP! || !downPayment || !price) return undefined

    const value = (years * monthlyP * 12) + downPayment;
    const loanAmount = price - downPayment
    const totalAmountPaidWithNoDownPayment = (monthlyP * 12 * years)
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
          {extraMonthlyPayment && numberOfYears && <ExtraNumberOfYearsBox
            header="Extra Monthly Payment"
            selectedGoal={selectedGoal}
            extraMonthlyPayment={extraMonthlyPayment}
            numberOfYears={numberOfYears}
            monthlyPayment={monthlyPayment}
            getExtraPaymentTotalPaid={getExtraPaymentTotalPaid}
          />}
        </div>
      </div>
    </div>
  );
}
