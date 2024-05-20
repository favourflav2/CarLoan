import * as React from 'react';
import { ItemDetailsState } from '../../../redux/features/carStateSlice';
import { USDollar } from '../../CarPage/CarPage';

export interface IMonthlyPaymentBoxItemDetailsProps {
    itemDetailsState: ItemDetailsState;
    monthlyPayment: {
        monthlyPayment: number;
        totalWithInterest: number;
        extraMonthlyPayment: number;
        interestSum: number;
        totalAmountPaid: number;
    };
    header:string;
}

export default function MonthlyPaymentBoxItemDetails ({itemDetailsState,monthlyPayment, header}: IMonthlyPaymentBoxItemDetailsProps) {
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
            <h1 className={` text-[15px] font-semibold text-gray-500 dark:text-gray-400`}>{USDollar.format(Number((itemDetailsState.price - itemDetailsState.downPayment).toFixed(2)))}</h1>
          </div>

          <hr className="border border-gray-300 mt-1 mb-2" />
        </div>

        {/* Total Interest */}
        <div className="w-full flex flex-col h-auto">
          <div className="w-full justify-between items-center flex">
            <h1 className="text-[15px]">Total Interest</h1>
            <h1 className={` text-[15px] font-semibold ${itemDetailsState.extraPayment > 0 ? "text-red-500" : "text-chartGreen"}`}>{USDollar.format(Number(monthlyPayment?.interestSum.toFixed(2)))}</h1>
          </div>

          <hr className="border border-gray-300 mt-1 mb-2" />
        </div>

        {/* Term */}
        <div className="w-full flex flex-col h-auto">
          <div className="w-full justify-between items-center flex">
            <h1 className="text-[15px]">'Term (months)'</h1>
            <h1 className={` text-[15px] font-semibold ${itemDetailsState.extraPayment > 0 ? "text-red-500" : "text-chartGreen"}`}>{itemDetailsState.term} months </h1>
          </div>

          <hr className="border border-gray-300 mt-1 mb-2" />
        </div>

        {/* Total Amount Paid*/}
        <div className="w-full flex flex-col h-auto">
          <div className="w-full justify-between items-center flex">
            <h1 className="text-[15px]">Total Amount Paid</h1>
            <h1 className={` text-[15px] font-semibold ${itemDetailsState.extraPayment > 0 ? "text-red-500" : "text-chartGreen"}`}>
              {USDollar.format(Number(monthlyPayment?.totalAmountPaid.toFixed(2)))}
            </h1>
          </div>

          <hr className="border border-gray-300 mt-1 mb-2" />
        </div>
      </div>
    </div>
  );
}
