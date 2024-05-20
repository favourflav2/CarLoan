import * as React from 'react';
import { MonthlyPayment } from '../../../components/helperFunctions/loanfunctions/LoanFunction';
import { ItemDetailsState } from '../../../redux/features/carStateSlice';
import { USDollar } from '../../CarPage/CarPage';
import CompareLoanCard from '../../../components/cards/CompareLoanCard';

export interface IExtraMonthlyBoxItemDetailsProps {
    header: string;
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
          extraMonthlyPayment: number;
          numberOfMonths: number;
          monthlyPayment: MonthlyPayment;
          itemDetailsState: ItemDetailsState;
}

export default function ExtraMonthlyBoxItemDetails ({ header, itemDetailsState, extraMonthlyPayment, numberOfMonths, monthlyPayment, getExtraPaymentTotalPaid }: IExtraMonthlyBoxItemDetailsProps) {
  return (
    <>
      {itemDetailsState.extraPayment > 0 && (
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
                <h1 className="text-[15px] text-gray-500 dark:text-gray-400 font-semibold">{USDollar.format(Number((itemDetailsState.price - itemDetailsState.downPayment).toFixed(2)))}</h1>
              </div>

              <hr className="border border-gray-300 mt-1 mb-2" />
            </div>

            {/* Total Interest */}
            <CompareLoanCard
              type="Car"
              value={getExtraPaymentTotalPaid(numberOfMonths, extraMonthlyPayment, itemDetailsState.downPayment, itemDetailsState.price)?.interestFormattedValue}
              title="Total Interest"
              compareExtra={Number(getExtraPaymentTotalPaid(numberOfMonths, extraMonthlyPayment, itemDetailsState.downPayment, itemDetailsState.price)?.interestNonFormattedValue)}
              compareReg={monthlyPayment?.interestSum}
            />

            {/* Term */}
            {<CompareLoanCard type="Car" value={numberOfMonths} title="Term (months)" compareExtra={numberOfMonths} compareReg={itemDetailsState?.term} />}

            {/* Total Amount Paid*/}
            <CompareLoanCard
              type="Car"
              value={getExtraPaymentTotalPaid(numberOfMonths, extraMonthlyPayment, itemDetailsState.downPayment, itemDetailsState.price)?.formattedValue}
              title="Total Amount Paid"
              compareExtra={getExtraPaymentTotalPaid(numberOfMonths, extraMonthlyPayment, itemDetailsState.downPayment, itemDetailsState.price)?.nonFormattedValue}
              compareReg={monthlyPayment?.totalAmountPaid}
            />
          </div>
        </div>
      )}
    </>
  );
}
